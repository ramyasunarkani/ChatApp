import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {
  setGroups,
  setGroupMessages,
  addGroupMessage,
  setIsGroupsLoading,
  setIsGroupMessagesLoading,
} from "./groupSlice";
import { getSocket } from "../lib/socket";

// ✅ Fetch all groups user is a member of
export const fetchGroups = () => async (dispatch) => {
  dispatch(setIsGroupsLoading(true));
  try {
    const res = await axiosInstance.get("/groups");
    dispatch(setGroups(res.data));
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch groups");
  } finally {
    dispatch(setIsGroupsLoading(false));
  }
};

// ✅ Fetch messages for a specific group
export const fetchGroupMessages = (groupId) => async (dispatch) => {
  dispatch(setIsGroupMessagesLoading(true));
  try {
    const res = await axiosInstance.get(`/groups/${groupId}/messages`);
    dispatch(setGroupMessages({ groupId, messages: res.data }));
  } catch (err) {
    toast.error("Failed to load group messages");
  } finally {
    dispatch(setIsGroupMessagesLoading(false));
  }
};

// ✅ Send a message via socket
export const sendGroupMessage = (groupId, formData, isFormData = false) => async () => {
  const socket = getSocket();
  if (!socket) return;

  let message = null;
  let mediaUrl = null;

  if (isFormData) {
    message = formData.get("text")?.trim() || null;
    const file = formData.get("media");
    if (file) {
      mediaUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }
  }

  // Emit to server. Do NOT dispatch here — server will broadcast to all including sender
  socket.emit("group:message:send", { groupId, message, media: mediaUrl });
};
