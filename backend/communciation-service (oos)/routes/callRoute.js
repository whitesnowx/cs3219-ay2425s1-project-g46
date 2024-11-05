const express = require('express');
const router = express.Router();
const socketHandler = require('./handler/socketHandler');

// Route to initiate a call
router.post('/initiate', (req, res) => {
    const { from, to } = req.body;
    socketHandler.emit('initiateCall', { from, to });
    res.status(200).send('Call initiated');
});

// Route to end a call
router.post('/end', (req, res) => {
    const { to } = req.body;
    socketHandler.emit('endCall', { to });
    res.status(200).send('Call ended');
});

module.exports = router;
