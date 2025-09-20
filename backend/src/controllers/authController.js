 const {User}=require('../models');
 const bcrypt=require('bcryptjs');
const { generateToken } = require('../utils/token-gen');
const uploadToS3 = require("../utils/S3"); // S3 helper
const { Op } = require('sequelize');


 const signup=async(req,res)=>{
   const {fullName,email,phone,password}=req.body;
   try {
       if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
     const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      profilePic:null
    });

      generateToken(newUser.id, res);

    res.status(201).json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      profilePic:newUser.profilePic
    });

      
   } catch (error) {
      console.error(" Error in signup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
      
   }
   

 }

 const login = async (req, res) => {
  const { identifier, password } = req.body; 
  // identifier = can be email OR phone

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }]
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


 const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload image to S3
const imageUrl = await uploadToS3(
  req.file.buffer,
  "profile-pics",
  `user-${userId}.jpg`,
  req.file.mimetype
);

    // Find user first
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the profilePic field
    user.profilePic = profilePicUrl;
    await user.save(); // Save changes to DB

    res.status(200).json(user);
  } catch (error) {
    console.error("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


 const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);

  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

 module.exports={
    signup,login,logout,updateProfile,checkAuth
 }