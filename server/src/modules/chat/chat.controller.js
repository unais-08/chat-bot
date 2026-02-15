import chatService from "./chat.service.js";

class ChatController {
  async createChat(req, res, next) {
    try {
      const { title, initialMessage } = req.body;
      const userId = req.user.userId;

      // Validation
      if (!initialMessage || initialMessage.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Initial message is required",
        });
      }

      const chat = await chatService.createChat({
        userId,
        title,
        initialMessage: initialMessage.trim(),
      });

      res.status(201).json({
        success: true,
        message: "Chat created successfully",
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  }

  async addMessage(req, res, next) {
    try {
      const { chatId } = req.params;
      const { role, content } = req.body;
      const userId = req.user.userId;

      // Validation
      if (!role || !content) {
        return res.status(400).json({
          success: false,
          message: "Role and content are required",
        });
      }

      if (!["user", "model"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Role must be either "user" or "model"',
        });
      }

      const message = await chatService.addMessage({
        chatId,
        userId,
        role,
        content: content.trim(),
      });

      res.status(201).json({
        success: true,
        message: "Message added successfully",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserChats(req, res, next) {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const chats = await chatService.getUserChats(userId, { limit, offset });

      res.status(200).json({
        success: true,
        data: chats,
        pagination: {
          limit,
          offset,
          count: chats.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getChatById(req, res, next) {
    try {
      const { chatId } = req.params;
      const userId = req.user.userId;

      const chat = await chatService.getChatById({ chatId, userId });

      res.status(200).json({
        success: true,
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteChat(req, res, next) {
    try {
      const { chatId } = req.params;
      const userId = req.user.userId;

      const result = await chatService.deleteChat({ chatId, userId });

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateChatTitle(req, res, next) {
    try {
      const { chatId } = req.params;
      const { title } = req.body;
      const userId = req.user.userId;

      // Validation
      if (!title || title.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      const chat = await chatService.updateChatTitle({
        chatId,
        userId,
        title: title.trim(),
      });

      res.status(200).json({
        success: true,
        message: "Chat title updated successfully",
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  }

  async getChatStats(req, res, next) {
    try {
      const userId = req.user.userId;

      const stats = await chatService.getChatStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
