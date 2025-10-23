const {Sequelize}=require('sequelize')

const sequelize=new Sequelize(process.env.DB_NAME,process.env.USER_NAME,process.env.DB_PASS,{
    host:process.env.HOST,
     dialect: "postgres",
    logging: false,
    dialectOptions: process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}
  
})

module.exports = sequelize;
