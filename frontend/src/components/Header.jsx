import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-2 font-semibold"
          aria-label="Home"
        >
          <img
            src="/primary-logo.webp"
            alt="Mini GPT Logo"
            className="w-9 h-9 transition-transform duration-200 group-hover:scale-110"
          />
          <span className="text-lg text-zinc-900">Mini GPT</span>
          <span className="text-xs text-zinc-500 hidden sm:inline transition-opacity">
            Go Home
          </span>
        </Link>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-700 hidden sm:inline">
                {user.username}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-sm hover:bg-zinc-800 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-sm hover:bg-zinc-800 transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
