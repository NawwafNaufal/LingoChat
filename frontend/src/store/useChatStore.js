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
  isLoadingProfile: false,
  userProfile: null,
  isSendingMessage: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengambil daftar pengguna");
      throw error;
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getUsersAll: async () => {
    set({ isUsersLoading: true }); 
    try {
      const res = await axiosInstance.get("/messages/getUsers");
      set({ users: res.data });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengambil semua pengguna");
      throw error;
    } finally {
      set({ isUsersLoading: false }); // Pastikan loading state dimatikan
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengambil pesan");
      throw error;
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      set({ isSendingMessage: true });
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
      get().updateUserWithLastMessage(selectedUser._id, res.data);
      set({ isSendingMessage: false }); 
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim pesan");
      throw error;
    }
  },

  updateUserWithLastMessage: (userId, message) => {
    const { users } = get();
    const updatedUsers = users.map(user =>
      user._id === userId
        ? {
            ...user,
            lastMessage: message.text || "📷 Gambar",
            lastMessageTime: message.createdAt,
          }
        : user
    );
    set({ users: updatedUsers });
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set({ messages: get().messages.filter(m => m._id !== messageId) });
      toast.success("Pesan berhasil dihapus");

      const socket = useAuthStore.getState().socket;
      if (socket) {
        const selectedUser = get().selectedUser;
        socket.emit("messageDeleted", {
          messageId,
          receiverId: selectedUser._id,
        });
      }
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menghapus pesan");
      throw error;
    }
  },

  updateMessage: async (messageId, updatedData) => {
    try {
      const res = await axiosInstance.put(`/messages/${messageId}`, updatedData);
      const updatedMessage = res.data.updatedMessage || res.data;
      set({
        messages: get().messages.map(message =>
          message._id === messageId ? updatedMessage : message
        ),
      });
      toast.success("Pesan berhasil diperbarui");

      const socket = useAuthStore.getState().socket;
      if (socket) {
        const selectedUser = get().selectedUser;
        socket.emit("messageUpdated", {
          messageId,
          updatedMessage,
          receiverId: selectedUser._id,
        });
      }

      return updatedMessage;
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal memperbarui pesan");
      throw error;
    }
  },

  updateUsersList: async (newMessage) => {
    const { users } = get();
    const currentUserId = useAuthStore.getState().authUser?._id;
    const otherUserId = newMessage.senderId === currentUserId
      ? newMessage.receiverId
      : newMessage.senderId;

    const userExists = users.some(user => user._id === otherUserId);

    if (!userExists) {
      // Jika user belum ada, ambil profilnya dan tambahkan ke list
      try {
        const res = await axiosInstance.get(`/messages/${otherUserId}/profile`);
        const newUser = {
          ...res.data,
          lastMessage: newMessage.text || "📷 Gambar",
          lastMessageTime: newMessage.createdAt,
        };
        set({ users: [newUser, ...users] });
        return newUser;
      } catch (error) {
        console.error("Gagal menambahkan user baru:", error);
        throw error;
      }
    } else {
      return get().updateUserWithLastMessage(otherUserId, newMessage);
    }
  },

  subscribeToMessages: () => {
    get().unsubscribeFromMessages();
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // const currentUserId = useAuthStore.getState().authUser?._id;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();
      const isCurrentChat = selectedUser &&
        (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id);

      if (isCurrentChat) {
        set({ messages: [...messages, newMessage] });
      }

      get().updateUsersList(newMessage);
    });

    socket.on("messageDeleted", ({ messageId }) => {
      set({
        messages: get().messages.filter(m => m._id !== messageId),
      });
    });

    socket.on("messageUpdated", ({ messageId, updatedMessage }) => {
      set({
        messages: get().messages.map(m =>
          m._id === messageId ? updatedMessage : m
        ),
      });
    });

    socket.on("newUserMessage", () => {
      // Panggil getUsersAll tanpa mengubah state loading
      get().getUsersAll();
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("newUserMessage");
    socket.off("messageDeleted");
    socket.off("messageUpdated");
  },

  setupSocketEventListeners: () => {
    const handleSocketConnected = () => {
      console.log("Socket connected");
      get().subscribeToMessages();
      // Panggil getUsersAll tanpa mengatur loading state pada koneksi ulang socket
      get().getUsersAll();
    };

    const handleSocketDisconnecting = () => {
      console.log("Socket disconnecting");
      get().unsubscribeFromMessages();
    };

    window.addEventListener("socketConnected", handleSocketConnected);
    window.addEventListener("socketDisconnecting", handleSocketDisconnecting);

    return () => {
      window.removeEventListener("socketConnected", handleSocketConnected);
      window.removeEventListener("socketDisconnecting", handleSocketDisconnecting);
    };
  },

  getUserProfile: async (userId) => {
    set({ isLoadingProfile: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}/profile`);
      set({ userProfile: res.data });
      return res.data;
    } catch (error) {
      console.log(error)
      toast.error("Gagal mengambil profil pengguna");
      return null;
    } finally {
      set({ isLoadingProfile: false });
    }
  },

  clearUserProfile: () => set({ userProfile: null }),

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));