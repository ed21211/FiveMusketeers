const express = require('express');
const pool = require('../db.js');
const app = express();

const seller = express.Router();
app.use(express.json());

seller.get("/users", async (req, res) => {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
});

module.exports = seller;