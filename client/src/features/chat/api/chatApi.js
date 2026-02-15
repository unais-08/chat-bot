/**
 * Chat API Service
 *
 * All chat-related API calls
 */

import { api } from "../../../lib/api/client";

export const chatApi = {
  /**
   * Create new chat
   */
  async createChat({ title, initialMessage }) {
    const response = await api.post("/chats", {
      title,
      initialMessage,
    });
    return response.data;
  },

  /**
   * Get all user chats
   */
  async getUserChats({ limit = 50, offset = 0 } = {}) {
    const response = await api.get("/chats", {
      params: { limit, offset },
    });
    return response.data;
  },

  /**
   * Get specific chat by ID
   */
  async getChatById(chatId) {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  },

  /**
   * Add message to chat
   */
  async addMessage(chatId, { role, content }) {
    const response = await api.post(`/chats/${chatId}/messages`, {
      role,
      content,
    });
    return response.data;
  },

  /**
   * Update chat title
   */
  async updateChatTitle(chatId, title) {
    const response = await api.patch(`/chats/${chatId}`, {
      title,
    });
    return response.data;
  },

  /**
   * Delete chat
   */
  async deleteChat(chatId) {
    const response = await api.delete(`/chats/${chatId}`);
    return response.data;
  },

  /**
   * Get chat statistics
   */
  async getChatStats() {
    const response = await api.get("/chats/stats");
    return response.data;
  },
};
