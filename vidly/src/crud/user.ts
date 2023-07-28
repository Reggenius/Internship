const Joi = require('joi');
import { Users } from "../entity/Users"
import * as _ from "lodash";
import generateAuthToken from "./token";
import * as bcrypt from "bcrypt"
import { AppDataSource } from "../data-source"
import { getRepo } from "./general";

// import * as Joi from "joi"

const config = require('config');

/**--------- CREATE USER ------------- */
export async function create(details): Promise<Object>{
    const userRepo = getRepo(Users);
    const checkUser = await userRepo
                        .createQueryBuilder("users")
                        .where("users.email = :email", { email: details.email })
                        .getOne();
    if(checkUser)
        return 409;
    else {
        const user = new Users();
        user.name = details.name;
        user.email = details.email;
        user.isAdmin = details.isAdmin;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(details.password, salt);
        
        return _.pick(await userRepo.save(user), ['id', 'name', 'email']);
        }
}

/**--------- AUTHENTICATE USER ------------- */
export async function auth(email: string, password: string): Promise<Object> {
    const user = await getRepo(Users)
                        .createQueryBuilder("users")
                        .where("users.email = :email", { email: email })
                        .getOne();
    if(!user)    return 400;
    else {
        const validPassword = await bcrypt.compare(password, user.password);  //returns boolean
        if(!validPassword)  return 400;
        else    return await generateAuthToken(user);
    }
}

/**--------- RETRIEVE USER -------------- */
export async function user(id: number): Promise<Object> {
    const result = await getRepo(Users)
                            .findOneBy({ id: id });
    if(result)  return _.pick(result, ['id', 'name', 'email']);
    else    return 400;
}

/**--------- VALIDATE CUSTOMER ------------- */
export function validateUser(User) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).max(255).alphanum().required(),
        isAdmin: Joi.boolean().required()
    });
    
    return schema.validate(User);
}

export function authUser(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).max(1024).alphanum().required()
    });
    
    return schema.validate(req);
}