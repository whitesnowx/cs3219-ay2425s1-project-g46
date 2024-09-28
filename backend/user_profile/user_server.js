
// session token for persistent login
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


const bcrypt = require('bcryptjs');

// Hash password function
async function hashPass(password) {
return await bcrypt.hash(password, 10);
}

const signup = async (req, res, db) => {
try {
    const usersRef = db.collection("users").doc(req.body.email);
    const getUser = await usersRef.get();
    
    if (getUser.exists) {
        return res.status(400).send({ message: "Email already exists. Please use another email." });
    }

    const username = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const encryptedPassword = await hashPass(password);

    const userJson = {
        username: username,
        email: email,
        password: encryptedPassword
    };

    const response = await db.collection("users").doc(email).set(userJson);
    res.send({ message: "User created successfully", response });
    console.log({ message: "User created successfully", response });
    
} catch (error) {
    res.status(500).send({ error: error.message });
    console.log({ error: error.message });
}
};





const login = async (req, res, db) => {
const usersRef = db.collection("users").doc(req.body.email);
const getUser = await usersRef.get();
if (getUser.exists) {
    // get the hashed password in database to compare
    const userPassword = getUser.get("password");

    // check if password entered is same as password in database
    bcrypt.compare(req.body.password, userPassword, (error, compareResult) => {
    // if some error occurs
    if (error) {
        console.log(error);
    }
    // if passwords do not match
    if (!compareResult) {
        console.log("Password is incorrect.");
        return res.status(500).send({ message: "Password is incorrect." });
    }

    // passwords match, successful login
    // generate a token for the login session,
    // return the token, email and username of logged-in user
    const payload = { email: req.body.email };
    jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
        if (error) {
        console.log(error);
        return res.status(401).send();
        }
        res.status(200).send({
        token: token,
        email: req.body.email,
        username: getUser.get("username")
        });
    })
    })
} else {
    return res.status(404).send({ message: "No user associated with this email. Please sign up for an account." });
}
};
  
const logout = async (req, res, db) => {
    console.log("User is logging out.");
    res.clearCookie('session-id');
    return res.status(200).send({ message: "Logout successful." });
};
  

  


// Export the signup function
module.exports = { signup, login, logout};
