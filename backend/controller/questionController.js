const db = require("../firebase");
const questionCollection = db.collection("questions");

/**
 * GET /question/
 *
 * Retrieves data from firebase from questions collection.
 *
 * Responses:
 * - 200: Returns an array of data matching the query parameters.
 * - 500: Server error if something goes wrong while fetching data.
 */
const getAllQuestions = async (req, res, next) => {
    try {
        const questions = await questionCollection.get();

        const questionArray = [];

        if (questions.empty) {
            res.status(400).send("No questions found.");
        }

        questions.forEach((doc) => {
            questionArray.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(questionArray);
    } catch (error) {
        console.error("Error fetching data from Firebase:", error);
        res.status(500).json({ message: "Error fetching data from Firebase" });
    }
};

/**
 * GET /question/<questionId>
 * 
 * Retrieves specified question from questions collection in firebase.
 * 
 * Responses:
 * - 200: Returns data matching the questionId.
 * - 500: Server error if something goes wrong while fetching data.
 */

const getQuestionById = async (req, res, next) => {
    try {
        const id = req.params.questionId;
        const question = questionCollection.doc(id);
        const data = await question.get();

        if (!data.exists) {
            return res.status(404).send({ message: "Question not found" });
        }

        res.status(200).send(data.data());
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { getAllQuestions, getQuestionById };