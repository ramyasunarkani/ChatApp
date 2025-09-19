const {Sequelize}=require('sequelize')

const sequelize=new Sequelize(process.env.DB_NAME,process.env.USER_NAME,process.env.DB_PASS,{
    host:process.env.HOST,
    dialect:"mysql"
})

module.exports = sequelize;
