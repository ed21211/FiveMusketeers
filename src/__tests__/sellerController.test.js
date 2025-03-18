import * as sellerController from '../controllers/sellerController.js';
import pool from '../db.js';
import { user } from '../controllers/sellerController.js';

//======================BUYER UNIT TEST========================//

jest.mock('../db.js', () => ({
  query: jest.fn()
}));

jest.mock('../controllers/sellerController', () => ({
  ...jest.requireActual('../controllers/sellerController'),
  users: jest.fn(),
}));

describe('sellerController users', () => {
  
  it('Display all users in the system.', async () => {
  });
});
