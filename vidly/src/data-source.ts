import "reflect-metadata"
import { DataSource } from "typeorm"
import { Customer } from "./entity/Customer"
import { Genre } from "./entity/Genre"
import { Movie } from "./entity/Movie"
import { Rental } from "./entity/Rental"
import { Users } from "./entity/Users"
import { Errors } from "./entity/Error"

const config = require('config');

/*-------------------------------- CONNECTION FOR APP ----------------------------------*/
export const AppDataSource = new DataSource({
    type: "mysql",//
    host: config.get('db_host'),
    port: 3306,
    username: config.get('db_username'),
    password: config.get('db_password'),
    database: config.get('db_name'),
    synchronize: true,
    logging: false,
    entities: [Customer, Genre, Movie, Rental, Users, Errors],
    migrations: [],
    subscribers: [],
})

/*-------------------------------- CONNECTION FOR TEST ----------------------------------*/
// export const AppDataSource = new DataSource({
//     type: "mysql",
//     host: "localhost",
//     port: 3306,
//     username: "root",
//     password: "1234",
//     database: "vidly_test",
//     synchronize: true,
//     logging: false,
//     entities: [Customer, Genre, Movie, Rental, Users, Errors],
//     migrations: [],
//     subscribers: [],
// })