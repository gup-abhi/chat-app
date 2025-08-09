import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const logedInUser = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: logedInUser } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesForUser = async (req, res) => {
    try {
        const {id: userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const sendMessage = async (req, res) => {
    try {
        const {text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMesage = new Message({
            text,
            senderId,
            receiverId,
            image: imageUrl || "",
        });

        await newMesage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-message", newMesage);
        }

        res.status(201).json(newMesage);
    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}