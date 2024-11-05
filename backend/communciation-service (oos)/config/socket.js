// config.js
require("dotenv").config();

const config = {
  serviceName: 'communication-service',
  port: process.env.PORT,
};

module.exports = config;
