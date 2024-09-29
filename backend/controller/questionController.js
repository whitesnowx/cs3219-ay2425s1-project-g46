const db = require("../firebase");
const questionCollection = db.collection("questions");

/**
 * GET /question/<questionId>
 * 
 * Retrieves specified question from questions collection in firebase.
 * 
 * Responses:
 * - 200: Returns data matching the questionId.
 * - 500: Server error if something goes wrong while fetching data.
 */

const getQuestion = async (req, res, next) => {
    try {
        const id = req.params.questionId;

        console.error("question Id: ", id);
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

module.exports = { getQuestion };