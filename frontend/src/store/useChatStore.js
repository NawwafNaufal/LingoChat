import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getUsersAll: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/getUsers");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching all users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  },

  // Function to delete a message
  deleteMessage: async (messageId) => {
    try {
      // Call the API endpoint to delete the message
      await axiosInstance.delete(`/messages/${messageId}`);
      
      // Update the messages state by filtering out the deleted message
      set({ 
        messages: get().messages.filter(message => message._id !== messageId) 
      });
      
      // Show success notification
      toast.success("Message deleted successfully");
      
      // Optionally emit a socket event to notify other users
      const socket = useAuthStore.getState().socket;
      if (socket) {
        const selectedUser = get().selectedUser;
        socket.emit("messageDeleted", {
          messageId,
          receiverId: selectedUser._id
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(error.response?.data?.error || "Failed to delete message");
    }
  },
  
  // Enhanced function to update a message
  updateMessage: async (messageId, updatedData) => {
    try {
      // Call the API endpoint to update the message
      const res = await axiosInstance.put(`/messages/${messageId}`, updatedData);
      
      // Ensure we have the complete updated message from the server
      // The server returns { message: "...", updatedMessage: {...} }
      const updatedMessage = res.data.updatedMessage || res.data;
      
      console.log("Updated message from server:", updatedMessage);
      
      // Update the message in state
      set({
        messages: get().messages.map(message => 
          message._id === messageId ? updatedMessage : message
        )
      });
      
      toast.success("Message updated successfully");
      
      // Emit a socket event for realtime updates to other clients
      const socket = useAuthStore.getState().socket;
      if (socket) {
        const selectedUser = get().selectedUser;
        socket.emit("messageUpdated", {
          messageId,
          updatedMessage,
          receiverId: selectedUser._id
        });
      }
      
      return updatedMessage;
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error(error.response?.data?.error || "Failed to update message");
      throw error; // Rethrow to allow caller to handle
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
    
    // Add socket listener for deleted messages
    socket.on("messageDeleted", ({ messageId }) => {
      set({
        messages: get().messages.filter(message => message._id !== messageId)
      });
    });
    
    // Add socket listener for updated messages
    socket.on("messageUpdated", ({ messageId, updatedMessage }) => {
      set({
        messages: get().messages.map(message => 
          message._id === messageId ? updatedMessage : message
        )
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("messageUpdated");
  },

  getUserProfile: async (userId) => {
    set({ isLoadingProfile: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}/profile`);
      set({ userProfile: res.data });
      return res.data;
    } catch (error) {
      console.log("Error di getUserProfile:", error);
      toast.error("Gagal mengambil profil pengguna");
      return null;
    } finally {
      set({ isLoadingProfile: false });
    }
  },
  clearUserProfile: () => {
    set({ userProfile: null });
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));