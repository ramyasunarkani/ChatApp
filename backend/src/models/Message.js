const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");
const User = require("./User");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  media: { type: DataTypes.STRING, allowNull: true },
  
});




module.exports = Message;
