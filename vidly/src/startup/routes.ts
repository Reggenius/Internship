const express = require('express')
import genre from '../routes/genre'
import customer from '../routes/customer'
import movie from '../routes/movie'
import rental from '../routes/rental'
import returns from '../routes/returns'
import user from '../routes/user'
import auth from '../routes/auth'
import error from '../middleware/error'

export default function routes(app) {
    app.use(express.json());
    app.use('/api/genres', genre);
    app.use('/api/customers', customer);
    app.use('/api/movies', movie);
    app.use('/api/rentals', rental);
    app.use('/api/returns', returns);
    app.use('/api/users', user);
    app.use('/api/auth', auth);
    app.use(error);
}