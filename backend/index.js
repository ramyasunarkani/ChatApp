const dotenv=require('dotenv');
dotenv.config();

const express=require('express');
const authRoutes=require('./src/routes/authRoute');
const messageRoutes=require('./src/routes/messageRoute');
const cors=require('cors')

const sequelize=require('./src/utils/db-connection')
require('./src/models')
const cookieParser=require('cookie-parser')
const app=express();

app.use(express.json()); 
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

app.get('/',(req,res)=>{
    res.send('app is running');
})
app.use('/api/auth',authRoutes);
app.use('/api/message',messageRoutes);


const port =process.env.PORT

sequelize.sync().then(()=>{
    console.log("database connected and sync");
    app.listen(port,()=>{
    console.log(`sever is running on port ${port}`);
})
}).catch((err)=>{
    console.log("database connection failed",err);

})
