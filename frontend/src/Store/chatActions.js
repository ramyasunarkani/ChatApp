import {
  setUsers,
  setMessages,
  addMessage,
  setIsUsersLoading,
  setIsMessagesLoading,
} from "./chatSlice";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../lib/socket"; // get the shared socket from auth


// ✅ fetch users
export const fetchUsers = () => async (dispatch) => {
  dispatch(setIsUsersLoading(true));
  try {
    const res = await axiosInstance.get("/messages/users");
    dispatch(setUsers(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch users");
  } finally {
    dispatch(setIsUsersLoading(false));
  }
};

// ✅ fetch messages
export const fetchMessages = (userId) => async (dispatch) => {
  dispatch(setIsMessagesLoading(true));
  try {
    const res = await axiosInstance.get(`/messages/${userId}`);
    dispatch(setMessages(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch messages");
  } finally {
    dispatch(setIsMessagesLoading(false));
  }
};

// ✅ send message
export const sendMessage = (userId, messageData) => async (dispatch) => {
  try {
    const res = await axiosInstance.post(`/messages/send/${userId}`, messageData);
    dispatch(addMessage(res.data));
    const socket = getSocket();
    if (socket) {
      socket.emit("sendMessage", res.data);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to send message");
  }
};


// ✅ subscribe to messages from socket
export const subscribeToMessages = (selectedUserId) => (dispatch) => {
  const socket = getSocket();
  if (!socket || !selectedUserId) return;

  socket.off("newMessage"); // remove previous listener

  socket.on("newMessage", (newMessage) => {
    // only add message if it's from the selected user
    if (newMessage.senderId === selectedUserId) {
      dispatch(addMessage(newMessage));
    }
  });
};

// ✅ unsubscribe (optional)
export const unsubscribeFromMessages = () => (dispatch) => {
  const socket = getSocket();
  if (socket) socket.off("newMessage");
};
