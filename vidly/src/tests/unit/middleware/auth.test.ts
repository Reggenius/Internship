import generateAuthToken from '../../../crud/token';
import { middleware } from '../../../middleware/auth'

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', async () => {
        const user = {
            id: 1, 
            isAdmin: true
        }; 
        const token = generateAuthToken(user);
        const req = {
            header: jest.fn().mockReturnValue(token),
            user: ''
        }
        const res = {};
        const next = jest.fn();
        await middleware(req, res, next);
        
        expect(req.user).toMatchObject(user);
    });
})