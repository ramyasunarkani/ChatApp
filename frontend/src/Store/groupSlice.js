import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: "groups",
  initialState: {
    groups: [],
    selectedGroup: null,
    groupMessages: {},
    isGroupsLoading: false,
    isGroupMessagesLoading: false,
  },
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },
    setGroupMessages: (state, action) => {
      const { groupId, messages } = action.payload;
      state.groupMessages[groupId] = messages;
    },
    addGroupMessage: (state, action) => {
      const msg = action.payload;
      if (!state.groupMessages[msg.groupId]) {
        state.groupMessages[msg.groupId] = [];
      }
      state.groupMessages[msg.groupId].push(msg);
    },
    setIsGroupsLoading: (state, action) => {
      state.isGroupsLoading = action.payload;
    },
    setIsGroupMessagesLoading: (state, action) => {
      state.isGroupMessagesLoading = action.payload;
    },
  },
});

export const {
  setGroups,
  setSelectedGroup,
  setGroupMessages,
  addGroupMessage,
  setIsGroupsLoading,
  setIsGroupMessagesLoading,
} = groupSlice.actions;

export default groupSlice.reducer;
