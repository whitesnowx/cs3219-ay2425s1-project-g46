
const express = require('express');
const { signup, login, logout } = require('./user_server.js'); 

const createRoutes = (db) => {
    const routes = express.Router();

    routes.post('/signup', (req, res) => signup(req, res, db));

    routes.post('/login', (req, res) => login(req, res, db));

    routes.post('/logout', (req, res) => logout(req, res, db));

    return routes;
};

module.exports = createRoutes;
