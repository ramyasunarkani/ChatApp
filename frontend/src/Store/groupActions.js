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

export const fetchGroups = () => async (dispatch) => {
  dispatch(setIsGroupsLoading(true));
  try {
    const res = await axiosInstance.get("/groups"); // you may need to make a route to list groups for a user
    dispatch(setGroups(res.data));
  } catch (err) {
    toast.error("Failed to fetch groups");
  } finally {
    dispatch(setIsGroupsLoading(false));
  }
};

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

export const sendGroupMessage = (groupId, { text, filePreview }) => async (dispatch) => {
  const socket = getSocket();
  if (!socket) return;

  let mediaUrl = filePreview?.preview || null; // already uploaded

  socket.emit(
    "group:message:send",
    { groupId, message: text || "", media: mediaUrl },
    (ack) => {
      if (ack.status === "ok") dispatch(addGroupMessage(ack.data));
      else toast.error(ack.message);
    }
  );
};

