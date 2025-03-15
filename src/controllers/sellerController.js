import pool from '../db.js';


/**
 * Description: Function to get all users
 * @param {*} 
 * @returns - Array of customer records
 */

export async function users () {
    try {
        const users = await pool.query('SELECT * FROM customers');
        return users.rows;
    } catch (error) {
        return { 
          code: 500, 
          message: 'Error creating order, please try again later.'
        };
    }
}