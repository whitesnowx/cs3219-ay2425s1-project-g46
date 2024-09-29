const express = require("express");
const router = express.Router();

const {
    createQuestion,
    getAllQuestions,
    getQuestionById
} = require("../controller/questionController");

router.get("/", getAllQuestions);
router.get("/:questionId", getQuestionById);
router.post("/add", createQuestion);

module.exports = router;