// Code taken from https://blog.logrocket.com/ci-cd-node-js-github-actions/
// const app = require("./app")
// const supertest = require("supertest")
// const request = supertest(app)

// describe("/test endpoint", () => {
//     it("should return a response", async () => {
//         const response = await request.get("/test")
//         expect(response.status).toBe(200)
//         expect(response.text).toBe("Hello world");
//     })
// })

// import {createOrderWrapper, clearWrapper} from './wrapper-fns.js'

// beforeEach(() => {
//     clearWrapper();
// });

// describe('Success Cases', () => {
//     test('successful order creation', () => {
//       expect(createOrderWrapper('personA@gmail.com', [], '221B, Bakers Street, London')).toStrictEqual({
//         error: 'Invalid order list'
//       });
//     });
// });
