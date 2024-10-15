// Author(s): Andrew, Xinyi
require('dotenv').config();
const express = require("express");
const app = express();
const db = require("../db/firebase");
const userCollection = db.collection("users");
const amqp = require('amqplib');
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");

// RabbitMQ connection settings
const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest', 
    password: process.env.rabbitPassword, 
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

// const queueTimersMap = {};

app.use(cors());
let socketMap = {};


const server = http.createServer(app);
// Initialize the Socket.IO server
const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins, adjust as needed
      methods: ["GET", "POST"],
    },
});
  

async function addUserToQueue(topic, difficultyLevel, email, token) {

    queueKey = topic + " " + difficultyLevel;

    const message = {"email": email, "token": token};

    try{

        const conn = await amqp.connect(rabbitSettings);
        const channel = await conn.createChannel();
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

        const conn = await amqp.connect(rabbitSettings);
        const channel = await conn.createChannel();
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
        const conn = await amqp.connect(rabbitSettings);
        const channel = await conn.createChannel();
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




  


const handleSocketIO = (io) => {
    io.on("connection", (socket) => {
      console.log(`A user connected with socket ID: ${socket.id}`);
  
      // Listen for the join_matching_queue event from the client
      socket.on("join_matching_queue", async (data) => {
        console.log(`New request for matching:`, data);
        const { topic, difficultyLevel, email, token } = data;
  
        // Store the socket ID for the user
        socketMap[email] = socket.id;
        
        // Add user to RabbitMQ queue (assuming you have the logic for this)
        await addUserToQueue(topic, difficultyLevel, email, token);
  
        // Check for a match
        const userList = await checkMatching(topic, difficultyLevel);
  
        if (userList) {
            const [firstUser, secondUser] = userList;
    
            // Notify both users about the match
            io.to(socketMap[firstUser.email]).emit("match_found", { matchedData: secondUser });
            io.to(socketMap[secondUser.email]).emit("match_found", { matchedData: firstUser });
            console.log("A match is found");

        }
      });
  
      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User with socket ID ${socket.id} disconnected`);
      });
    });
  };



// Export user functions
module.exports = { handleSocketIO };
