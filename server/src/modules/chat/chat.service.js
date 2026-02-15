import prisma from "../../config/database.js";

class ChatService {
  async createChat({ userId, title, initialMessage }) {
    // Generate default title if not provided
    const chatTitle = title || `New Chat - ${new Date().toLocaleDateString()}`;

    // Create chat with initial message in a transaction
    const chat = await prisma.chat.create({
      data: {
        title: chatTitle,
        userId,
        messages: {
          create: [
            {
              role: "user",
              content: initialMessage,
            },
          ],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return chat;
  }

  async addMessage({ chatId, userId, role, content }) {
    // Verify chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!chat) {
      throw new Error("Chat not found or unauthorized");
    }

    // Add message to chat
    const message = await prisma.message.create({
      data: {
        chatId,
        role,
        content,
      },
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getUserChats(userId, { limit = 50, offset = 0 } = {}) {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          take: 1, // Only get first message for preview
        },
        _count: {
          select: { messages: true },
        },
      },
    });

    return chats;
  }

  async getChatById({ chatId, userId }) {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!chat) {
      throw new Error("Chat not found or unauthorized");
    }

    return chat;
  }

  async deleteChat({ chatId, userId }) {
    // Verify ownership
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!chat) {
      throw new Error("Chat not found or unauthorized");
    }

    // Delete chat (messages will be deleted via cascade)
    await prisma.chat.delete({
      where: { id: chatId },
    });

    return { message: "Chat deleted successfully" };
  }

  async updateChatTitle({ chatId, userId, title }) {
    // Verify ownership
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!chat) {
      throw new Error("Chat not found or unauthorized");
    }

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { title },
    });

    return updatedChat;
  }

  async getChatStats(userId) {
    const [totalChats, totalMessages] = await Promise.all([
      prisma.chat.count({
        where: { userId },
      }),
      prisma.message.count({
        where: {
          chat: {
            userId,
          },
        },
      }),
    ]);

    return {
      totalChats,
      totalMessages,
    };
  }
}

export default new ChatService();
