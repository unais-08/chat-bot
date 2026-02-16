/**
 * useChat Hook
 *
 * Manages single chat state and operations
 */

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { chatApi } from "../api/chatApi";
import { geminiService } from "../../../lib/gemini/gemini";

export const useChat = (chatId) => {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load chat data
   */
  const loadChat = useCallback(async () => {
    if (!chatId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await chatApi.getChatById(chatId);
      const chatData = response.data;

      setChat(chatData);
      setMessages(chatData.messages || []);
    } catch (err) {
      console.error("Failed to load chat:", err);
      const errorMsg = err.message || "Failed to load chat";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  /**
   * Load chat on mount or chatId change
   */
  useEffect(() => {
    loadChat();
  }, [loadChat]);

  /**
   * Send message (with optimistic update)
   */
  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || isGenerating) return null;

      const userMessage = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      try {
        setIsGenerating(true);
        setError(null);

        // Optimistic update - add user message immediately
        setMessages((prev) => [...prev, userMessage]);

        let currentChatId = chatId;

        // Create new chat if this is the first message
        if (!currentChatId) {
          const newChatResponse = await chatApi.createChat({
            title: content.substring(0, 50),
            initialMessage: content.trim(),
          });

          currentChatId = newChatResponse.data.id;
          setChat(newChatResponse.data);

          // Replace temp user message with real one from server
          setMessages(newChatResponse.data.messages || []);

          // DON'T return here - continue to generate AI response
        } else {
          // Add user message to existing chat
          const userMsgResponse = await chatApi.addMessage(currentChatId, {
            role: "user",
            content: content.trim(),
          });

          // Replace temp message with real one
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === userMessage.id ? userMsgResponse.data : msg,
            ),
          );
        }

        // Generate AI response
        const aiResponse = await geminiService.generateResponse(content.trim());

        // Add AI message optimistically
        const aiMessage = {
          id: `temp-ai-${Date.now()}`,
          role: "model",
          content: aiResponse,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Save AI message to backend
        const aiMsgResponse = await chatApi.addMessage(currentChatId, {
          role: "model",
          content: aiResponse,
        });

        // Replace temp AI message with real one
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id ? aiMsgResponse.data : msg,
          ),
        );

        // Return the chatId for navigation (important for new chats)
        return { chatId: currentChatId, messages: null };
      } catch (err) {
        console.error("Failed to send message:", err);
        const errorMsg = err.message || "Failed to send message";
        setError(errorMsg);
        toast.error(errorMsg);

        // Rollback optimistic update
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));

        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [chatId, isGenerating],
  );

  /**
   * Update chat title
   */
  const updateTitle = useCallback(
    async (newTitle) => {
      if (!chatId || !newTitle.trim()) return;

      try {
        const response = await chatApi.updateChatTitle(chatId, newTitle.trim());
        setChat(response.data);
      } catch (err) {
        console.error("Failed to update title:", err);
        throw err;
      }
    },
    [chatId],
  );

  /**
   * Delete chat
   */
  const deleteChat = useCallback(async () => {
    if (!chatId) return;

    try {
      await chatApi.deleteChat(chatId);
    } catch (err) {
      console.error("Failed to delete chat:", err);
      throw err;
    }
  }, [chatId]);

  return {
    chat,
    messages,
    isLoading,
    isGenerating,
    error,
    sendMessage,
    updateTitle,
    deleteChat,
    refetch: loadChat,
  };
};
