import pool from '../db.js';

/**
 * Description: Function to login
 * @param {*} email
 * @returns 
 */

export async function login (email) {
  if (!validEmail(email)) {
    return {code: 400, message: 'Email is required.'}
  }

  if (!await existingEmail(email)) {
		await pool.query(
			"INSERT INTO customers (email, signedUp) VALUES ($1, $2)",
			[email, false]
		);
    return { code: 200, message: 'Welcome new user!' }
	} else {
    return { code: 200, message: 'Welcome back!' }
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

export async function createOrder (email, ordersList, deliveryAddressProvided) {
  let totalCostCalculated = 0.0;

  if (!await existingEmail(email)) {
    return {
      code: 400,
      message: 'Invalid email!'
    };
  }

  if (!validAddress(deliveryAddressProvided)) {
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
        status, date, totalCost, deliveryAddress, orderConfirmation, customerId
      ) VALUES (
        'created', CURRENT_DATE, $1, $2, FALSE, (SELECT id FROM customers WHERE email = $3)
      ) RETURNING id`,
      [totalCostCalculated, deliveryAddressProvided, email]
    );
  
    const orderId = orderResult.rows[0].id;
    for (const order of ordersList) {
      await client.query(
        `INSERT INTO orderItems (orderId, productId, quantity
        ) VALUES (
          $1, (SELECT id FROM products WHERE name = $2), $3)`,
        [orderId, order.productname, order.productQuantity]
      );
    }

    await client.query('COMMIT');
    return {
      code: 201,
      message: 'Order created successfully'
    }

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
	await pool.query(
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
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper functions

function validEmail (email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email === '' || !(emailRegex.test(email)) || email === null || email === undefined) {
    return false;
  }
  return true ;
}

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

function validOrdersList(orderList) {
  if (orderList.length === 0 || orderList === null || orderList === undefined) {
    return false;
  }
  return true;
}

function validAddress(address) {
  if (address === '' || address === null || address === undefined) {
    return false;
  }
  return true;
}