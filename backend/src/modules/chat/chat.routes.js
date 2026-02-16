import express from "express";
import chatController from "./chat.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All chat routes require authentication
router.use(authenticate);

// Create new chat
router.post("/", chatController.createChat.bind(chatController));

// Get all user chats
router.get("/", chatController.getUserChats.bind(chatController));

// Get chat statistics
router.get("/stats", chatController.getChatStats.bind(chatController));

// Get specific chat
router.get("/:chatId", chatController.getChatById.bind(chatController));

// Update chat title
router.patch("/:chatId", chatController.updateChatTitle.bind(chatController));

// Delete chat
router.delete("/:chatId", chatController.deleteChat.bind(chatController));

// Add message to chat
router.post(
  "/:chatId/messages",
  chatController.addMessage.bind(chatController),
);

export default router;
