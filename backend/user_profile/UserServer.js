const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const bcrypt = require("bcryptjs");


const firebase = require("firebase-admin");
const credentials = require("./key.json");

firebase.initializeApp({
    credential: firebase.credential.cert(credentials)
});


app.use(express.json());

app.use(express.urlencoded({extended: true}));

const db = firebase.firestore();


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


// app.get('/read/all', async (req, res) => {
//     try {
//         const usersRef = db.collection("users");
//         const response = await usersRef.get();
//         let responseArr = [];
//         response.forEach(doc => {
//             responseArr.push(doc.data());
//         });
//         res.send(responseArr);
//     } catch (error) {
//         res.send(error);
//     }
// });


// app.get('/read/:id', async (req, res) => {

//     try {
//         const usersRef = db.collection("users").doc(req.params.id);
//         const response = await usersRef.get();
//         res.send(response.data());
//     } catch (error) {
//         res.send(error);
//     }
// });


// app.post('/update', async (req, res) => {
//     try {
//         const email = req.body.email;
//         const newName = "Andrew";
//         const response = await db.collection("users").doc(email).update({
//             username: newName
//         });
        
//         res.send(response);
//     } catch (error) {
//         res.send(error);
//     }
// })


// app.delete('/delete/:id', async (req, res) => {
//     try {
       
//         const response = await db.collection("users").doc(req.params.id).delete();
//         res.send(response);
//     } catch (error) {
//         res.send(error);
//     }
// })




app.listen(5000, () => {
    console.log("Listening to port 8081")
});





