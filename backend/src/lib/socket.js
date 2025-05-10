import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Digunakan untuk menyimpan pengguna online
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("Pengguna terhubung", socket.id);
  
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  
  // Kirim daftar pengguna online ke semua klien yang terhubung
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
  // Listener untuk pesan baru
  socket.on("sendMessage", (messageData) => {
    console.log("Pesan baru diterima:", messageData);
    
    // Kirim pesan ke semua klien
    io.emit("newMessage", messageData);
    
    // Jika ini adalah pesan ke pengguna baru, kirim event khusus
    const receiverId = messageData.receiverId;
    if (receiverId && !userSocketMap[receiverId]) {
      io.emit("newUserMessage", {
        userId: receiverId,
        message: messageData
      });
    }
  });
  
  // Listener untuk pesan yang dihapus
  socket.on("messageDeleted", ({ messageId, receiverId }) => {
    console.log("Pesan dihapus:", messageId);
    
    // Kirim ke semua klien
    io.emit("messageDeleted", { messageId });
    
    // Kirim ke penerima spesifik jika online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }
  });
  
  // Listener untuk pesan yang diperbarui
  socket.on("messageUpdated", ({ messageId, updatedMessage, receiverId }) => {
    console.log("Pesan diperbarui:", messageId);
    
    // Kirim ke semua klien
    io.emit("messageUpdated", { messageId, updatedMessage });
    
    // Kirim ke penerima spesifik jika online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageUpdated", { messageId, updatedMessage });
    }
  });
  
  // Ketika pengguna disconnect
  socket.on("disconnect", () => {
    console.log("Pengguna terputus", socket.id);
    
    // Hapus pengguna dari peta
    for (const key in userSocketMap) {
      if (userSocketMap[key] === socket.id) {
        delete userSocketMap[key];
        break;
      }
    }
    
    // Perbarui daftar pengguna online
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };