import express from 'express';
import pool from '../db.js';
const app = express();

const seller = express.Router();
app.use(express.json());

seller.get("/users", async (req, res) => {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
});

export default seller;