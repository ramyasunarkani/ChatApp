const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const GroupMessage = sequelize.define("GroupMessage", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  media: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = GroupMessage;
