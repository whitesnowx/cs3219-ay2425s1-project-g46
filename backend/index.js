const express = require('express')
const cors = require('cors');
const app = express()
const port = 5000 
const admin = require("firebase-admin");
const firebaseConfig = require("./firebaseConfig.js");
const credentials = JSON.parse(JSON.stringify(firebaseConfig));
const createRoutes = require('./user_profile/user_routes.js'); 

app.use(cors()); 
app.use(express.json()); 


admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = admin.firestore();
app.use('/user', createRoutes(db));


app.get('/', (req, res) => {
  res.send('Welcome to the Express server!');
});


const createText = async (inputText) => {
  const id = inputText;
  await db.collection('texts').add({text:inputText});
  };

app.post('/submit', (req, res) => {
  const { inputText } = req.body; 
  console.log('Received input:', inputText);
  res.status(200).json({ message: `Form data received successfully: ${inputText}` });
  createText(inputText)
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})