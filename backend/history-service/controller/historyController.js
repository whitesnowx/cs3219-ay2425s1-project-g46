const db = require("../db/firebase");
const questionCollection = db.collection("collabs");

// Get all the collabs associated with the user via thire Id 
export const getUserCollaborations = async (req, res) => {
  const collaborationsRef = db.collection("collabs").where("user1.email", "==", userid); 

  const snapshot = await collaborationsRef.get();
  const collaborations = [];

  snapshot.forEach(doc => {
    collaborations.push({ id: doc.id, ...doc.data() }); 
  });

  return collaborations;
};
