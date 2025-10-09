const { Group, GroupMember, GroupMessage, User } = require("../models");
const sequelize = require("../utils/db-connection");
const { getIo, getReceiverSocketId } = require("../../socket_io");

// Create Group
const createGroup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, members = [] } = req.body;
    const createdBy = req.user.id;

    if (!name) return res.status(400).json({ error: "Group name required" });

    // 1️⃣ Create group
    const group = await Group.create({ name, createdBy }, { transaction: t });

    // 2️⃣ Add creator as admin
    await GroupMember.create(
      { groupId: group.id, userId: createdBy, role: "admin" },
      { transaction: t }
    );

    // 3️⃣ Add other members
    const uniqueMembers = [...new Set(members.filter((id) => id !== createdBy))];
    if (uniqueMembers.length) {
      const bulk = uniqueMembers.map((userId) => ({
        groupId: group.id,
        userId,
        role: "member",
      }));
      await GroupMember.bulkCreate(bulk, { transaction: t });
    }

    // Commit
    await t.commit();

    // 4️⃣ Fetch group with members
    const groupWithMembers = await Group.findByPk(group.id, {
      include: [
        {
          model: User,
          as: "Members",
          attributes: ["id", "fullName", "email", "profilePic"],
          through: { attributes: ["role"] },
        },
        {
          model: User,
          as: "Creator",
          attributes: ["id", "fullName", "email", "profilePic"],
        },
      ],
    });

    // 5️⃣ Notify online members
    [createdBy, ...uniqueMembers].forEach((uid) => {
      const sid = getReceiverSocketId(uid);
      if (!sid) return; // skip if offline
      getIo().to(sid).emit("group:created", { group: groupWithMembers });
    });

    res.status(201).json({ group: groupWithMembers });
  } catch (err) {
    console.error("createGroup error", err);
    if (!t.finished) await t.rollback();
    res.status(500).json({ error: "Internal server error" });
  }
};

// Join group
const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const [member, created] = await GroupMember.findOrCreate({
      where: { groupId, userId },
      defaults: { role: "member" },
    });

    getIo().to(`group-${groupId}`).emit("group:joined", { groupId, userId });

    res.status(200).json({ group, member, created });
  } catch (err) {
    console.error("joinGroup error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get group messages
const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await GroupMessage.findAll({
      where: { groupId },
      order: [["createdAt", "ASC"]],
      include: [
        { model: User, as: "Sender", attributes: ["id", "fullName", "profilePic", "email"] },
      ],
    });

    res.json(messages);
  } catch (err) {
    console.error("getGroupMessages error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Fetch all groups for the logged-in user
const fetchUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.findAll({
      include: [
        {
          model: User,
          as: "Members",
          attributes: ["id", "fullName", "email", "profilePic"],
          through: { attributes: ["role"] },
        },
        {
          model: User,
          as: "Creator",
          attributes: ["id", "fullName", "email", "profilePic"],
        },
      ],
      where: {
        "$Members.id$": userId, // only groups where this user is a member
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(groups);
  } catch (err) {
    console.error("fetchUserGroups error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { createGroup, joinGroup, getGroupMessages ,fetchUserGroups};
