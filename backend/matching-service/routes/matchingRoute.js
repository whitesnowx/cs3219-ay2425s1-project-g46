// Author(s): Andrew, Xinyi
const express = require('express');
const router = express.Router();
const {
    requestMatching
} = require("../controller/matchingController");

module.exports = (io) => {
  // Pass `io` to the controller
  // router.post('/requestMatching', (req, res) => requestMatching(req, res, io));

  return router;
};