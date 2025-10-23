const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { User, GroupMember, GroupMessage } = require("../src/models");

const userSocketMap = {}; // userId -> Set of socketIds
let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
    transports: ["websocket"],
  });

  // ✅ Authenticate socket with JWT
  io.use(async (socket, next) => {
    try {
      const cookie = socket.handshake.headers.cookie;
      if (!cookie) return next(new Error("Auth token missing"));

      const match = cookie.match(/jwt=([^;]+)/);
      if (!match) return next(new Error("JWT not found in cookies"));

      const token = match[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload?.userId) return next(new Error("Invalid token"));

      socket.user = { id: payload.userId };
      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user.id;
    console.log(`✅ User connected: ${userId}`);

    userSocketMap[userId] = userSocketMap[userId] || new Set();
    userSocketMap[userId].add(socket.id);

    io.emit("getOnlineUsers", Object.keys(userSocketMap).map(Number));

    // ✅ Auto join user’s groups
    try {
      const memberships = await GroupMember.findAll({
        where: { userId },
        attributes: ["groupId"],
      });
      memberships.forEach((m) => socket.join(`group-${m.groupId}`));
    } catch (err) {
      console.error("Error joining groups:", err);
    }

    // ✅ Join group manually
    socket.on("group:join", async ({ groupId }) => {
      const member = await GroupMember.findOne({ where: { groupId, userId } });
      if (!member) return socket.emit("error", { message: "Not a group member" });

      socket.join(`group-${groupId}`);
      io.to(`group-${groupId}`).emit("group:joined", { groupId, userId });
    });

    // ✅ Leave group
    socket.on("group:leave", ({ groupId }) => {
      socket.leave(`group-${groupId}`);
      io.to(`group-${groupId}`).emit("group:left", { groupId, userId });
    });

    // ✅ Send message inside group
    socket.on("group:message:send", async (payload, ack) => {
      try {
        const { groupId, message, media } = payload;

        const member = await GroupMember.findOne({ where: { groupId, userId } });
        if (!member) return ack?.({ status: "error", message: "Not a group member" });

        const sanitizedMessage =
          typeof message === "string" && message.trim() !== "" ? message.trim() : null;
        const sanitizedMedia =
          typeof media === "string" && media.trim() !== "" ? media.trim() : null;

        const gm = await GroupMessage.create({
          groupId,
          senderId: userId,
          message: sanitizedMessage,
          media: sanitizedMedia,
        });

        const out = await GroupMessage.findByPk(gm.id, {
          include: [
            { model: User, as: "Sender", attributes: ["id", "fullName", "profilePic", "email"] },
          ],
        });

        io.to(`group-${groupId}`).emit("group:message:new", out);
        ack?.({ status: "ok", data: out });
      } catch (err) {
        console.error("group message send error:", err);
        ack?.({ status: "error", message: "Server error" });
      }
    });

    // ✅ Handle disconnect
    socket.on("disconnect", () => {
      if (userSocketMap[userId]) {
        userSocketMap[userId].delete(socket.id);
        if (userSocketMap[userId].size === 0) delete userSocketMap[userId];
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap).map(Number));
      console.log(`❌ User disconnected: ${userId}`);
    });
  });

  return io;
}

function getIo() {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
}

function getReceiverSocketId(userId) {
  const set = userSocketMap[userId];
  if (!set) return null;
  return Array.from(set)[0];
}

module.exports = { initSocket, getIo, getReceiverSocketId, userSocketMap };
