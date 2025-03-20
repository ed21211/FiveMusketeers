import request from 'supertest';
import app from '../index.js';
import * as sellerController from '../controllers/sellerController.js';
import pool from '../db.js';

jest.mock('../controllers/sellerController.js');

describe('Seller Routes API Tests', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('GET /seller/users', () => {
    it('should return 500 if there is a database error', async () => {
      sellerController.users.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get('/seller/users');


      expect(response.statusCode).toBe(500);
      expect(response.body).toMatchObject({ message: "Database error" });

    });
  });

  describe('POST /seller/addProducts', () => {
    it('should add a product successfully and return 201', async () => {
      sellerController.addProducts.mockResolvedValue({
        code: 201,
        message: "Product added successfully"
      });

      const response = await request(app)
        .post('/seller/addProducts')
        .send({ products: [{ name: "Keyboard", price: 100, quantity: 10 }] });


      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({ message: "Product added successfully" });
    });

    it('should return 400 for invalid product data', async () => {
      sellerController.addProducts.mockResolvedValue({
        code: 400,
        message: "Invalid product data"
      });

      const response = await request(app)
        .post('/seller/addProducts')
        .send({ products: [{}] });


      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({ message: "Invalid product data" });
    });
  });

  describe('GET /seller/orders/:orderId', () => {
    it('should return 404 if order is not found', async () => {
      sellerController.viewOrder.mockResolvedValue({
        code: 404,
        message: "Order not found"
      });

      const response = await request(app).get('/seller/orders/99999');


      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({ message: "Order not found" });
    });
  });
});