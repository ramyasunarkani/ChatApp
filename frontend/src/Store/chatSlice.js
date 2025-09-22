import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setIsUsersLoading: (state, action) => {
      state.isUsersLoading = action.payload;
    },
    setIsMessagesLoading: (state, action) => {
      state.isMessagesLoading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setUsers,
  setMessages,
  addMessage,
  setSelectedUser,
  setIsUsersLoading,
  setIsMessagesLoading,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
