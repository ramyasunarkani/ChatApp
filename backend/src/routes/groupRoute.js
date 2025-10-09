const express = require("express");
const { createGroup, joinGroup, getGroupMessages,fetchUserGroups } = require("../controllers/groupController");
const authenticate = require("../middlewares/authMiddleware"); // your JWT auth middleware
const router = express.Router();

router.post("/", authenticate, createGroup);
router.post("/:groupId/join", authenticate, joinGroup);
router.get("/:groupId/messages", authenticate, getGroupMessages);
router.get("/", authenticate, fetchUserGroups);

module.exports = router;
