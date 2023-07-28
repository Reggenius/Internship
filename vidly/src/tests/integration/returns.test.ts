const request = require('supertest');

import { start } from '../../index';
import { AppDataSource } from '../../data-source';
import { create as createRental} from '../../crud/rental';
import * as crud from '../crud/returns'
import { create as createGenre } from '../../crud/genre';
import { create as createCustomer } from '../../crud/customer';
import { create as createMovie} from '../../crud/movie';
import generateAuthToken from '../../crud/token';



describe('/api/returns', () => {
    let server;
    let cId;
    let mId;
    let rId;
    let gId;
    let rental;
    let movie;
    let customer;
    let token;
    
    const exec = () => {
            return request(server)
            .post(`/api/returns/${cId}/${mId}/${rId}`)
            .set('x-auth-token', token)
            .send();
        };

    beforeEach(async ()=> {
        cId = 1;
        mId = 1;
        rId = 1;
        gId = 1;
        
        const user = {
            id: 1, 
            isAdmin: true
        }; 
        token = generateAuthToken(user);
        
        movie = {
            title: "movie1",
            numberInStock: 10,
            dailyRentalRate: 2
        };
        customer = {
            name: "customer1",
            phone: "1234",
            isGold: false
        };
        rental = {
            cId: 1,
            mId: 1
        };

        server = await start();
        await createGenre('genre1');
        await createMovie(gId, movie);
        await createCustomer(customer.name, customer.phone, customer.isGold);
        await createRental(rental);
    }, 200000);
    afterEach(async() => { 
        await AppDataSource.query('DROP TABLE rental');
        await AppDataSource.query('DROP TABLE customer');
        await AppDataSource.query('DROP TABLE movie');
        await AppDataSource.query('DROP TABLE genre');
        await AppDataSource.destroy();
        await server.close(); 
    }, 200000);

    it('should return a 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    }, 200000);

    it('should return a 404 if url is invalid', async () => {
        cId = '';
        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return a 400 if customerId is invalid', async () => {
        cId = 'a'; //delete payload.customerId;
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is invalid', async () => {
        mId = 'a';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental is found for the customer/movie', async () => {
        await crud.destroy(rId); 
        const res = await exec();
       
        expect(res.status).toBe(404);
    });

    it('should return 400 if return is already processed', async () => {
        await crud.setDateReturned(rId);
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request', async () => {
        const res = await exec();

        expect (res.status).toBe(200);
    });

    it('should set the returnDate if input is valid', async () => {
        await exec();
        const res = await crud.calcTime(rId);

        expect(res).toBeLessThan(10 * 1000);

    });

    it('should set the rentalFee if input is valid', async () => {
        await crud.setDateOut(rId);
        await exec();
        const res = await crud.get(rId);

        expect(res.rental_fee).toBe(14);
    });

    it('should increase the movie stock if input is valid', async () => {
        await exec();
        const movieInDB = await crud.getMovie(mId);

        expect(movieInDB.number_in_stock).toBe(movie.numberInStock);
    });

    it('should return the rental if input is valid', async () => {
        const res = await exec();

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['date_out', 'date_returned', 
            'rental_fee', 'movie']));

    });
});