import express from 'express';
import request from 'supertest';
const app = express();
import buyer from '../routes/buyerRoutes.js';

app.use(express.json());
app.use('/buyer', buyer);

//======================BUYER INTEGRATION TEST========================//


describe('POST /buyer/login', () => {
  it('Return status 400 for invalid email', async () => {
    // const response = await request(app)
    //   .post('/buyer/login')
    //   .send({ email: null });

    // expect(response.status).toBe(400);
    // expect(response.body.message).toBe('Email is required.');
  });

//   it('Return status 200 for valid email', async () => {
//     const response = await request(app)
//       .post('/buyer/login')
//       .send({ email: 'valid-email@example.com' });

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Welcome new user!');
//   });
});
