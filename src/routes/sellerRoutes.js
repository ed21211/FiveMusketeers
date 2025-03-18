import express from 'express';
import HTTPError from 'http-errors';
import errorHandler from 'middleware-http-errors';
const app = express();

app.use(express.json());
const seller = express.Router();

import { users, products, addProducts } from '../controllers/sellerController.js';

seller.get("/users", async (req, res) => {
    const result = await users();

    if (result.code !== 200) {
        throw new HTTPError(result.code, result.message);
    }

    res.json(result);
});

seller.get("/products", async (req, res) => {
    const result = await products();

    if (result.code !== 200) {
        throw new HTTPError(result.code, result.message);
    }

    res.json(result);
});


seller.post("/addProducts", async (req, res) => {
    const { products } = req.body;
    const result = await addProducts(products);

    if (result.code !== 201) {
        throw new HTTPError(result.code, result.message);
    }

    res.json(result);
});

seller.get("/orders/:orderId", async (req,res) => {
    const result = await viewOrder(parseInt(req.params.orderId));

    if(result.code !== 200) {
        throw HTTPError(result.code, result.message);
    }

    res.json(result);
});

app.use(errorHandler());

export default seller;