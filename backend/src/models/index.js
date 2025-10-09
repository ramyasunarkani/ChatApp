// models/index.js
const User = require("./User");
const Message = require("./Message");
const Group = require("./Group");
const GroupMember = require("./GroupMember");
const GroupMessage = require("./GroupMessage");

// 📨 Private Messages
User.hasMany(Message, { as: "SentMessages", foreignKey: "senderId" });
User.hasMany(Message, { as: "ReceivedMessages", foreignKey: "receiverId" });

Message.belongsTo(User, { as: "Sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "Receiver", foreignKey: "receiverId" });

// 👥 Groups
Group.belongsTo(User, { as: "Creator", foreignKey: "createdBy" });

// Many-to-many between User & Group through GroupMember
User.belongsToMany(Group, {
  through: GroupMember,
  as: "Groups",
  foreignKey: "userId",
});
Group.belongsToMany(User, {
  through: GroupMember,
  as: "Members",
  foreignKey: "groupId",
});

// 💬 Group Messages
Group.hasMany(GroupMessage, { foreignKey: "groupId", as: "Messages" });
GroupMessage.belongsTo(Group, { foreignKey: "groupId", as: "Group" });

User.hasMany(GroupMessage, { foreignKey: "senderId", as: "GroupSentMessages" });
GroupMessage.belongsTo(User, { foreignKey: "senderId", as: "Sender" });

module.exports = {
  User,
  Message,
  Group,
  GroupMember,
  GroupMessage,
};
