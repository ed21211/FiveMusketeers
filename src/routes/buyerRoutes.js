import express from 'express';
import pool from '../db.js';
const app = express();

app.use(express.json());

const buyer = express.Router();

buyer.post("/login", async (req, res) => {
	const { user } = req.body;

	if (!user?.email) {
		return res.status(400).json({ error: "Email is required" });
	}

	console.log("hi");

	const existing = await pool.query(
		"SELECT * FROM customers WHERE email = $1",
		[user.email]
	);

	console.log("Query result:", existing.rows);

	if (existing.rows.length === 0) {
		await pool.query(
			"INSERT INTO customers (email, signedUp) VALUES ($1, $2)",
			[user.email, false]
		);
		return res.json({ loggedin: true, status: "Welcome new user!" });
	} else {
		return res.json({ loggedin: true, status: "Welcome back!" });
	}
});

buyer.delete("/delete", async (req, res) => {
	const { user } = req.body;

	const result = await pool.query(
		"DELETE FROM customers WHERE email = $1 RETURNING *",
		[user.email]
	);

	if (result.rowCount === 0) {
		return res.status(404).json({ errorStatus: "User not found" });
	}

	res.json({ message: "User deleted", deleted: result.rows[0] });
});

export default buyer;