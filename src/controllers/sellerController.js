import pool from '../db.js';

/**
 * Description: Function to get all users
 * @param {*} 
 * @returns - Array of customers
 */

export async function users() {
    try {
        const users = await pool.query('SELECT *  FROM customers');
        return {
            code: 200,
            message: users.rows
        };
    } catch (error) {
        return { 
          code: 500, 
          message: 'Error getting users.'
        };
    }
}

/**
 * Description: Function to get all products
 * @param {*} 
 * @returns - Array of products
 */

export async function products() {
    try {
        const products = await pool.query('SELECT *  FROM products');
        return {
            code: 200,
            message: products.rows
        };
    } catch (error) {
        return { 
          code: 500, 
          message: 'Error getting products.'
        };
    }
}

/**
 * Description: Function to add to products list
 * @param {*} - Array of products to add
 * @returns
 */

export async function addProducts(products) {
    const client = await pool.connect();
    try {
        //BATCH INSERT
        const insertedProducts = products.map(product => {
            return client.query(
                `INSERT INTO products (name, cost, stockRemaining) 
                VALUES ($1, $2, $3)`,
                [product.name, product.cost, product.stockRemaining]
            );
        });

        await Promise.all(insertedProducts);

        return {
            code: 201,
            message: 'Products added successfully'
        };

    } catch (error) {
        console.error("Error during batch insert:", error);
        return { 
            code: 500, 
            message: 'Error adding products, please try again later.'
        };

    } finally {
        client.release(); // Release client back to the pool
    }
}

/**
 * This will return the order based on the orderId
 * @param {number} orderId 
 * @returns 
 */
export async function viewOrder(orderId) {
    const client = await pool.connect();
    try {    
        const result = await pool.query('SELECT * FROM orderDetails WHERE id = $1', [orderId]);

        if (result.rows.length === 0) {
            return {
                code: 404,
                message: `Order with ID ${orderId} is not found.`
            }
        }

        return {
            code: 200,
            message: result.rows[0]
        };
    } catch (error) {
        console.error("Error fetching order details:", error);
        return { 
            code: 500, 
            message: 'Error fetching the orders.'
        };
    } finally {
        client.release(); // Release client back to the pool
    }
}

/**
 * Get all of the orders linked to this buyer 
 * @param {number} customerId 
 * @returns 
 */
export async function viewBuyerOrders(customerId) {
    const client = await pool.connect();
    try {    
        const result = await pool.query(
            `Select o.id AS order_id, o.status, o.date, o.allowanceInstruction, 
             o.totalCost, o.trackingNumber, o.deliveryAddress, o.deliveryMethod, 
             o.discountOfferId, o.orderConfirmation
             FROM orderDetails o
             JOIN customers c ON o.customerId = c.id
             WHERE o.customerId = $1`, 
             [customerId]
        );

        if (result.rows.length === 0) {
            return {
                code: 404,
                message: `Order with ID ${customerId} is not found.`
            }
        }

        return {
            code: 200,
            message: result.rows
        };
    
    } catch (error) {
        console.error("Error fetching buyer's orders:", error);
        return { 
            code: 500, 
            message: 'Error fetching the orders.'
        };
    } finally {
        client.release(); // Release client back to the pool
    }
}

