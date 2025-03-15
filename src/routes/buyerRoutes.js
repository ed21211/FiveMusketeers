import express from 'express';
import pool from '../db.js';
import HTTPError from 'http-errors';
import errorHandler from 'middleware-http-errors';
const app = express();

app.use(express.json());
const buyer = express.Router();

import { login, createOrder, signout } from '../controllers/buyerController.js';

//===================================================================//

//BUYER LOGS IN (no account stored)
buyer.post("/login", async (req, res) => {
	const { email } = req.body;
	const result = await login(email);

	if (result.code !== 200) {
		throw HTTPError(result.code, result.message);
	}

	res.json(result);
});

// BUYER CREATES ORDER
buyer.post("/createOrder", async (req, res) => {
	const { email, ordersList, deliveryAddressProvided } = req.body;
	const result = await createOrder(email, ordersList, deliveryAddressProvided);

	if (result.code !== 201) {
		throw HTTPError(result.code, result.message);
	}

	res.json(result);
});

// BUYER SIGNS OUT (removes from database)

buyer.delete("/signout", async (req, res) => {
	const { email } = req.body;
	const result = await signout(email);

	if (result.code !== 200) {
		throw HTTPError(result.code, result.message);
	}

	res.json(result);
});

app.use('/buyer', buyer);

// 404 fallback
app.use((req, res) => {
	const error = `
	  Route not found - This could be because:
		0. You have defined routes below (not above) this middleware in server.ts
		1. You have not implemented the route ${req.method} ${req.path}
		2. There is a typo in either your test or server
		3. You are using ts-node (instead of ts-node-dev) and forgot to restart
		4. You've forgotten a leading slash (/) in a route
	`;
	res.status(404).json({ error });
});

// Global error handler
app.use(errorHandler());

export default buyer;