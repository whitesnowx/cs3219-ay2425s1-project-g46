const express = require("express");
const router = express.Router();

const {
  getUserCollaborations
} = require("../controller/historyController");

router.get("/:userid", getAllCollaborations);
// router.get("/:userid", getUserCollaborations);

module.exports = router;