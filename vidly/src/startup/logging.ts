const winston = require('winston');
//const { MySQLTransport }  = require('winston-mysql');
require('express-async-errors');

export default async function winstonLogger() {
    // const options = {
    //     host: 'localhost',
    //     user: "root",
    //     password: "1234",
    //     database: "vidly",
    //     table: "errors",
    //     fields: {level: 'level', meta: 'meta', message: 'message', timestamp: 'timestamp'}
    // }

    const logger = await winston.createLogger({
        transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'logfile.log' })],
        exceptionHandlers: [new winston.transports.Console(), new winston.transports.File({ filename: 'uncaughtExceptions.log' })],
        rejectionHandlers: [new winston.transports.Console(), new winston.transports.File({ filename: 'rejections.log'})],
  
        // exceptionHandlers: [new winston.transports.Console(), new MySQLTransport(options), await new winston.transports.File({ filename: 'uncaughtExceptions.log' })],
        // rejectionHandlers: [new winston.transports.Console(), new MySQLTransport(options), new winston.transports.File({ filename: 'rejections.log'})],
    });
}