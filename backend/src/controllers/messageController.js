
const { Op } = require("sequelize");
const {User,Message} = require("../models");
const uploadToS3 = require("../utils/S3");
const { getReceiverSocketId,io} = require("../utils/socket");


const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await User.findAll({
      where: {
        id: {
          [Op.ne]: loggedInUserId, // Not equal
        },
      },
      attributes: { exclude: ["password"] }, // remove password
    });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id; // since you're using SQL, not _id

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      },
      order: [["createdAt", "ASC"]], // show in chat order
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};





const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;   
    const senderId = req.user.id;            

    let imageUrl = null;

    // If image file is uploaded
    if (req.file) {
      imageUrl = await uploadToS3(req.file.buffer, `messages/${Date.now()}-${req.file.originalname}`, req.file.mimetype);
    }

    // Save message in DB
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: text || null,
      image: imageUrl,
    });
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage };


module.exports={
    getUsersForSidebar,
    getMessages,
    sendMessage
}