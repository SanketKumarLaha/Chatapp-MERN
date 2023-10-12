import express from "express";
import mongoose from "mongoose";
import Message from "../models/MessageModel.js";
import Conversation from "../models/ConversationModel.js";
import { getSocketId, io } from "../socket/socket.js";
import requireAuth from "../middleware/requireAuth.js";
import tokenExpiry from "../middleware/tokenExpiry.js";

const router = express.Router();

//protecting routes
router.use(tokenExpiry);
router.use(requireAuth);

router.post("/sendMessage", async (req, res) => {
  try {
    const { _id } = req.user;
    const senderId = _id;
    const { receiverId, message } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      throw Error("Not a valid id");
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      message: message,
    });

    await Promise.all[
      (newMessage.save(),
      await conversation.updateOne({
        lastMessage: { text: message, sender: senderId },
      }))
    ];

    const socketId = getSocketId(receiverId);

    io.to(socketId).emit("newMessage", newMessage);

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/getMessages", async (req, res) => {
  try {
    const { pageNumber } = req.query;
    const { _id } = req.user;
    const senderId = _id;
    const { receiverId } = req.body;

    const conversationId = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversationId) {
      throw Error("No such conversation happened");
    }

    const allMessages = await Message.find({ conversationId });

    res.status(200).json(allMessages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getConversations", async (req, res) => {
  try {
    const { _id } = req.user;

    const otherUsers = await Conversation.find({
      participants: { $in: _id },
    });
    res.status(200).json(otherUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
