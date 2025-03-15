import express from 'express';
import HTTPError from 'http-errors';
import errorHandler from 'middleware-http-errors';
const app = express();

app.use(express.json());
const seller = express.Router();

import { users } from '../controllers/sellerController.js';

seller.get("/users", async (req, res) => {
    const result = await users();

    if (result.code !== 200) {
        throw new HTTPError(result.code, result.message);
    }

    res.json(result);
});

app.use(errorHandler());

export default seller;