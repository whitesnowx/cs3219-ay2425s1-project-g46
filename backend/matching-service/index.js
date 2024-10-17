// Author(s): Andrew
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const port = process.env.PORT || 5002;

// Import the matching controller functions
const { handleSocketIO } = require("./controller/matchingController");

// import routes
const matchingRoute = require("./routes/matchingRoute.js"); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// default API from expressJS
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Create an HTTP server that works with both Express and Socket.IO
const server = http.createServer(app);

// Initialize the Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, adjust as needed
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    console.log(`a user connected with socket ID: ${socket.id}`);

    socket.on("send_message", (data) => {
        console.log("Message received from client: ", data);
    })

});

// Trigger handleSocketIO to start listening for Socket.IO events
handleSocketIO(io); // This calls the function to set up the socket listeners


// Pass the `io` instance to the routes
app.use("/matching", matchingRoute(io)); // Pass `io` to the route

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});