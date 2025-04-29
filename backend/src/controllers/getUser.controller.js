import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersAll = async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
  
      const messages = await Message.find({
        $or: [
          { senderId: loggedInUserId },
          { receiverId: loggedInUserId }
        ]
      }).sort({ createdAt: -1 });
  
      const userIds = new Set();
      messages.forEach(message => {
        if (message.senderId.toString() !== loggedInUserId.toString()) {
          userIds.add(message.senderId.toString());
        }
        if (message.receiverId.toString() !== loggedInUserId.toString()) {
          userIds.add(message.receiverId.toString());
        }
      });
  
      const users = await User.find({
        _id: { $in: Array.from(userIds) }
      }).select("-password");
  
      const usersWithLastMessage = await Promise.all(
        users.map(async (user) => {
          const lastMessage = await Message.findOne({
            $or: [
              { senderId: loggedInUserId, receiverId: user._id },
              { senderId: user._id, receiverId: loggedInUserId }
            ]
          }).sort({ createdAt: -1 });
  
          return {
            _id: user._id,
            fullName: user.fullName, 
            profilePic: user.profilePic,
            lastMessage: lastMessage ? lastMessage.text : "",
            lastMessageTime: lastMessage ? lastMessage.createdAt : null
          };
        })
      );
  
      const sortedUsers = usersWithLastMessage.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return b.lastMessageTime - a.lastMessageTime;
      });
  
      res.status(200).json(sortedUsers);
    } catch (error) {
      console.error("Error in getUsersForSidebar: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const getMessages = async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;
  
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      }).sort({ createdAt: 1 }); 
  
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const getUserProfile = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findById(userId).select("-password");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error in getUserProfile controller:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  };