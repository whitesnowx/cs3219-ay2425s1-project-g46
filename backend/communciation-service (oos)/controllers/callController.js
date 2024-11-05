// const { v4: uuidv4 } = require("uuid");

const activeRooms = new Set(); // To track active rooms (in-memory)


// let io; // Declare io variable to use it in the exports

// exports.setIo = (socketIo) => {
//   io = socketIo; // Set the io instance
// };


exports.startCall = (req, res) => {
  // const roomId = uuidv4();
  // activeRooms.add(roomId); // Store the new room in active rooms
  // res.status(201).json({ roomId });
  const { roomId, userId } = req.body;

    // Emit an event to start the call
    io.to(roomId).emit("callStarted", { userId });

    res.status(200).json({ message: "Call initiated" });
};

exports.endCall = (req, res) => {
  const { roomId } = req.body;

  if (!activeRooms.has(roomId)) {
    return res.status(404).json({ message: `Room with ID ${roomId} not found.` });
  }

  // Logic to clean up or close the room can be added here
  activeRooms.delete(roomId); // Remove the room from active rooms
  res.status(200).json({ message: `Call with roomId ${roomId} ended.` });
};
