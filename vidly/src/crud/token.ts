//import * as jwt from "jsonwebtoken"
const jwt = require('jsonwebtoken');

const config = require('config');

function generateAuthToken(user) {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'));
}
export default generateAuthToken