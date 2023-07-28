import "reflect-metadata"
import winstonLogger from './startup/logging'
import connectDB from './startup/db'
import routes from './startup/routes'
import configure from './startup/config'
import express from 'express'
import { prod } from "./startup/prod"
const app = express();

export async function start(){
    await winstonLogger();
    await connectDB();
    routes(app);
    configure();
    prod(app);
    
    const port = process.env.PORT || 3000;
    //return await app.listen(port, () => console.log(`Listening on port ${port}...`));
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}

start();