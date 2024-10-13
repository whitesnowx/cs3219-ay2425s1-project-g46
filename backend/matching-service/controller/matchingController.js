// Author(s): Andrew, Xinyi
const db = require("../db/firebase");
const userCollection = db.collection("users");

// jsonwebtoken to generate session token for persistent login
const jwt = require('jsonwebtoken');
// bcrypt for hashing password in database
const bcrypt = require('bcryptjs');
// import the token secret key used to generate token from .env
const JWT_SECRET = process.env.JWT_SECRET;

// Hash password function
async function hashPass(password) {
return await bcrypt.hash(password, 10);
}

// sign up API
const requestMatching = async (req, res) => {
try {
    console.log(req.body);
    
    res.send({ message: "User created successfully"});

    
} catch (error) {
    res.status(500).send({ error: error.message });
    console.log({ error: error.message });
}
};




// Export user functions
module.exports = { requestMatching };
