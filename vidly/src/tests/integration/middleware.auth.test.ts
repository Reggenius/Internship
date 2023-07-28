const request = require('supertest');
import { start } from '../../index';
import { AppDataSource } from '../../data-source';
import generateAuthToken from '../../crud/token';


let server;

describe('auth middleware', () => {
    beforeEach(async()=> { server = await start(); }, 20000);
    afterEach(async() => { 
        //await repository.remove(stud);
        await AppDataSource.query('DROP TABLE rental');
        await AppDataSource.query('DROP TABLE movie');
        await AppDataSource.query('DROP TABLE genre');
        await AppDataSource.destroy();
        await server.close(); 
    }, 200000);

    let token;

    const exec = () => {
        return request(server)
          .post('/api/genres')
          .set('x-auth-token', token)
          .send({ name: 'genre1' });
      }

    const user = {
            id: 1, 
            isAdmin: true
        }; 

    beforeEach(() => {
        token = generateAuthToken(user);
      });

    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    }, 200000);

    it('should return 400 if token is invalid', async () => {
        //he used 'a' but just wanted to show that the
        //the null indicated here will be converted to 
        //string during execution
        token = null;   
        const res = await exec();

        expect(res.status).toBe(400);
    }, 200000);

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    }, 200000);
    
});