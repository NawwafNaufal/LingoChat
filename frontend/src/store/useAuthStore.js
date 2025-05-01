import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
const BASE_URL = "http://localhost:4000" 
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  setAuthUser: (userData) => {
    set({ authUser: userData });
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data, shouldSetAuth = false) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      
      // Only set the auth user if specified (default is now false)
      if (shouldSetAuth) {
        set({ authUser: res.data });
        get().connectSocket();
      }
      
      toast.success("Account created successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  changePassword: async (password) => {
    set({ isChangingPassword: true });
    try {
      // Ambil email dari authUser yang sudah login
      const { authUser } = get();
      if (!authUser || !authUser.email) {
        throw new Error("User tidak terautentikasi atau email tidak tersedia");
      }
      
      // Kirim request dengan email pada URL parameter
      const res = await axiosInstance.patch(`/auth/change-password/${authUser.email}`, { 
        password 
      });
      
      toast.success("Password berhasil diperbarui");
      return res.data;
    } catch (error) {
      console.log("error in change password:", error);
      toast.error(error.response?.data?.message || "Gagal mengubah password");
      throw error;
    } finally {
      set({ isChangingPassword: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      
      // Simpan authUser yang lama
      const currentUser = get().authUser;
      
      // Update state dengan data baru, pertahankan field yang tidak diperbarui
      set({ 
        authUser: {
          ...currentUser,
          ...res.data
        }
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateUsername: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-username", data);
      
      // Simpan authUser yang lama
      const currentUser = get().authUser;
      
      // Periksa format respons dan perbarui hanya yang diperlukan
      const updatedUser = res.data.data ? res.data.data : res.data;
      
      // Update state dengan data baru, pertahankan field yang tidak diperbarui
      set({ 
        authUser: {
          ...currentUser,
          ...updatedUser
        }
      });
      
      toast.success("Nama berhasil diperbarui");
    } catch (error) {
      console.log("error in update username:", error);
      toast.error(error.response?.data?.message || "Gagal update nama");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateDescription: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-description", data);
      
      // Simpan authUser yang lama
      const currentUser = get().authUser;
      
      // Periksa format respons dan perbarui hanya yang diperlukan
      const updatedUser = res.data.data ? res.data.data : res.data;
      
      // Update state dengan data baru, pertahankan field yang tidak diperbarui
      set({ 
        authUser: {
          ...currentUser,
          ...updatedUser
        }
      });
      
      toast.success("Deskripsi berhasil diperbarui");
    } catch (error) {
      console.log("error in update description:", error);
      toast.error(error.response?.data?.message || "Gagal update deskripsi");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },


  
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));