// Author(s): Andrew, Xinyi
const express = require('express');
const router = express.Router();

const {
    requestMatching
} = require("../controller/matchingController");

router.post('/requestMatching', requestMatching);


module.exports = router;