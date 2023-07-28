import { Genre } from "../entity/Genre"
import { Movie } from "../entity/Movie"
import { getRepo } from "./general";

import * as Joi from "joi"

/**--------- RETRIEVE GENRES ------------- */
export async function genres(): Promise<Object>{
    return await getRepo(Genre)
                    .find({
                        relations: { movies: true }
                    });
}

/**--------- RETRIEVE GENRE -------------- */
export async function genre(id: number): Promise<Object> {
    const result = await getRepo(Genre)
                            .createQueryBuilder("genre")
                            .leftJoinAndSelect("genre.movies", "movie")
                            .where("genre.id = :id", { id: id })
                            .getOne();
    return result ? result: 404;
}

/**--------- CREATE NEW GENRE ------------- */
export async function create(input: string): Promise<Object> {
    const movie: Movie[] = [];  //New Genre has no movie yet
    const genre: Genre = new Genre();
    genre.genres = input;
    genre.movies = movie;

    return await getRepo(Genre).save(genre);
}

/**--------- UPDATE GENRE ------------- */
export async function update(id: number, newGenre: string): Promise<Object> {
    const genreToUpdate: Genre = await genre(id) as Genre;
    if(genreToUpdate.id) {
        genreToUpdate.genres = newGenre;
        return await getRepo(Genre).save(genreToUpdate);
    }
    else    return 404;
}

/**--------- DELETE GENRE ------------- */
export async function destroy(id: number): Promise<Object> {
    const genreToRemove: Genre = await genre(id) as Genre;
    if(genreToRemove.id)
        return await getRepo(Genre).remove(genreToRemove);
    else    return 404;
}

/**--------- VALIDATE GENRE ------------- */
export function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(20).required()
    });
    
    return schema.validate(genre);
}