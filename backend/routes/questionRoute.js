const express = require("express");
const router = express.Router();

const {
    getAllQuestions,
    getQuestionById
} = require("../controller/questionController");

router.get("/", getAllQuestions);
router.get("/:questionId", getQuestionById);

module.exports = router;