import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../features/auth/context/AuthContext";
import { chatApi } from "../features/chat/api/chatApi";
import { Spinner } from "../components/Spinner";

const ChatSidebar = () => {
  const { user } = useAuth();
  const [state, setState] = useState({
    chats: [],
    isLoading: true,
    isCreatingNew: false,
  });
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  const fetchChats = async () => {
    if (!user) return;

    try {
      const userChats = await chatApi.getUserChats();
      setState((prev) => ({
        ...prev,
        chats: userChats.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      toast.error("Failed to load chat history");
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if (user) fetchChats();
  }, [user]);

  const handleNewChat = async () => {
    if (!user || state.isCreatingNew) return;

    try {
      setState((prev) => ({ ...prev, isCreatingNew: true }));

      // Generate a more meaningful title or use a default one

      const title = `Chat ${state.chats.length + 1}`;
      // Create new chat with a custom title
      const newChat = await chatApi.createChat({ title });

      // Update local state
      setState((prev) => ({
        chats: [newChat, ...prev.chats],
        isCreatingNew: false,
      }));

      // Navigate to new chat
      navigate(`/dashboard/chats/${newChat.id}`);
    } catch (error) {
      console.error("Chat creation failed:", error);
      toast.error("Failed to create new chat");
      setState((prev) => ({ ...prev, isCreatingNew: false }));
    }
  };
  const formatChatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar with Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden 
          ${isMobileSidebarOpen ? "block" : "hidden"}`}
        onClick={toggleMobileSidebar}
      />

      <aside
        className={`
          fixed top-0 left-0 w-64 h-full bg-gray-900 p-4 border-r border-gray-800 
          transform transition-transform duration-300 ease-in-out z-50
          md:static md:translate-x-0 md:block overflow-y-auto
          scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 
          hover:scrollbar-thumb-gray-500
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={handleNewChat}
          disabled={state.isCreatingNew}
          className="w-full mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg
                     transition-colors disabled:opacity-70 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {state.isCreatingNew ? (
            <>
              <Spinner size="sm" />
              Creating...
            </>
          ) : (
            "+ New Chat"
          )}
        </button>

        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
          {state.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner size="md" />
            </div>
          ) : state.chats.length > 0 ? (
            <ul className="space-y-1">
              {state.chats.map((chat) => (
                <li key={chat.id} onClick={toggleMobileSidebar}>
                  <Link
                    to={`/dashboard/chats/${chat.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-800 transition-colors
                               group relative overflow-hidden"
                  >
                    <p className="text-gray-300 truncate pr-8">
                      {chat.title || "New Chat"}
                    </p>
                    <time
                      className="text-xs text-gray-500 mt-1 block"
                      dateTime={chat.createdAt}
                    >
                      {formatChatDate(chat.createdAt)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-4 text-gray-500">
              No previous chats found
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
