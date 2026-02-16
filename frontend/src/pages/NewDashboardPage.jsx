/**
 * New Dashboard Page
 *
 * Shows user stats and recent chats
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useChatList } from "../features/chat/hooks/useChatList";
import { chatApi } from "../features/chat/api/chatApi";
import { useAuth } from "../features/auth/context/AuthContext";
import { Spinner } from "../shared/components/Spinner";
import ConfirmDialog from "../shared/components/ConfirmDialog";
import Toast from "../shared/components/Toast";

const NewDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { chats, isLoading: chatsLoading, removeChat } = useChatList();

  const [stats, setStats] = useState({ totalChats: 0, totalMessages: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
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

  // Load stats on mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await chatApi.getChatStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-50 to-zinc-100">
      {/* Enhanced Modern Header with user greeting */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-zinc-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-sm">
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
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-zinc-800">Dashboard</h1>
              <p className="text-xs text-zinc-500">
                Welcome back,{" "}
                {user?.name || user?.email?.split("@")[0] || "User"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-zinc-100 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {(user?.name || user?.email || "U")[0].toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-zinc-700 font-medium">
                {user?.email || "User"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-zinc-700 hover:text-zinc-900 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-all duration-200 ease-in-out"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}

        {/* Enhanced Modern Stats Cards with gradient accents */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* New Chat Card - Featured with gradient */}
          <Link
            to="/dashboard/chats/new"
            className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-200">
                  <svg
                    className="w-6 h-6"
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
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-zinc-400 font-medium mb-1">
                Start New
              </p>
              <h3 className="text-2xl font-bold mb-2">Chat</h3>
              <p className="text-xs text-zinc-400">
                Begin a fresh conversation
              </p>
            </div>
          </Link>

          {/* Total Chats Card - Enhanced */}
          <Link
            to="/dashboard/chats"
            className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Active</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-500 font-medium mb-1">
              Total Chats
            </p>
            <h3 className="text-3xl font-bold text-zinc-800">
              {statsLoading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                stats.totalChats
              )}
            </h3>
            <p className="text-xs text-zinc-500 mt-2">View all chat history</p>
          </Link>

          {/* Total Messages Card - Enhanced */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <svg
                    className="w-3 h-3 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Live</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-500 font-medium mb-1">
              Total Messages
            </p>
            <h3 className="text-3xl font-bold text-zinc-800">
              {statsLoading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                stats.totalMessages
              )}
            </h3>
            <p className="text-xs text-zinc-500 mt-2">Messages exchanged</p>
          </div>

          {/* Active Today Card - Enhanced */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md hover:border-zinc-300 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-6 h-6 text-green-600"
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
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Today</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-500 font-medium mb-1">
              Active Today
            </p>
            <h3 className="text-3xl font-bold text-zinc-800">
              {statsLoading || chatsLoading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                chats.filter((chat) => {
                  const today = new Date().toDateString();
                  const chatDate = new Date(chat.createdAt).toDateString();
                  return today === chatDate;
                }).length
              )}
            </h3>
            <p className="text-xs text-zinc-500 mt-2">Chats created today</p>
          </div>
        </div>

        {/* Professional Recent Chats Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-zinc-50 to-white border-b border-zinc-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-1">
                  Recent Activity
                </h2>
                <p className="text-sm text-zinc-500">
                  Your latest conversations
                </p>
              </div>
              {chats.length > 0 && (
                <Link
                  to="/dashboard/chats"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow group"
                >
                  <span>View All</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
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
                </Link>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {chatsLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-zinc-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-zinc-900 animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-zinc-600">
                  Loading conversations...
                </p>
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-100 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-zinc-400"
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
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-white"
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
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
                  Start your first conversation with our AI assistant and unlock
                  intelligent responses tailored to your needs.
                </p>
                <Link
                  to="/dashboard/chats/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium group"
                >
                  <svg
                    className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
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
                  <span>Start Chatting</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {chats.slice(0, 10).map((chat, index) => (
                  <Link
                    key={chat.id}
                    to={`/dashboard/chats/${chat.id}`}
                    className={`flex items-center gap-4 py-4 px-4 -mx-4 rounded-xl hover:bg-zinc-50 transition-all duration-200 group animate-fade-in ${
                      deletingChatId === chat.id
                        ? "animate-slide-out pointer-events-none"
                        : ""
                    }`}
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    {/* Avatar with number */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center group-hover:from-zinc-200 group-hover:to-zinc-300 transition-all duration-200">
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
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-[10px] font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-zinc-900 truncate group-hover:text-zinc-800 mb-1.5">
                        {chat.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
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
                            {new Date(chat.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <span className="text-zinc-300">•</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span>Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) =>
                          handleDeleteChat(chat.id, chat.title, e)
                        }
                        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete conversation"
                        disabled={deletingChatId === chat.id}
                      >
                        <svg
                          className="w-4 h-4"
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
                        className="w-5 h-5 text-zinc-300 group-hover:text-zinc-600 group-hover:translate-x-1 transition-all duration-200"
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
                  </Link>
                ))}
              </div>
            )}
          </div>
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

export default NewDashboardPage;
