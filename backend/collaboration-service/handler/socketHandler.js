// Author(s): Xue Ling, Xiu Jia
const { getRandomQuestion, getComplexity } = require("../service/questionService");
const db = require("../db/firebase");

let socketMap = {};
let intervalMap = {};

const handleSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);

    socket.on("createSocketRoom", async ({ data, id, currentUser }) => {
      // Store the socket id for the user
      socketMap[currentUser] = socket.id;

      const { user1, user2 } = data;

      const complexity = getComplexity(user1, user2);

      const questionData = await getRandomQuestion(user1.category, complexity);

      socket.join(id);

      console.log(`User with socket ID ${socket.id} joined room with ID ${id}`);

      socket.emit("readyForCollab", {
        id: id,
        user1,
        user2,
        questionData
      });

      // a timer to backup the current collab data
      const interval = setInterval(async () => {
        const currentTime = new Date().toISOString();
        const periodicData = {
          user1,
          user2,
          questionData,
          timestamp: currentTime
        };

        try {
          await db.collection("collabs").add({
            roomId: id,
            data: periodicData
          });
          console.log(`Data sent to Firebase at ${currentTime}`);
        } catch (error) {
          console.error("Fail to save to database: ", error);
        }
      }, 5000);
      
      intervalMap[socket.id] = interval;
    });
    
    socket.on("sendContent", ({ id, content }) => {
      socket.to(id).emit("receiveContent", { content: content });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User with socket ID ${socket.id} disconnected`);
    });

    // Delete the 
    if (intervalMap[socket.id]) {
      clearInterval(intervalMap[socket.id]);
      delete intervalMap[socket.id];  
    }
    for (let user in socketMap) {
      if (socketMap[user] === socket.id) {
        delete socketMap[user];
        break;
      }
    }
  });
};

// Export user functions
module.exports = { handleSocketIO };