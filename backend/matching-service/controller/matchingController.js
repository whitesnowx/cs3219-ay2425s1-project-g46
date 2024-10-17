// Author(s): Andrew, Xinyi
require('dotenv').config();
const connectToRabbitMQ = require("../rabbitMQ/config.js");
const { createMatch } = require('./matchController.js');

let socketMap = {};

async function addUserToQueue(topic, difficultyLevel, email, token, username) {

    queueKey = topic + " " + difficultyLevel;

    const message = {"email": email, "token": token, "username": username};

    try{
        const { conn, channel } = await connectToRabbitMQ();
        const res = await channel.assertQueue(queueKey);

        await channel.sendToQueue(queueKey, Buffer.from(JSON.stringify(message)), {
            expiration: `10000` // Timer for TTL
        });
        console.log(`Message sent to queue ${queueKey}`);

        // Close the channel and connection after processing
        await channel.close();
        await conn.close();

    } catch(err) {
        console.error(`Error -> ${err}`);
    }

    
}


async function checkMatching(topic, difficultyLevel, email, token) {

    queueKey = topic + " " + difficultyLevel;
    
    try{
        const { conn, channel } = await connectToRabbitMQ();
        const res = await channel.assertQueue(queueKey);

        const queueStatus = await channel.checkQueue(queueKey);
        if (queueStatus.messageCount >= 2) {
            
            const firstUser = await channel.get(queueKey, {noAck: false});
            if (!firstUser) {
                console.error("Failed to retrieve the first user.");
                return;
            }
            
            const secondUser =  await channel.get(queueKey, {noAck: false});
            if (!secondUser) {
                console.error("Failed to retrieve the second user.");
                channel.nack(firstUser, false, true); //Requeue the first user
                return;
            }
            
            const userList = [];
            
            const firstUserData = JSON.parse(firstUser.content.toString());
            const secondUserData = JSON.parse(secondUser.content.toString());
            
            userList.push(firstUserData);
            userList.push(secondUserData);

            channel.ack(firstUser);
            channel.ack(secondUser);

            return userList;

        }

        return null;
        
        // Close the channel and connection after processing
        await channel.close();
        await conn.close();
        
        
    } catch(err) {
        console.error(`Error -> ${err}`);
    }
}

async function clearQueue(queueKey) {
    try {
        console.log(`Clearing queue ${queueKey}`);
        const { conn, channel } = await connectToRabbitMQ();
        await channel.assertQueue(queueKey);

        // Loop to clear all messages in the queue
        let message;
        while ((message = await channel.get(queueKey, { noAck: false })) !== false) {
            console.log(`Removing message from queue ${queueKey}`);
            channel.ack(message); // Acknowledge the message
        }


        await channel.close();
        await conn.close();
    } catch (error) {
        console.error(`Failed to clear queue ${queueKey}:`, error);
    }
}

async function removeUserFromQueue(topic, difficultyLevel, email, token) {
    queueKey = topic + " " + difficultyLevel;
        
    try {
        const { conn, channel } = await connectToRabbitMQ();
        const res = await channel.assertQueue(queueKey);

        const queueStatus = await channel.checkQueue(queueKey);
        // there should be only 1 person in queue
        // if > 2 people in queue, will be instantly matched
        if (queueStatus.messageCount < 2) {
            const user = await channel.get(queueKey, {noAck: false});
            if (!user) {
                console.error("No user in queue.");
                return;
            }

            const userData = JSON.parse(user.content.toString());
            channel.ack(user);

            // Close the channel and connection after processing
            await channel.close();
            await conn.close();

            // return user data
            return userData;
        }
    } catch (error) {
        console.error(`Failed to remove user from queue $(queueKey):`, error)
    }
}

const handleSocketIO = (io) => {
    io.on("connection", (socket) => {
      console.log(`A user connected with socket ID: ${socket.id}`);
  
      // Listen for the join_matching_queue event from the client
      socket.on("join_matching_queue", async (data) => {
        console.log(`New request for matching:`, data);
        const { topic, difficultyLevel, email, token, username } = data;
  
        // Store the socket ID for the user
        socketMap[email] = socket.id;
        
        // Add user to RabbitMQ queue (assuming you have the logic for this)
        await addUserToQueue(topic, difficultyLevel, email, token, username);
  
        // Check for a match
        const userList = await checkMatching(topic, difficultyLevel);
  
        if (userList) {
            const [firstUser, secondUser] = userList;
    
            // Notify both users about the match
            io.to(socketMap[firstUser.email]).emit("match_found", { matchedData: secondUser });
            io.to(socketMap[secondUser.email]).emit("match_found", { matchedData: firstUser });
            console.log("A match is found");
            
            const { status, msg, error } = createMatch(firstUser.email, secondUser.email, topic, difficultyLevel);
            if (status == 200 && msg) {
                console.log(msg);
            } else if (status == 500 && error) {
                console.error(error);
            }
        }
      });

      // Listen for cancel_matching event from client
      socket.on("cancel_matching", async (data) => {
        console.log(`Cancelling matching for user:`, data);
        const { topic, difficultyLevel, email, token } = data;

        // Store the socket ID for the user
        socketMap[email] = socket.id;

        // Remove user from RabbitMQ queue (assuming you have the logic for this)
        await removeUserFromQueue(topic, difficultyLevel, email, token);

      })
  
      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User with socket ID ${socket.id} disconnected`);
      });
    });
  };



// Export user functions
module.exports = { handleSocketIO };
