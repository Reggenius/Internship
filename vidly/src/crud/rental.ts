const moment = require('moment');

import { Rental } from "../entity/Rental"
import { Customer } from "../entity/Customer"
import { Movie } from "../entity/Movie"
import { customer as crudCustomer } from "./customer"
import { movie as crudMovie } from "./movie"
import { getRepo } from "./general";

import * as Joi from "joi"


/**--------- RETRIEVE RENTALS ------------- */
export async function rentals(): Promise<Object> {
    return await getRepo(Rental)
                    .find({ 
                        relations: { 
                            customer: true, movie: true 
                        } 
                    });
}

/**--------- RETRIEVE RENTAL -------------- */
export async function rental(id: number): Promise<Object> {
    const result = await getRepo(Rental)
                        .createQueryBuilder("rental")
                        .leftJoinAndSelect("rental.movie", "movie")
                        .leftJoinAndSelect("rental.customer", "customer")
                        .where("rental.id = :id", { id: id })
                        .getOne();
    return result ? result: 404;
}

/**--------- CREATE RENTAL ------------- */
export async function create(params): Promise<Object> {
        const customerId: number = params.cId;
        const movieId: number = params.mId;

        const customer: Customer = await crudCustomer(customerId) as Customer;

        const movie: Movie = await crudMovie(movieId) as Movie;

        if((customer.id && movie.id)) {
            movie.number_in_stock--;
            await getRepo(Movie).save(movie);
            
            const movieInDB = await crudMovie(movieId);

            const rental =  new Rental();
            //SET DATE_OUT
            rental.date_out = new Date();
            rental.customer = customer;
            rental.movie = movieInDB as Movie; 
        
            return await getRepo(Rental).save(rental);
        }
        else    return 404;
}

/**--------- UPDATE RENTAL ------------- */
export async function update(params): Promise<Object> {
    const customerId: number = params.cId;
    const movieId: number = params.mId;
    const rentalId: number = params.rId;
    
    const customerInDB: Customer = await crudCustomer(customerId) as Customer;
        
    const movieInDB: Movie = await crudMovie(movieId) as Movie;      

    const rentalInDB: Rental = await rental(rentalId) as Rental;

    if(customerInDB.id && movieInDB.id && rentalInDB.id) {
        if (rentalInDB.date_returned)   return 400;
        else {
            const rentalDays: number = moment().diff(rentalInDB.date_out, 'days');
 
            rentalInDB.date_returned = new Date();
            rentalInDB.rental_fee = rentalDays * rentalInDB.movie.daily_rental_rate;

            movieInDB.number_in_stock++;
            await getRepo(Movie).save(movieInDB);
            
            return await getRepo(Rental).save(rentalInDB );
        }
    }
    else    return 404;
}

/**--------- VALIDATE RENTAL (url/body) ------------- */
export function validateUrl(url) {
    const schema = Joi.object({
        cId: Joi.string().required(),
        mId: Joi.string().required()
    });
    return schema.validate(url);
}

export function validateReturnUrl(url) {
    const schema = Joi.object({
        mId: Joi.number().required(),
        cId: Joi.number().required(),
        rId: Joi.number().required(),

    });
    return schema.validate(url);
}