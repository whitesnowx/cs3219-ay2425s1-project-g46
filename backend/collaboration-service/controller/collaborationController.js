const db = require("../db/firebase");
const collaborationCollection = db.collection("collaborations");

// 1. Create a new blank page for collaboration
const createBlankPage = async (req, res) => {
  try {
    const pageId = collaborationCollection.doc().id;  // Generate unique ID
    const blankPageData = {
      content: "",   // Start with an empty page
      createdOn: new Date().toISOString(),
      editingStartTime: new Date().toISOString(),
      isBeingEditedBy: "taylor",
      lastEdited: new Date().toISOString()
    };

    await collaborationCollection.doc(pageId).set(blankPageData);  // Save blank page
    res.status(201).json({ message: "New blank page created", pageId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// 2. Start editing and track who is editing the page
const startEditing = async (req, res) => {
  const pageId = req.params.pageId;
  const userId = req.body.userId;  // Identify the user editing

  try {
    await collaborationCollection.doc(pageId).update({
      isBeingEditedBy: userId,
      editingStartTime: new Date().toISOString()
    });
    res.status(200).send({ message: "User is now editing the page" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// 3. Update page content as users edit in real-time
const updatePageContent = async (req, res) => {
  const pageId = req.params.pageId;
  const content = req.body.content;

  try {
    await collaborationCollection.doc(pageId).set({
      content,  // Save the new content
      lastEdited: new Date().toISOString()
    }, { merge: true });
    res.status(200).send({ message: "Page content updated successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// 4. Real-time updates: Listen for changes to the page content
const getRealTimeUpdates = (req, res) => {
  const pageId = req.params.pageId;

  const collaborationDoc = collaborationCollection.doc(pageId);
  collaborationDoc.onSnapshot((docSnapshot) => {
    if (docSnapshot.exists) {
      res.status(200).json({ id: docSnapshot.id, ...docSnapshot.data() });
    } else {
      res.status(404).json({ message: "Page not found" });
    }
  }, (error) => {
    res.status(500).json({ error: error.message });
  });
};

// 5. Check if the page is currently being edited by someone else
const checkEditingStatus = async (req, res) => {
  const pageId = req.params.pageId;

  try {
    const doc = await collaborationCollection.doc(pageId).get();
    if (doc.exists) {
      const isBeingEditedBy = doc.data().isBeingEditedBy;
      if (isBeingEditedBy) {
        res.status(409).json({ message: `Page is being edited by user ${isBeingEditedBy}` });
      } else {
        res.status(200).json({ message: "Page is available for editing" });
      }
    } else {
      res.status(404).json({ message: "Page not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// let collaborations = [
//   { id: 1, title: "Collaboration 1", content: "This is the first collaboration." },
//   { id: 2, title: "Collaboration 2", content: "This is the second collaboration." }
// ];

const getAllCollaborations = async (req, res) => {
  try {
    const collaborations = await collaborationCollection.get();

    const collaborationsArray = [];

    if (collaborations.empty) {
      res.status(400).send("No collabs found.");
    }

    collaborations.forEach((doc) => {
      collaborationsArray.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(collaborationsArray);
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    res.status(500).json({ message: "Error fetching data from Firebase" });
  }
};

// // Route to get all collaborations
// router.get("/", (req, res) => {
//   res.json(collaborations); // Return the list of collaborations
// });


module.exports = {
  getAllCollaborations, createBlankPage, startEditing, updatePageContent, getRealTimeUpdates, checkEditingStatus
};
