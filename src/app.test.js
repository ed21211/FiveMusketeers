import pool from '../db'
import { login } from './controllers/buyerController';


describe("POST /login", () => {
    it('should return 400 if email is invalid', async () => {
        const invalidEmail = 'badEmail';
        
        validEmail.mockReturnValue(false);
    
        const result = await login(invalidEmail);
    
        expect(result.code).toBe(400);
        expect(result.message).toBe('Email is required.');
    });
})

