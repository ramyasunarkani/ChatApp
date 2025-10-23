const express = require("express");
const { createGroup, joinGroup, getGroupMessages,fetchUserGroups,sendGroupMessage } = require("../controllers/groupController");
const authenticate = require("../middlewares/authMiddleware"); 
const router = express.Router();
const upload = require('../utils/upload');

router.post("/", authenticate, createGroup);
router.post("/:groupId/join", authenticate, joinGroup);
router.get("/:groupId/messages", authenticate, getGroupMessages);
router.get("/", authenticate, fetchUserGroups);
router.post("/send/:id", authenticate, upload.single("media"), sendGroupMessage);


module.exports = router;
