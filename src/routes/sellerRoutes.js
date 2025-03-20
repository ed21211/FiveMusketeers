import express from 'express';
import createError from 'http-errors';
import { users, products, addProducts, viewOrder } from '../controllers/sellerController.js';

const seller = express.Router();


const errorHandler = (err, req, res, next) => {
    

    res.status(err.status || 500).json({ 
        message: err.message || "Internal server error" // Always return the actual error message
    });
};


seller.get("/users", async (req, res, next) => {
    try {
        const result = await users();
        if (!result || result.code !== 200) {
            return next(createError(result?.code || 500, result?.message || "Database error"));
        }
        res.status(result.code).json(result);
    } catch (error) {
        next(createError(500, "Database error")); // Forward correct error message
    }
});


seller.get("/products", async (req, res, next) => {
    try {
        const result = await products();
        if (!result || result.code !== 200) {
            return next(createError(result?.code || 500, result?.message || "Unexpected error"));
        }
        res.status(result.code).json(result);
    } catch (error) {
        next(createError(500, "Internal server error"));
    }
});


seller.post("/addProducts", async (req, res, next) => {
    try {
        const { products } = req.body;
        if (!products || !Array.isArray(products) || products.length === 0) {
            return next(createError(400, "Invalid product data"));
        }

        const result = await addProducts(products);
        if (!result || result.code !== 201) {
            return next(createError(result?.code || 500, result?.message || "Unexpected error"));
        }
        res.status(201).json(result);
    } catch (error) {
        next(createError(500, "Internal server error"));
    }
});

seller.get("/orders/:orderId", async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) {
            return next(createError(400, "Invalid order ID"));
        }

        const result = await viewOrder(orderId);
        if (!result || result.code !== 200) {
            return next(createError(result?.code || 404, result?.message || "Order not found"));
        }
        res.status(result.code).json(result);
    } catch (error) {
        next(createError(500, "Internal server error"));
    }
});

seller.use(errorHandler);

export default seller;
