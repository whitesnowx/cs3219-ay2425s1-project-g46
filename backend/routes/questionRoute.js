const express = require("express");
const router = express.Router();

const {
    getQuestion
} = require("../controller/questionController");

router.get("/:questionId", getQuestion);

module.exports = router;