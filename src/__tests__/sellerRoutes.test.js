import express from 'express';
import request from 'supertest';
const app = express();
import buyer from '../routes/sellerRoutes.js';

app.use(express.json());
app.use('/seller', buyer);

//======================BUYER INTEGRATION TEST========================//


describe('POST /seller/user', () => {
  it('Return status 200', async () => {
  });
});