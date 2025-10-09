
const { Op } = require("sequelize");
const {User,Message} = require("../models");
const uploadToS3 = require("../utils/S3");
const { getReceiverSocketId, getIo } = require("../../socket_io");


const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await User.findAll({
      where: {
        id: {
          [Op.ne]: loggedInUserId, 
        },
      },
      attributes: { exclude: ["password"] }, 
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
    const myId = req.user.id; 

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      },
      order: [["createdAt", "ASC"]], 
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
    let mediaUrl = null;

    if (req.file) {
      mediaUrl = await uploadToS3(
        req.file.buffer,
        `${Date.now()}-${req.file.originalname}`,
        req.file.mimetype
      );
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: text || null,
      media: mediaUrl,
    });

    // Emit message via Socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      getIo().to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) 
      return res.status(400).json({ message: "Email query is required" });

    const users = await User.findAll({
      where: {
        email: { [Op.like]: `%${email}%` },
        id: { [Op.ne]: req.user.id } // optional: exclude self
      },
      attributes: ["id", "fullName", "email"] // use fullName instead of name
    });

    res.json(users);
  } catch (err) {
    console.error("Error searching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={
    getUsersForSidebar,
    getMessages,
    sendMessage,
    searchUsers
}