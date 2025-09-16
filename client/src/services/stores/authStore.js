import { create } from "zustand";
import axiosTools from "../utilities/axiosUtils";

const tokenFromStorage = localStorage.getItem("token");

const useAuthStore = create((set, get) => ({
  auth: {},
  user: null,
  token: tokenFromStorage || "",
  role: null,
  email: "",
  isLoading: false,
  message: "",
  isSuccess: false,
  isAuthenticated: !!tokenFromStorage,

  login: async ({ email, password }) => {
    set({ isLoading: true, message: "", isSuccess: false });
    try {
      const res = await axiosTools.login("auth/login", { email, password });
      localStorage.setItem("token", res.token);

      set({
        auth: res,
        user: res.user,
        token: res.token,
        role: res?.user?.role,
        email: res?.user?.email,
        isSuccess: true,
        isLoading: false,
        isAuthenticated: true,
        message: "Login successful",
      });
    } catch (error) {
      set({
        isLoading: false,
        message: error?.response?.data?.message || "Login failed",
        isSuccess: false,
      });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, message: "", isSuccess: false });
    console.log(userData);
    try {
      const res = await axiosTools.register("auth/signup", userData);
      if (res.token) {
        localStorage.setItem("token", res.token);
      }

      set({
        isSuccess: res.success,
        isLoading: false,
        message: res.message || "Registration successful",
        user: res.user,
        token: res.token,
        isAuthenticated: true,
        role: res.user?.role,
        email: res.user?.email,
        auth: res,
      });
    } catch (error) {
      console.log(error);
      set({
        isLoading: false,
        message: error?.response?.data?.message || "Registration failed",
        isSuccess: false,
      });
    }
  },

  validateToken: async () => {
    const token = get().token || localStorage.getItem("token");

    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await axiosTools.validateToken("auth/validateToken", token);

      set({
        auth: res.user,
        user: res.user,
        role: res.user.role,
        email: res.user.email,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem("token");
      set({
        isLoading: false,
        message: "Token validation failed",
        isAuthenticated: false,
        token: "",
        user: null,
        role: null,
        email: "",
      });
    }
  },

  logout: async () => {
    const token = get().token;
    try {
      if (token) {
        await axiosTools.logOut("auth/logout", token);
      }
      localStorage.removeItem("token");
      set({
        auth: {},
        user: null,
        token: "",
        role: null,
        email: "",
        isAuthenticated: false,
        isSuccess: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      // Still clear local state even if server logout fails
      localStorage.removeItem("token");
      set({
        auth: {},
        user: null,
        token: "",
        role: null,
        email: "",
        isAuthenticated: false,
        message: "Logged out",
      });
    }
  },

  setTokenAndValidate: async (token) => {
    if (!token) return;
    localStorage.setItem("token", token);
    set({ isLoading: true, message: "", isSuccess: false });

    try {
      const res = await axiosTools.validateToken("auth/validateToken", token);
      console.log("token in store", token);
      set({
        auth: res.user,
        user: res.user,
        role: res.user.role,
        token: token,
        email: res.user.email,
        isAuthenticated: true,
        isSuccess: true,
        message: "OAuth login successful",
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem("token");
      set({
        token: "",
        isAuthenticated: false,
        isLoading: false,
        message: "OAuth validation failed",
      });
    }
  },

  reset: () => {
    set({
      message: "",
      isSuccess: false,
    });
  },

  hardReset: () => {
    localStorage.removeItem("token");
    set({
      auth: {},
      user: null,
      token: "",
      role: null,
      email: "",
      isLoading: false,
      message: "",
      isSuccess: false,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
