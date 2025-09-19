const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController')
const protectRoute=require('../middlewares/authMiddleware')
const upload = require("../utils/upload"); 


router.post('/signup',authController.signup)

router.post('/login',authController.login)

router.post('/logout',authController.logout)

router.put("/update-profile", protectRoute,upload.single("image") ,authController.updateProfile);
router.get("/check", protectRoute, authController.checkAuth);


module.exports=router;