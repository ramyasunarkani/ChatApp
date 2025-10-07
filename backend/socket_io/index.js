const {Server}=require('socket.io');
const http=require('http');
const express=require('express');

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
    }
})

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);
     const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap).map(Number));

    socket.on("disconnect",()=>{
        console.log("a user disconnect",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap).map(Number));
    })
})

module.exports={io,app,server,getReceiverSocketId}