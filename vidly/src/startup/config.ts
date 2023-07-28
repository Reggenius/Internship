const config = require('config');

export default function configure() {
    if(!config.get('jwtPrivateKey')) {  //if config is not set
        console.log('FATAL ERROR: jwtPrivateKey is not defined');
        process.exit(1);
    }
}