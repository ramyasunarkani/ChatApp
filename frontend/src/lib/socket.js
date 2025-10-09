// lib/socket.js
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:4000";
let socket = null;

/**
 * Connect to Socket.IO server
 * @param {function} onOnlineUsers - optional callback for online users list
 */
export const connectSocket = (onOnlineUsers) => {
  if (socket?.connected) return socket;

  socket = io(BASE_URL, {
    withCredentials: true, // send cookies automatically
    transports: ["websocket"], // force websocket
  });

  if (typeof onOnlineUsers === "function") {
    socket.on("getOnlineUsers", onOnlineUsers);
  }

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
  socket = null;
};

export const getSocket = () => socket;
