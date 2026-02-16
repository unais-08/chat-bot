/**
 * New Chat Page Component
 *
 * Handles both new and existing chats with proper markdown rendering
 */

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "../features/chat/hooks/useChat";
import { Spinner } from "../shared/components/Spinner";
import Conversation from "../components/Conversation";

const NewChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const { chat, messages, isLoading, isGenerating, error, sendMessage } =
    useChat(chatId);

  const [input, setInput] = useState("");

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim() || isGenerating) return;

    const messageContent = input.trim();
    setInput(""); // Clear input immediately

    try {
      const result = await sendMessage(messageContent);

      // If new chat was created, navigate to it
      if (result?.chatId && !chatId) {
        navigate(`/dashboard/chats/${result.chatId}`, { replace: true });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      // Optionally show error toast
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      {/* Modern Minimal Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-6 py-3 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-zinc-100 transition-all duration-200 ease-in-out group"
            aria-label="Back to dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-zinc-500 group-hover:text-zinc-900 transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-zinc-700 truncate">
            {chat?.title || "New Chat"}
          </h1>
        </div>
      </div>

      {/* Messages Area with smooth scroll */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
        {messages.length === 0 && !isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 animate-fade-in">
              <div className="w-16 h-16 mx-auto bg-zinc-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-zinc-700">
                Start a conversation
              </h2>
              <p className="text-sm text-zinc-500">
                Type a message below to begin chatting
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            <Conversation messages={messages} isGenerating={isGenerating} />
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Display - minimal style */}
      {error && (
        <div className="px-4 sm:px-6 py-3 bg-red-50/80 backdrop-blur-sm border-t border-red-100">
          <p className="text-sm text-red-600 max-w-3xl mx-auto">{error}</p>
        </div>
      )}

      {/* Modern Sticky Input Area with blur effect */}
      <div className="bg-white/80 backdrop-blur-md border-t border-zinc-200 px-4 sm:px-6 py-4 shadow-lg sticky bottom-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl shadow-sm border border-zinc-200 p-2 focus-within:ring-2 focus-within:ring-zinc-300 focus-within:border-zinc-300 transition-all duration-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isGenerating}
              className="flex-1 px-3 py-2.5 bg-transparent focus:outline-none text-zinc-800 placeholder:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="px-4 sm:px-5 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ease-in-out font-medium text-sm whitespace-nowrap shadow-sm"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Sending</span>
                </span>
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatPage;
