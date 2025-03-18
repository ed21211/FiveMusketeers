import pool from '../db.js';

/**
 * Description: Function to login
 * @param {*} email
 * @returns 
 */

export async function login (email) {
  if (!validEmail(email)) {
    return {code: 400, message: 'Email is required.'};
  }

  if (!await existingEmail(email)) {
		await pool.query(
			"INSERT INTO customers (email, signedUp) VALUES ($1, $2)",
			[email, false]
		);
    return { code: 200, message: 'Welcome new user!' };
	} else {
    return { code: 200, message: 'Welcome back!' };
	}
}

/**
 * Description: Function to create an order from the buyer's provided details
 * @param {*} email 
 * @param {*} ordersList 
 * @param {*} deliveryAddress 
 * @param {*} totalCost 
 * @returns 
 */

export async function createOrder (email, ordersList, deliveryAddress) {
  let totalCostCalculated = 0.0;

  if (!await existingEmail(email)) {
    return {
      code: 400,
      message: 'Invalid email!'
    };
  }

  if (!validAddress(deliveryAddress)) {
    return {
      code: 400,
      message: 'Invalid delivery address'
    };
  }

  if (!validOrdersList(ordersList)) {
    return {
      code: 400,
      message: 'Invalid order list'
    };
  }

  for (const order of ordersList) {
    totalCostCalculated += parseFloat(order.productCost) * parseFloat(order.productQuantity);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // if order creation process fails, patial data will be removed
    const orderResult = await client.query(
      `INSERT INTO orderDetails (
        status, date, totalCost, deliveryAddress, deliveryMethod, orderConfirmation, customerId
      ) VALUES (
        'created', CURRENT_DATE, $1, $2, 'bird-mail', FALSE, (SELECT id FROM customers WHERE email = $3)
      ) RETURNING id`,
      [totalCostCalculated, deliveryAddress, email]
    );

    const orderId = orderResult.rows[0].id;
    for (const order of ordersList) {
      if (!await existingProduct(order.productId)) {
        return {
                code: 400,
                message: `Sorry, the product with id ${order.productId} does not exist`
      }
      }
      await client.query(
        `INSERT INTO orderItems (orderId, productId, quantity
        ) VALUES (
          $1, (SELECT id FROM products WHERE id = $2), $3)`,
        [orderId, order.productId, order.productQuantity]
      );
      console.log('+\n');
    }

    await client.query('COMMIT');
    return {
      code: 201,
      message: `Order created successfully. Your order id: ${orderId}`
    };

  } catch (error) {
    await client.query('ROLLBACK'); // removes all data 
    return {
      code: 500,
      message: 'Error creating order, please try again later.'
    };

  } finally {
    client.release(); // Release client back to the pool
  }
}

/**
 * Description: Function to update an existing order made by a buyer
 * @param {*} updatedOrdersList 
 * @param {*} orderId 
 * @returns 
 */
export async function updateOrder(updatedOrdersList, orderId) {
  const client = await pool.connect();
  if (!await existingOrderId(orderId)) {
    return {
      code: 400,
      message: 'Invalid order id'
    }
  }
  if (!validOrdersList(updatedOrdersList)) {
    return {
      code: 400,
      message: 'Invalid order list'
    }
  }

  let totalCostCalculated = 0.0;
  for (const order of updatedOrdersList) {
    totalCostCalculated += parseFloat(order.productCost) * parseFloat(order.productQuantity);
  }

  try {
    await client.query('BEGIN'); // if order updation process fails, patial data will be removed

   for (const order of updatedOrdersList) {
    await client.query(
      `UPDATE orderDetails SET status = 'updated', totalCost=$1 WHERE id = $2`,
      [totalCostCalculated, orderId]
    );

    await client.query(
      `UPDATE orderItems SET productId = $1, quantity = $2 WHERE  orderId = $3`,
      [order.productId, order.productQuantity, orderId]
    );
   }

    await client.query('COMMIT');
    return {
      code: 201,
      message: 'Order updated successfully'
    };
  } catch (error) {
    await client.query('ROLLBACK'); // removes all data 
    return {
      code: 500,
      message: 'Error updating order, please try again later.'
    };

  } finally {
    client.release(); // Release client back to the pool
  }
}

/**
 * Description: Function to delete an existing order made by a buyer 
 * @param {*} orderId 
 * @returns 
 */
export async function deleteOrder(orderId) {
  const client = await pool.connect();
  if (!existingOrderId(orderId)) {
    return {
      code: 400,
      message: 'Invalid order id'
    }
  }

  try {
    await client.query('BEGIN'); // if order deletion process fails, patial data will be removed
      await client.query(
        `DELETE FROM orderItems WHERE orderId = $1`,
        [orderId]
      );
      await client.query(
        `DELETE FROM orderDetails WHERE id = $1`,
        [orderId]
      );

    await client.query('COMMIT');
    return {
      code: 201,
      message: 'Order deleted successfully'
    };
  } catch (error) {
    await client.query('ROLLBACK'); // removes all data 
    return {
      code: 500,
      message: 'Error deleting order, please try again later.'
    };

  } finally {
    client.release(); // Release client back to the pool
  }
}

/**
 * Description: Function to log buyer out
 * @param {*} email
 * @returns 
 */
export async function signout( email ) {
  if (!await existingEmail(email)) {
    return {
      code: 400,
      message: 'Invalid email!'
    };
  }
	const result = await pool.query(
		"DELETE FROM customers WHERE email = $1 RETURNING *",
		[email]
	);

  if (result.rowCount === 0) {
    return {
      code: 400,
      message: 'Failed to log out, user not found!'
    };
  }

  return {
    code: 200,
    message: 'Logged out successfully.'
  };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper functions

/**
 * Description - Checks if email entered by user is valid
 * @param {*} email 
 * @returns 
 */
function validEmail (email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email === '' || !(emailRegex.test(email)) || email === null || email === undefined) {
    return false;
  }
  return true ;
}

/**
 * Description - Checks if the email provided exists in the database
 * @param {*} email 
 * @returns 
 */
async function existingEmail (email) {
  try {
    const existingEmail = await pool.query(
      "SELECT * FROM customers WHERE email = $1",
      [email]
    );
    return existingEmail.rows.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Description - Checks if the orderId provided exists in the database
 * @param {*} orderId 
 * @returns 
 */
async function existingOrderId (orderId) {
  try {
    const existingOrderId = await pool.query(
      "SELECT * FROM orderItems WHERE orderId = $1",
      [orderId]
    );
    return existingOrderId.rows.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Description - Checks if the productId provided exists in the database
 * @param {*} productId 
 * @returns 
 */
async function existingProduct (productId) {
  try {
    const existingProd = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );
    return existingProd.rows.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Description - Checks if the orderList is empty , undefined or null
 * @param {*} orderList 
 * @returns 
 */
function validOrdersList(orderList) {
  if (orderList.length === 0 || orderList === null || orderList === undefined) {
    return false;
  }
  return true;
}

/**
 * Description - Checks if the address provided is empty , undefined or null
 * @param {*} address 
 * @returns 
 */
function validAddress(address) {
  if (address === '' || address === null || address === undefined) {
    return false;
  }
  return true;
}