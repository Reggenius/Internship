import { Movie } from "../entity/Movie"
import { Genre } from "../entity/Genre"
import { Rental } from "../entity/Rental"
import { genre as crudGenre } from "./genre"
import { getRepo } from "./general";

import * as Joi from "joi"

/**--------- RETRIEVE MOVIES ------------- */
export async function movies(): Promise<Object> {
    return await getRepo(Movie)
                    .find({
                        relations: {
                            genre: true,
                            rentals: true
                    }
                });
}

/**--------- RETRIEVE MOVIE -------------- */
export async function movie(id: number): Promise<Object> {
    const result = await getRepo(Movie)
                        .createQueryBuilder("movie")
                        .leftJoinAndSelect("movie.genre", "genre")
                        .leftJoinAndSelect("movie.rentals", "rental")
                        .where("movie.id = :id", { id: id })
                        .getOne();
    return result ? result: 404;
}

/**--------- CREATE MOVIE ------------- */
export async function create(id: number, details): Promise<Object> {
    const genreInDB: Genre = await crudGenre(id) as Genre;
    
    if(genreInDB.id) {
        const rentals: Rental[] = [];    //New movie hasn't been rented out yet
        
        const movie = new Movie();
        movie.title = details.title;
        movie.number_in_stock = details.numberInStock;
        movie.daily_rental_rate = details.dailyRentalRate;
        movie.genre = genreInDB;
        movie.rentals = rentals;
    
        return await getRepo(Movie).save(movie);
    }
    else    return 404;
}

/**--------- UPDATE MOVIE ------------- */
export async function update(id: number, details): Promise<Object> {
    const movieInDB: Movie = await movie(id) as Movie;

    if(movieInDB.id) {
        movieInDB.title = details.title;
        movieInDB.number_in_stock = details.numberInStock;
        movieInDB.daily_rental_rate = details.dailyRentalRate;

        return await getRepo(Movie).save(movieInDB);
    }
    else    return 404;
}

/**--------- DELETE MOVIE ------------- */
export async function destroy(id: number): Promise<Object> {
    const movieToRemove: Movie = await movie(id) as Movie;
    
    if(movieToRemove.id)
        return await getRepo(Movie).remove(movieToRemove);
    else    return 404;
}

/**--------- VALIDATE GENRE ------------- */
export function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
    
    return schema.validate(movie);
}
