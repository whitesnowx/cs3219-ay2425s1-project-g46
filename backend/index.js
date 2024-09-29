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

/**
 * POST /add
 *
 * Creates questions from form data and store in firebase
 *
 * Responses:
 * - 500: Server error if something goes wrong while fetching data.
 */
app.post("/questions/add", async (req, res) => {
  try {
    console.log(req.body);
    const questionJson = {
      title: req.body.title.trim(),
      category: req.body.category,
      complexity: req.body.complexity,
      description: req.body.description,
    };
    const querySnap = await db.collection("questions").where('title', '==', req.body.title.trim()).get();
    if (!querySnap.empty) {
      return res.status(409).json({ message: 'Duplicate entry found' });
    }
    const response = db.collection("questions").doc().set(questionJson); // Added 'await'
    res.send({ message: "Question created successfully", response });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.put("/questions/update/:id", async (req, res) => {
  try {
    const questionId = req.params.id; 
    console.log("Updating question ID:", questionId);
    
    const updatedQuestion = {
      title: req.body.title.trim(),
      category: req.body.category,
      complexity: req.body.complexity,
      description: req.body.description,
    };
    const querySnap = await db.collection("questions").where('title', '==', req.body.title.trim()).get();
    if (!querySnap.empty) {
      for (const doc of querySnap.docs) {
        if (doc.id != questionId) {
          return res.status(409).json({ message: 'Duplicate entry found' });
        }
      }
    }
    const response = await db.collection("questions").doc(questionId).set(updatedQuestion, { merge: true });

    res.send({ message: "Question updated successfully", response });
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ error: error.message });
  }
});

app.delete("/questions/delete/:id", async (req, res) => {
  try {
    const questionId = req.params.id; 
    console.log("Deleting question ID:", questionId);
    
    await db.collection("questions").doc(questionId).delete();

    res.send({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Routes
app.use("/question", questionRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
