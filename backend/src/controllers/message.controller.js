import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { translateMessage } from "../../utils/translate.js";
import { autocorrectMessage } from "../../utils/Autocorrect/index.js";

const labelToCode = {
  English: 'en',
  Indonesia: 'id',
  Spanish: 'es',
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
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
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, targetLang, sourceLang } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const corrected = await autocorrectMessage(text, sourceLang);
    const translated = await translateMessage(corrected, sourceLang, targetLang);

    const newMessage = new Message({
      senderId,
      receiverId,
      text: translated,
      image: imageUrl,
      originalText: text,
      correctedText: corrected,
      targetLang: labelToCode[targetLang],
      sourceLang: labelToCode[sourceLang]
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { originalText, image, sourceLang, targetLang } = req.body;
    const userId = req.user._id;

    // Cari pesan yang ingin diupdate
    const message = await Message.findById(id);

    // Jika pesan tidak ditemukan
    if (!message) {
      return res.status(404).json({ error: "Pesan tidak ditemukan" });
    }

    // Verifikasi bahwa user adalah pengirim pesan
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Anda tidak memiliki izin untuk mengedit pesan ini" });
    }

    // Lakukan autocorrect dan translate seperti saat mengirim pesan baru
    let correctedText = originalText;
    let translatedText = originalText;

    if (originalText) {
      correctedText = await autocorrectMessage(originalText, sourceLang);
      
      translatedText = await translateMessage(correctedText, sourceLang, targetLang);
      
      message.originalText = originalText;
      message.correctedText = correctedText;
      message.text = translatedText;
    }

    // Update field lainnya
    if (image !== undefined) message.image = image;
    if (sourceLang !== undefined) message.sourceLang = labelToCode[sourceLang] || sourceLang;
if (targetLang !== undefined) message.targetLang = labelToCode[targetLang] || targetLang;

    // Simpan perubahan
    await message.save();

    res.status(200).json({ message: "Pesan berhasil diperbarui", updatedMessage: message });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memperbarui pesan" });
  }
};

// Controller untuk delete pesan
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Asumsikan middleware auth sudah menyimpan user di req.user

    // Cari pesan yang ingin dihapus
    const message = await Message.findById(id);

    // Jika pesan tidak ditemukan
    if (!message) {
      return res.status(404).json({ error: "Pesan tidak ditemukan" });
    }

    // Verifikasi bahwa user adalah pengirim pesan
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Anda tidak memiliki izin untuk menghapus pesan ini" });
    }

    // Hapus pesan
    await Message.findByIdAndDelete(id);

    res.status(200).json({ message: "Pesan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat menghapus pesan" });
  }
};
