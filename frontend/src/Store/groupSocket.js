import { getSocket } from "../lib/socket";
import { addGroupMessage } from "./groupSlice";

export const subscribeToGroupMessages = (dispatch) => {
  const socket = getSocket();
  if (!socket) return;

  socket.off("group:message:new");
  socket.on("group:message:new", (newMessage) => {
    dispatch(addGroupMessage(newMessage));
  });
};

export const subscribeToGroupCreated = (setGroups) => {
  const socket = getSocket();
  if (!socket) return;

  socket.off("group:created");
  socket.on("group:created", (data) => {
    console.log("New group added", data);

    if (!data?.group) return;

    setGroups((prev) => {
      if (!Array.isArray(prev)) return [data.group];
      return [data.group, ...prev];
    });
  });
};
