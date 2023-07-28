const moment = require('moment');

import { getRepo } from "../../crud/general";
import { Rental } from "../../entity/Rental"
import { Movie } from "../../entity/Movie"

/**--------- UPDATE RENTAL'S DATE_OUT FOR TEST PURPOSES ------------- */
export async function setDateReturned(id: number): Promise<Object> {
    try {
        const rentalRepo = getRepo(Rental);
        const rentalInDB = await rentalRepo
                                    .findOneBy({ id: id });
        if(rentalInDB) {
            rentalInDB.date_returned = new Date();

            return await rentalRepo.save(rentalInDB);
        }
        else return 404;
    }
    catch(err) {
        return err;
    }
}

/**--------- SET RETURN_DATE FOR TEST PURPOSES ------------- */
export async function calcTime(id: number): Promise<Object> {
    try {
        const rental = await getRepo(Rental)
                                .findOneBy({ id: id});
        if(rental)  return new Date().getTime() - rental.date_returned.getTime();
        else return 404;
    }
    catch(err) {
        return err;
    }
}

/**--------- SET DATE OUT ------------- */
export async function setDateOut(id: number): Promise<Object> {
    try {
        const rentalRepo = getRepo(Rental);
        const rental = await rentalRepo.findOneBy({ id: id});
        if(rental) {
            rental.date_out = moment().add(-7, 'days').toDate();
            return await rentalRepo.save(rental);
        }
        else return 404;
    }
    catch(err) {
        return err;
    }
}

/**--------- RETRIEVE RENTAL FROM DB ------------- */
export async function get(id: number) {
    try {
        return await getRepo(Rental)
                        .findOneBy({ id: id });
    }
    catch(err) {
        return err;
    }
}

/**--------- DELETE RENTAL ------------- */
export async function destroy(id: number): Promise<Object> {
    try {
        const rentalRepo = getRepo(Rental);
        const rentalToDel = await rentalRepo
                                    .findOneBy({ id: id });
                                    
        if(rentalToDel) return await rentalRepo.remove(rentalToDel);
        else    return 404;
    }
    catch(err) {
        return err;
    }
}

/**--------- RETRIEVE RENTAL FROM DB ------------- */
export async function getMovie(id: number) {
    try {
        return await getRepo(Movie)
                        .findOneBy({ id: id });
    }
    catch(err) {
        return err;
    }
}

