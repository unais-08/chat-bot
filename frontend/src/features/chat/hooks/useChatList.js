/**
 * useChatList Hook
 *
 * Manages list of user's chats
 */

import { useState, useEffect, useCallback } from "react";
import { chatApi } from "../api/chatApi";

export const useChatList = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    hasMore: false,
  });

  /**
   * Load user chats
   */
  const loadChats = useCallback(async (options = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const { limit = 50, offset = 0, append = false } = options;

      const response = await chatApi.getUserChats({ limit, offset });
      const fetchedChats = response.data;

      if (append) {
        setChats((prev) => [...prev, ...fetchedChats]);
      } else {
        setChats(fetchedChats);
      }

      setPagination({
        limit,
        offset,
        hasMore: fetchedChats.length === limit,
      });
    } catch (err) {
      console.error("Failed to load chats:", err);
      setError(err.message || "Failed to load chats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load chats on mount
   */
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  /**
   * Load more chats (pagination)
   */
  const loadMore = useCallback(() => {
    if (!pagination.hasMore || isLoading) return;

    loadChats({
      limit: pagination.limit,
      offset: pagination.offset + pagination.limit,
      append: true,
    });
  }, [pagination, isLoading, loadChats]);

  /**
   * Add new chat to list (after creation)
   */
  const addChat = useCallback((newChat) => {
    setChats((prev) => [newChat, ...prev]);
  }, []);

  /**
   * Remove chat from list (after deletion)
   */
  const removeChat = useCallback((chatId) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
  }, []);

  /**
   * Update chat in list (e.g., after title change)
   */
  const updateChat = useCallback((chatId, updates) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat)),
    );
  }, []);

  return {
    chats,
    isLoading,
    error,
    pagination,
    loadMore,
    addChat,
    removeChat,
    updateChat,
    refetch: loadChats,
  };
};
