// Author(s): Calista, Xiu Jia, Xue Ling
const express = require("express");
const router = express.Router();

const {
  getAllCollaborations,
  createBlankPage,
  startEditing,
  getRealTimeUpdates,
  updatePageContent,
  checkEditingStatus
} = require("../controller/collaborationController");

// router.get("/", getAllQuestions);
// router.get("/:questionId", getQuestionById);
// router.post("/add", createQuestion);
// router.put("/update/:questionId", updateQuestion);
// router.delete("/delete/:questionId", deleteQuestion);

// router.post("/create", collaborationController.createBlankPage);
// router.post("/startEditing/:pageId", collaborationController.startEditing);
// router.get("/realtime/:pageId", collaborationController.getRealTimeUpdates);
// router.put("/update/:pageId", collaborationController.updatePageContent);
// router.get("/checkEditing/:pageId", collaborationController.checkEditingStatus);
router.get("/", getAllCollaborations);
router.post("/create", createBlankPage);
router.post("/startEditing/:pageId", startEditing);
router.get("/realtime/:pageId", getRealTimeUpdates);
router.put("/update/:pageId", updatePageContent);
router.get("/checkEditing/:pageId", checkEditingStatus);



module.exports = router;