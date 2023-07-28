import { Customer } from "../entity/Customer"
import { Rental } from "../entity/Rental"
import { AppDataSource } from "../data-source"
import { getRepo } from "./general";

import * as Joi from "joi"


/**--------- RETRIEVE CUSTOMERS ------------- */
export async function customers(): Promise<Object> {
    return await getRepo(Customer)
                    .find({
                            relations: {
                                rentals: true
                            },
                    });
}

/**--------- RETRIEVE CUSTOMER -------------- */
export async function customer(id: number): Promise<Object> {
    const result = await getRepo(Customer)
                        .createQueryBuilder("customer")
                        .leftJoinAndSelect("customer.rentals", "rental")
                        .where("customer.id = :id", { id: id })
                        .getOne();
    return result ? result: 404;
}

/**--------- CREATE CUSTOMERS ------------- */
export async function create(name: string, phone: string, isGold: boolean): Promise<Object> {
    const rentals: Rental[] = [];    //New customer has not done any rental
    const customer: Customer = new Customer();
    customer.name = name;
    customer.phone = phone;
    customer.isGold = isGold;
    customer.rentals = rentals;
 
    return await getRepo(Customer).save(customer);
}

/**--------- UPDATE CUSTOMER ------------- */
export async function update(id: number, details): Promise<Object> {
   const name: string = details.name;
    const phone: string = details.phone;
    const isGold: boolean = details.isGold;

    const customerRepo = getRepo(Customer);
    const customerToUpdate: Customer = await customer(id) as Customer;
    
    if(customerToUpdate.id) {
        customerToUpdate.name = name;
        customerToUpdate.phone = phone;
        customerToUpdate.isGold = isGold;

        return await customerRepo.save(customerToUpdate);
    }
    else    return 404;
}

/**--------- DELETE CUSTOMER ------------- */
export async function destroy(id: number): Promise<Object> {
    const customerToDel: Customer = await customer(id) as Customer;
    if(customerToDel.id)
        return await getRepo(Customer).remove(customerToDel);
    else
        return 404;
}

/**--------- VALIDATE CUSTOMER ------------- */
export function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(15).required(),
        isGold: Joi.boolean()
    });
    
    return schema.validate(customer);
}