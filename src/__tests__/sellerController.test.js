import * as sellerController from '../controllers/sellerController.js';
import pool from '../db.js';
import { user } from '../controllers/sellerController.js';

//======================seller UNIT TEST========================//

describe('Seller Controller Tests', () => {
  
  // Mock `users()` function
  describe('users()', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { email: 'user1@example.com', signedIn: true },
        { email: 'user2@example.com', signedIn: false }
      ];

      // Correctly mock the function inside the module
      jest.spyOn(sellerController, 'users').mockResolvedValue(mockUsers);

      const result = await sellerController.users();
      expect(result).toEqual(mockUsers);
      expect(result.length).toBe(2);
    });

    it('should throw an error if user retrieval fails', async () => {
      jest.spyOn(sellerController, 'users').mockRejectedValue(new Error('Database error'));

      await expect(sellerController.users()).rejects.toThrow('Database error');
    });
  });

  // Mock `products()` function
  describe('products()', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        { name: "Laptop", price: 1500, quantity: 5 },
        { name: "Mouse", price: 30, quantity: 50 }
      ];

      jest.spyOn(sellerController, 'products').mockResolvedValue(mockProducts);

      const result = await sellerController.products();
      expect(result).toEqual(mockProducts);
    });

    it('should throw an error if fetching products fails', async () => {
      jest.spyOn(sellerController, 'products').mockRejectedValue(new Error('Database error'));

      await expect(sellerController.products()).rejects.toThrow('Database error');
    });
  });

  // Mock `addProducts()` function
  describe('addProducts()', () => {
    it('should return success when a product is added', async () => {
      const newProduct = { name: "Keyboard", price: 100, quantity: 10 };
      const mockResponse = { code: 201, message: "Product added successfully" };

      jest.spyOn(sellerController, 'addProducts').mockResolvedValue(mockResponse);

      const result = await sellerController.addProducts(newProduct);
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if product addition fails', async () => {
      jest.spyOn(sellerController, 'addProducts').mockRejectedValue(new Error('Database write error'));

      await expect(sellerController.addProducts({})).rejects.toThrow('Database write error');
    });
  });

  // Mock `viewOrder()` function
  describe('viewOrder()', () => {
    it('should return order details for a valid orderId', async () => {
      const mockOrder = {
        orderId: 1,
        customerId: 100,
        items: [{ productId: 1, quantity: 2 }]
      };

      jest.spyOn(sellerController, 'viewOrder').mockResolvedValue(mockOrder);

      const result = await sellerController.viewOrder(1);
      expect(result).toEqual(mockOrder);
      expect(result.orderId).toBe(1);
    });

    it('should throw an error if order retrieval fails', async () => {
      jest.spyOn(sellerController, 'viewOrder').mockRejectedValue(new Error('Order not found'));

      await expect(sellerController.viewOrder(999)).rejects.toThrow('Order not found');
    });
  });

});
