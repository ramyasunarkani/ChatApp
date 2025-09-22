// lib/socket.js
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:4000";
let socket = null;

export const connectSocket = (userId, onOnlineUsers) => {
  if (socket?.connected || !userId) return socket;

  socket = io(BASE_URL, { query: { userId } });
  socket.connect();

  if (onOnlineUsers) {
    socket.on("getOnlineUsers", onOnlineUsers);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
  socket = null;
};

export const getSocket = () => socket;
