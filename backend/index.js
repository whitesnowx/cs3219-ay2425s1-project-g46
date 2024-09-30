const express = require("express");
const cors = require("cors");
const db = require("./firebase");
const app = express();
const port = 5000;

const questionRoute = require("./routes/questionRoute");

app.use(cors());
app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const createText = async (inputText) => {
  const id = inputText;
  await db.collection("texts").add({ text: inputText });
};

app.post("/create", async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body.email;
    const userJson = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName, // Fixed typo
    };
    const response = db.collection("users").doc(id).set(userJson); // Added 'await'
    res.send({ message: "User created successfully", response });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * post /submit
 *
 * Submits text to firebase under texts collection.
 *
 * Responses:
 * - 200: Returns success message
 */
app.post("/submit/text", (req, res) => {
  const { inputText } = req.body;
  console.log("Received input:", inputText);
  res
    .status(200)
    .json({ message: `Form data received successfully: ${inputText}` });
  createText(inputText);
});

// Routes
app.use("/question", questionRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
