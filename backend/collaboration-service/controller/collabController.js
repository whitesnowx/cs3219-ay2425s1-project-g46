// Author(s): Andrew, Xinyi
const db = require("../db/firebase");
const userCollection = db.collection("users");

// jsonwebtoken to generate session token for persistent login
const jwt = require('jsonwebtoken');
// bcrypt for hashing password in database
const bcrypt = require('bcryptjs');
// import the token secret key used to generate token from .env
const JWT_SECRET = process.env.JWT_SECRET;


// Export user functions
module.exports = { };
