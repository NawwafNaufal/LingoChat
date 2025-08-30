import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://192.168.139.28:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("Pengguna terhubung", socket.id);
  
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
  socket.on("sendMessage", (messageData) => {
    console.log("Pesan baru diterima:", messageData);
    
    io.emit("newMessage", messageData);
    
    const receiverId = messageData.receiverId;
    if (receiverId && !userSocketMap[receiverId]) {
      io.emit("newUserMessage", {
        userId: receiverId,
        message: messageData
      });
    }
  });
  
  socket.on("messageDeleted", ({ messageId, receiverId }) => {
    console.log("Pesan dihapus:", messageId);
    
    io.emit("messageDeleted", { messageId });
    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }
  });
  
  socket.on("messageUpdated", ({ messageId, updatedMessage, receiverId }) => {
    console.log("Pesan diperbarui:", messageId);
    
    io.emit("messageUpdated", { messageId, updatedMessage });
    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageUpdated", { messageId, updatedMessage });
    }
  });
  
  socket.on("disconnect", () => {
    console.log("Pengguna terputus", socket.id);
    
    for (const key in userSocketMap) {
      if (userSocketMap[key] === socket.id) {
        delete userSocketMap[key];
        break;
      }
    }
    
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };