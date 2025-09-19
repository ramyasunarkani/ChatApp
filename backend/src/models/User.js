const { DataTypes } = require('sequelize');
const sequelize=require('../utils/db-connection');

const User=sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    fullName :{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
    },
    phone:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    profilePic:{
        type:DataTypes.STRING,
        allowNull:true,
    }
})

module.exports=User;