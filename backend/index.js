const express = require('express')
const cors = require('cors');
const app = express()
const port = 5000 
const admin = require("firebase-admin");
const firebaseConfig = require("./firebaseConfig.js");
const credentials = JSON.parse(JSON.stringify(firebaseConfig));

app.use(cors()); 
app.use(express.json()); 

const bcrypt = require("bcryptjs");

// session token for persistent login
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = admin.firestore();

const createText = async (inputText) => {
  const id = inputText;
  await db.collection('texts').add({text:inputText});
};

app.post('/create', async (req, res) => {
  try {
      console.log(req.body);
      const id = req.body.email;
      const userJson = {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName // Fixed typo
      };
      const response = db.collection("users").doc(id).set(userJson); // Added 'await'
      res.send({ message: "User created successfully", response });
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});

async function hashPass(password) {
  const res = await bcrypt.hash(password, 10);
  return res;
}


app.post('/user/signup', async (req, res) => {
  try {
      const usersRef = db.collection("users").doc(req.body.email);
      const getUser = await usersRef.get();
      if (getUser.exists) {
          return res.status(400).send({ message: "Email already exists. Please use another email." });
      }


      console.log(req.body);
      const username = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const encryptedPassword = await hashPass(password);
      console.log(encryptedPassword);
      const userJson = {
          username: username,
          email: email,
          password: encryptedPassword

      };
      
      const response = await db.collection("users").doc(email).set(userJson);
      res.send({ message: "User created successfully", response });
      console.log({ message: "User created successfully", response })
  } catch (error) {
      res.status(500).send({ error: error.message });
      console.log({ error: error.message })
  }
});

app.post('/user/login', async (req, res) => {
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
});

app.post('/user/logout', async (req, res) => {
  console.log("User is logging out.");
  res.clearCookie('session-id');
  return res.status(200).send({ message: "Logout successful." });
})

app.get('/', (req, res) => {
  res.send('Welcome to the Express server!');
});

app.post('/submit', (req, res) => {
  const { inputText } = req.body; 
  console.log('Received input:', inputText);
  res.status(200).json({ message: `Form data received successfully: ${inputText}` });
  createText(inputText)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})