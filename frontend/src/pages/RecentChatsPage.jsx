/**
 * Recent Chats Page
 *
 * Dedicated page for viewing and managing all chat conversations
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useChatList } from "../features/chat/hooks/useChatList";
import { chatApi } from "../features/chat/api/chatApi";
import { useAuth } from "../features/auth/context/AuthContext";
import { Spinner } from "../shared/components/Spinner";
import ConfirmDialog from "../shared/components/ConfirmDialog";
import Toast from "../shared/components/Toast";

const RecentChatsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chats, isLoading, removeChat } = useChatList();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, oldest, alphabetical
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    chatId: null,
    chatTitle: "",
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [deletingChatId, setDeletingChatId] = useState(null);

  const handleDeleteChat = async (chatId, chatTitle, e) => {
    e.preventDefault();
    e.stopPropagation();

    setDeleteDialog({ isOpen: true, chatId, chatTitle });
  };

  const confirmDelete = async () => {
    const { chatId } = deleteDialog;
    setDeletingChatId(chatId);

    try {
      await chatApi.deleteChat(chatId);

      // Wait for animation before removing from state
      setTimeout(() => {
        removeChat(chatId);
        setDeletingChatId(null);
        setToast({
          isVisible: true,
          message: "Chat deleted successfully",
          type: "success",
        });
      }, 200);
    } catch (error) {
      console.error("Failed to delete chat:", error);
      setDeletingChatId(null);
      setToast({
        isVisible: true,
        message: "Failed to delete chat. Please try again.",
        type: "error",
      });
    }
  };

  // Filter and sort chats
  const filteredAndSortedChats = chats
    .filter((chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-zinc-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-10 h-10 rounded-xl hover:bg-zinc-100 transition-all duration-200 flex items-center justify-center group"
              >
                <svg
                  className="w-5 h-5 text-zinc-600 group-hover:text-zinc-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shadow-sm">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <h1 className="text-xl font-semibold text-zinc-800">
                    All Chats
                  </h1>
                  <p className="text-xs text-zinc-500">
                    {chats.length} conversation{chats.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard/chats/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all duration-200 shadow-sm font-medium group"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">New Chat</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 transition-all duration-200 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-zinc-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 transition-all duration-200 text-sm font-medium text-zinc-700 cursor-pointer hover:bg-zinc-50"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        {!isLoading && chats.length > 0 && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-zinc-700"
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
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Total</p>
                  <p className="text-xl font-bold text-zinc-800">
                    {chats.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-zinc-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Showing</p>
                  <p className="text-xl font-bold text-zinc-800">
                    {filteredAndSortedChats.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-zinc-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Today</p>
                  <p className="text-xl font-bold text-zinc-800">
                    {
                      chats.filter((chat) => {
                        const today = new Date().toDateString();
                        const chatDate = new Date(
                          chat.createdAt,
                        ).toDateString();
                        return today === chatDate;
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">This Week</p>
                  <p className="text-xl font-bold text-zinc-800">
                    {
                      chats.filter((chat) => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(chat.createdAt) >= weekAgo;
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-zinc-800 animate-spin"></div>
              </div>
              <p className="text-sm text-zinc-500 font-medium">
                Loading your conversations...
              </p>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-3xl rotate-6"></div>
                <div className="absolute inset-0 bg-white rounded-3xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-12 h-12 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-zinc-700 mb-3">
                No conversations yet
              </h3>
              <p className="text-sm text-zinc-500 mb-8 max-w-md mx-auto">
                Start your first conversation with our AI assistant. Ask
                questions, get help, or just chat about anything!
              </p>
              <Link
                to="/dashboard/chats/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all duration-200 shadow-sm font-medium group"
              >
                <svg
                  className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Start Your First Chat</span>
              </Link>
            </div>
          ) : filteredAndSortedChats.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 mx-auto bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-700 mb-2">
                No chats found
              </h3>
              <p className="text-sm text-zinc-500 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-zinc-900 hover:text-zinc-700 font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200">
              {filteredAndSortedChats.map((chat, index) => (
                <Link
                  key={chat.id}
                  to={`/dashboard/chats/${chat.id}`}
                  className={`block p-5 hover:bg-zinc-50 transition-all duration-200 group animate-fade-in ${
                    deletingChatId === chat.id
                      ? "animate-slide-out pointer-events-none"
                      : ""
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Chat Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-200">
                      <svg
                        className="w-6 h-6 text-zinc-600"
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

                    {/* Chat Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-zinc-800 truncate group-hover:text-zinc-900 mb-1">
                        {chat.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {new Date(chat.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {new Date(chat.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) =>
                          handleDeleteChat(chat.id, chat.title, e)
                        }
                        className="p-2.5 text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg hover:bg-red-50"
                        title="Delete chat"
                        disabled={deletingChatId === chat.id}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <svg
                        className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 group-hover:translate-x-1 transition-all duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({ isOpen: false, chatId: null, chatTitle: "" })
        }
        onConfirm={confirmDelete}
        title="Delete Chat?"
        message={`Are you sure you want to delete "${deleteDialog.chatTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default RecentChatsPage;
