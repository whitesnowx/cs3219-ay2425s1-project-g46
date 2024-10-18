// Author(s): Andrew, Xinyi
const connectToRabbitMQ = require("../config/rabbitMQ");

async function addUserToQueue(topic, difficultyLevel, email, token, username, isAny) {

  let queueKey = topic + " " + difficultyLevel;

  if (isAny) {
    queueKey = topic + " " + "any";

  }

  const message = {"topic": topic, "difficultyLevel": difficultyLevel, "email": email, "token": token, "username": username, "isAny": isAny };

  try {
    const { conn, channel } = await connectToRabbitMQ();
    const res = await channel.assertQueue(queueKey);
    await channel.assertQueue(queuePriorityKey);

    await channel.sendToQueue(queueKey, Buffer.from(JSON.stringify(message)), {
      expiration: `10000` // Timer for TTL
    });
    console.log(`Message sent to queue ${queueKey}`);

    
    const queuePriorityKey = topic + " priority";
    await channel.sendToQueue(queuePriorityKey, Buffer.from(JSON.stringify(message)), {
      expiration: `10000` // Timer for TTL
    });
    console.log(`Message sent to queue ${queuePriorityKey}`);

    // Close the channel and connection after processing
    await channel.close();
    await conn.close();

  } catch (err) {
    console.error(`Error -> ${err}`);
  }
}


async function checkMatchingSameQueue(topic, difficultyLevel, email, token, username, isAny) {

  let queueKey = topic + " " + difficultyLevel;
  console.log(`is any: ${isAny}`);
  if (isAny) {
    queueKey = topic + " " + "any";

  }

  try {
    const { conn, channel } = await connectToRabbitMQ();
    const res = await channel.assertQueue(queueKey);

    const queueStatus = await channel.checkQueue(queueKey);
    console.log(`${queueKey} currently has ${queueStatus.messageCount} users`);
    if (queueStatus.messageCount >= 2) {

      const firstUser = await channel.get(queueKey, { noAck: false });
      if (!firstUser) {
        console.error("Failed to retrieve the first user.");
        return;
      }

      const secondUser = await channel.get(queueKey, { noAck: false });
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
  } catch (err) {
    console.error(`Error -> ${err}`);
  }
}

async function checkMatchingAnyQueue(topic, difficultyLevel, email, token, isAny) {
  allDifficultyLevels = ["easy", "medium", "hard"];

  try {
    while (true) {
      const queuePriorityKey = topic + " priority";
      const { conn, channel } = await connectToRabbitMQ();
      const res = await channel.assertQueue(queuePriorityKey);

      const queueStatus = await channel.checkQueue(queuePriorityKey);
      if (queueStatus.messageCount > 0) {
        const userInPriorityQueue = await channel.get(queuePriorityKey, { noAck: false });
        if (!userInPriorityQueue) {
          console.error("Failed to retrieve the first user.");
          return;
        }
        
        const userInPriorityQueueData = JSON.parse(userInPriorityQueue.content.toString());
        channel.ack(firstUser);

        const queueKey = `${userInPriorityQueueData.topic} ${userInPriorityQueueData.difficultyLevel}`;

        
        const chosenUser = await channel.get(queueKey, { noAck: false });
        if (!chosenUser) {
          continue;
        } else if (JSON.parse(chosenUser.content.toString).email != userInPriorityQueueData.email) {
          channel.nack(chosenUser, false, true);
          continue;
        }

        await channel.assertQueue(topic + " any");
        const secondUser = await channel.get((topic + " any"), { noAck: false });
        if (!secondUser) {
          console.error("Failed to retrieve the second user.");
          channel.nack(firstUser, false, true); //Requeue the first user
          return;
        }


      
        const userList = [];
        const chosenUserData = JSON.parse(chosenUser.content.toString);
        const secondUserData = JSON.parse(secondUser.content.toString());

        userList.push(firstUserData);
        userList.push(secondUserData);

        channel.ack(chosenUser);
        channel.ack(secondUser);

        return userList;

      }

    }

    return null;
  } catch (err) {
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

async function removeUserFromQueue(topic, difficultyLevel, email, token, username, isAny) {
  queueKey = topic + " " + difficultyLevel;
  if (isAny) {
    queueKey = topic + " any";
  }

  try {
    const { conn, channel } = await connectToRabbitMQ();
    const res = await channel.assertQueue(queueKey);

    const queueStatus = await channel.checkQueue(queueKey);
    // there should be only 1 person in queue
    // if > 2 people in queue, will be instantly matched
    if (queueStatus.messageCount < 2) {
      const user = await channel.get(queueKey, { noAck: false });
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

// Export match functions
module.exports = {
  addUserToQueue,
  checkMatchingSameQueue,
  checkMatchingAnyQueue,
  clearQueue,
  removeUserFromQueue
};
