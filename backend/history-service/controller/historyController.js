const db = require("../db/firebase");
const questionCollection = db.collection("collabs");

const getUserCollaborations = async (req, res) => {
  const userid = req.params.userid; 

  const collaborationsRefUser1 = db.collection("collabs").where("user1.email", "==", userid);
  const collaborationsRefUser2 = db.collection("collabs").where("user2.email", "==", userid);

  try {
    const user1Snapshot = await collaborationsRefUser1.get();
    const user2Snapshot = await collaborationsRefUser2.get();

    const collaborations = [];

    user1Snapshot.forEach(doc => {
      collaborations.push({ id: doc.id, ...doc.data() });
    });

    user2Snapshot.forEach(doc => {
      collaborations.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(collaborations);
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    return res.status(500).json({ error: "Failed to fetch collaborations." });
  }
};

const getAllCollaborations = async (req, res) => {
  try {
    const snapshot = await db.collection("collabs").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No collaborations found." });
    }

    const collaborations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(collaborations);
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    return res.status(500).json({ error: "Failed to fetch collaborations." });
  }
};


module.exports = { getUserCollaborations, getAllCollaborations }
