// Author(s): Andrew, Xinyi
const {
  textChange
} = require('../controller/collabController');

let currentText = '';

const handleSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);
    socket.on('getCurrentText', () => {
      // Send the current text to the newly connected client
      socket.emit('currentText', currentText);
    });

    // Listen for the join_matching_queue event from the client
    socket.on("textChange", async (data) => {
      currentText = data;
      socket.broadcast.emit('updateText', data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User with socket ID ${socket.id} disconnected`);
    });
  });
};

// Export user functions
module.exports = { handleSocketIO };