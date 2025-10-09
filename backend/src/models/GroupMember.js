const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const GroupMember = sequelize.define("GroupMember", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" },
    onDelete: "CASCADE",
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Groups", key: "id" },
    onDelete: "CASCADE",
  },
  role: {
    type: DataTypes.ENUM("admin", "member"),
    defaultValue: "member",
  },
});

module.exports = GroupMember;
