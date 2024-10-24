// Author(s): Andrew, Calista, Xinyi, Xiu Jia, Xue Ling
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

const historyRoute = require("./routes/historyRoute");

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/history", historyRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
