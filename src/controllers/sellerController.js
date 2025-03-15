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

