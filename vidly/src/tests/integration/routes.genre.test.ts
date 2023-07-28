const request = require('supertest');

import { start } from '../../index';
import { create, genre } from '../../crud/genre';
import { AppDataSource } from '../../data-source';
import generateAuthToken from '../../crud/token';
import { Genre } from "../../entity/Genre"

let server;

describe('/api/genres', () => {
    beforeEach(async ()=> { server = await start(); }, 200000);
    afterEach(async () => { 
        await AppDataSource.query('DROP TABLE rental');
        await AppDataSource.query('DROP TABLE movie');
        await AppDataSource.query('DROP TABLE genre');
        await AppDataSource.destroy();
        await server.close(); 
    }, 200000);

    describe('GET /', () => {
        it('should return all genres', async () => {
            await create('genre1');
            await create('genre2');

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            //_body: [ { id: 1, genres: 'genre1' }, { id: 2, genres: 'genre2' } ]
            expect(res.body.some(g => g.genres === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.genres === 'genre2')).toBeTruthy();
        }, 200000);
    });

    describe('GET /:id', () => {
        it('should retrn a genre if valid id is passed', async () => {
            await create('genre1');

            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('genres', 'genre1');
            //expect(res.body.some(g => g.genres === 'genre1')).toBeTruthy();
        }, 200000);

        it('should retrn 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/r');
    
            expect(res.status).toBe(404);
        }, 200000);
    });

    describe('POST /', () => {

        // Define the happy path, and then in each test, we change 
        // one parameter that clearly aligns with the name of the 
        // test. 
        let token;
        let name;

        const exec = async () => {
            return await request(server)
              .post('/api/genres')
              .set('x-auth-token', token)
              .send({ name });
          }

        const user = {
                        id: 1, 
                        isAdmin: true
                    }; 

        beforeEach(() => {
        token = generateAuthToken(user);      
        name = 'genre1'; 
        })

          
        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        }, 200000);

        it('should return 400 if genre is less than 5 characters', async () => {
            name = 'gen';
            const res = await exec();

            expect(res.status).toBe(400);
        }, 200000);

        it('should return 400 if genre is more than 20 characters', async () => {
            name = new Array(22).join('a'); 
            const res = await exec();

            expect(res.status).toBe(400);
        }, 200000);

        it('should save the genre if it valid', async () => {
            await exec();
            const data = await genre(1) as Genre;

            expect(data).not.toBeNull();
        }, 200000);

        it('should return the genre if it valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('movies');
            expect(res.body).toHaveProperty('genres', 'genre1');

        }, 200000);
    });

    describe('PUT /:id', () => {
        let token;
        let newName;
        let id;

        const exec = async () => {
            return await request(server)
                    .put('/api/genres/' + id)
                    .set('x-auth-token', token)
                    .send({ name: newName });
        }
        beforeEach(async () => {
            //  Before each test we need to create a genre and
            //  put it in the database
            await create('genre1');

            const user = {
                id: 1, 
                isAdmin: true
            }; 

            token = generateAuthToken(user);
            id = 1;
            newName = 'updatedGenre';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        }, 200000);

        it('should return 400 if genre is less than 5 characters', async () => {
            newName = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        }, 200000);

        it('should return 400 if genre is more than 20 characters', async () => {
            newName = new Array(22).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        }, 200000);
        
        it('should return 404 if id is invalid', async () => {
            id = 'a';
            const res = await exec();

            expect(res.status).toBe(404);
        }, 200000);

        it('should update the genre if input is valid', async () => {
            await exec();
            const data = await genre(1) as Genre;

            expect(data.id).toBe(1);
            expect(data.genres).toBe(newName);
        },  200000);

        it('should return the updated the genre if input is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('genres', newName);
        },  200000);
    });

    describe('DELETE /:id', () => {
        let token;
        let id;

        const exec = async () => {
            return await request(server)
              .delete('/api/genres/' + id)
              .set('x-auth-token', token)
              .send();
          }

        beforeEach(async () => {
            // Before each test we need to create a genre and 
            // put it in the database.      
            await create('genre1');

            const user = {
                id: 1, 
                isAdmin: true
            }; 

            token = generateAuthToken(user);
            id = 1;
        });   
        
        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if the user is not an admin', async () => {
            const user = {
                id: 1, 
                isAdmin: false
            }; 
            token = generateAuthToken(user);
            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            id = 'a';
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with the given id was found', async () => {
            id = '2';
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the genre if input is valid', async () => {
            await exec();
            const genreInDB = await genre(1);

            expect(genreInDB).toBe(404);
        });

        it('should return the removed genre', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('genres', 'genre1');
        });
    });
});

