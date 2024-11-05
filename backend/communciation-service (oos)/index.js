const express = require('express');
const bodyParser = require('body-parser');
const callRoutes = require('./routes/callRoute.js'); // Import the routes
const socketHandler = require('./handler/socketHandler.js');
// const { handleSocketIO } = require("./handler/socketHandler.js");
const config = require('./config/config.js');

const port = process.env.PORT;


const app = express();
app.use(bodyParser.json());

// Use the call routes
app.use('/api/calls', callRoutes);

app.listen(config.port, () => {
    console.log(`${config.serviceName} listening on port ${config.port}`);
});
