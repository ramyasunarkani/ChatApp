const express=require('express');
const router=express.Router();
const messageController=require('../controllers/messageController')
const protectRoute=require('../middlewares/authMiddleware');
const upload = require('../utils/upload');


router.get("/users", protectRoute, messageController.getUsersForSidebar);
router.get("/:id", protectRoute, messageController.getMessages);

router.post("/send/:id", protectRoute, upload.single("media"),  messageController.sendMessage);

module.exports=router