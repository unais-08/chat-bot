import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 sm:pt-24 sm:pb-20">
          {/* Main Content */}
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full mb-8 animate-fade-in">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white">
                Powered by Advanced AI
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-900 mb-6 leading-tight animate-fade-in">
              Your Intelligent
              <span className="block mt-2 bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 text-transparent bg-clip-text">
                Conversation Partner
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-zinc-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              Experience the future of AI-powered conversations. Get instant,
              intelligent responses tailored to your needs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in">
              <button
                onClick={handleGetStarted}
                className="group px-8 py-4 bg-zinc-900 text-white rounded-xl text-base font-medium hover:bg-zinc-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <span>Get Started</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-zinc-900 rounded-xl text-base font-medium hover:bg-zinc-50 transition-all duration-200 border border-zinc-300 shadow-sm hover:shadow-md w-full sm:w-auto text-center"
                >
                  Create Account
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-zinc-200 animate-fade-in">
              <div>
                <div className="text-3xl font-bold text-zinc-900 mb-1">
                  24/7
                </div>
                <div className="text-sm text-zinc-600">Always Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-zinc-900 mb-1">
                  Instant
                </div>
                <div className="text-sm text-zinc-600">Fast Responses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-zinc-900 mb-1">
                  Smart
                </div>
                <div className="text-sm text-zinc-600">AI-Powered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
              Why Choose Mini GPT?
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Powerful features designed to enhance your productivity and
              creativity
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Lightning Fast
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Get instant responses powered by advanced AI technology. No
                waiting, just results.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Secure & Private
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Your conversations are encrypted and private. We prioritize your
                data security.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                Always Learning
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Continuously improving AI that adapts to provide better and more
                accurate responses.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 sm:py-20">
          <div className="bg-zinc-900 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users already experiencing the power of AI
              conversations
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 rounded-xl text-base font-medium hover:bg-zinc-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Start Chatting Now</span>
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <span>© 2026 Mini GPT. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-600">
              <Link to="/" className="hover:text-zinc-900 transition-colors">
                Terms of Service
              </Link>
              <Link to="/" className="hover:text-zinc-900 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
