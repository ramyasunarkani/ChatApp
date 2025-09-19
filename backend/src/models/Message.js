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
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,  // S3 URL
    allowNull: true,
  },
  
});




module.exports = Message;
