import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setIsSigningUp: (state, action) => {
      state.isSigningUp = action.payload;
    },
    setIsLoggingIn: (state, action) => {
      state.isLoggingIn = action.payload;
    },
    setIsUpdatingProfile: (state, action) => {
      state.isUpdatingProfile = action.payload;
    },
    setIsCheckingAuth: (state, action) => {
      state.isCheckingAuth = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  setAuthUser,
  setIsSigningUp,
  setIsLoggingIn,
  setIsUpdatingProfile,
  setIsCheckingAuth,
  setOnlineUsers,
} = authSlice.actions;

export default authSlice.reducer;
