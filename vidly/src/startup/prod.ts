const helmet = require('helmet');
const compression = require('compression');

export function prod(app) {
    app.use(helmet());
    app.use(compression());
}