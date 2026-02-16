import { useState } from "react";
import { Link } from "react-router-dom";

// ChatList.jsx
const ChatList = () => {
  const [isPending, setIsPending] = useState(true);
  const [data, setData] = useState([]);

  return (
    <div className="h-full flex flex-col p-2 gap-4 bg-gray-900/80">
      {/* New Chat Button */}
      <button className="w-full p-3 mb-2 rounded-lg bg-gray-800 hover:bg-gray-700/50 border border-gray-700 transition-colors">
        <span className="flex items-center gap-2 text-gray-300">
          <span>+</span> New Chat
        </span>
      </button>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
        <div className="space-y-1">
          {isPending ? (
            <div className="p-3 text-center text-gray-500 animate-pulse">
              Loading history...
            </div>
          ) : data.length > 0 ? (
            data.map((chat) => (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300"
              >
                <span className="text-gray-400">💬</span>
                <span className="truncate">{chat.title || "New Chat"}</span>
              </Link>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-center">
              No chat history found
            </div>
          )}
        </div>
      </div>

      {/* Account Section */}
      <div className=" border-t border-gray-800 ">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-sm">U</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-100">Username</p>
            <p className="text-xs text-gray-400">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
