import * as buyerController from '../controllers/buyerController.js';
import pool from '../db.js';
import { login } from '../controllers/buyerController.js';

//======================BUYER UNIT TEST========================//

jest.mock('../db.js', () => ({
  query: jest.fn()
}));

jest.mock('../controllers/buyerController', () => ({
  ...jest.requireActual('../controllers/buyerController'),
  validEmail: jest.fn(),
  existingEmail: jest.fn() // todo
}));

describe('buyerController login', () => {
  
  it('Invalid email.', async () => {
    buyerController.validEmail.mockReturnValue(false);

    const result = await buyerController.login(null);
    
    expect(result.code).toBe(400);
    expect(result.message).toBe('Email is required.');
  });

  it('Existing email', async () => {
    // Mock the database query for existing email
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    
    const result = await login('existinguser1@example.com');
    
    expect(result.code).toBe(200);
    expect(result.message).toBe('Welcome back!');
  });

  it('New user Email', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    
    const result = await login('newuser1@example.com');
    
    expect(result.code).toBe(200);
    expect(result.message).toBe('Welcome new user!');
  });
});
