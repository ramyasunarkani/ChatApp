module.exports = (io, socket, userSocketMap) => {
  // Join a room for two users
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.handshake.query.userId} joined room: ${roomId}`);
  });

  // Send message to a room
  socket.on("new_message", ({ roomId, message }) => {
    io.to(roomId).emit("new_message", {
      senderId: socket.handshake.query.userId,
      message,
      createdAt: new Date(),
    });
  });

  // Direct 1-to-1 using socketId
  socket.on("send_private_message", ({ receiverId, message }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_private_message", {
        senderId: socket.handshake.query.userId,
        message,
        createdAt: new Date(),
      });
    }
  });
};
