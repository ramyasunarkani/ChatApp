import {
  setAuthUser,
  setIsSigningUp,
  setIsLoggingIn,
  setIsUpdatingProfile,
  setIsCheckingAuth,
} from "./authSlice";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// ✅ checkAuth
export const checkAuth = () => async (dispatch) => {
  dispatch(setIsCheckingAuth(true));
  try {
    const res = await axiosInstance.get("/auth/check");
    dispatch(setAuthUser(res.data));
  } catch (error) {
    console.log("Error in checkAuth:", error);
    dispatch(setAuthUser(null));
  } finally {
    dispatch(setIsCheckingAuth(false));
  }
};

// ✅ signup
export const signup = (data) => async (dispatch) => {
  dispatch(setIsSigningUp(true));
  try {
    const res = await axiosInstance.post("/auth/signup", data);
    dispatch(setAuthUser(res.data));
    toast.success("Account created successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Signup failed");
  } finally {
    dispatch(setIsSigningUp(false));
  }
};

// ✅ login
export const login = (data) => async (dispatch) => {
  dispatch(setIsLoggingIn(true));
  try {
    const res = await axiosInstance.post("/auth/login", data);
    dispatch(setAuthUser(res.data));
    toast.success("Logged in successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    dispatch(setIsLoggingIn(false));
  }
};

// ✅ logout
export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.post("/auth/logout");
    dispatch(setAuthUser(null));
    toast.success("Logged out successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Logout failed");
  }
};

// ✅ updateProfile
export const updateProfile = (data) => async (dispatch) => {
  dispatch(setIsUpdatingProfile(true));
  try {
    const res = await axiosInstance.put("/auth/update-profile", data);
    dispatch(setAuthUser(res.data));
    toast.success("Profile updated successfully");
  } catch (error) {
    console.log("error in update profile:", error);
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    dispatch(setIsUpdatingProfile(false));
  }
};
