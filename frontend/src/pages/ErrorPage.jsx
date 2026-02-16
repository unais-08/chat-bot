import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0e0c16] to-[#1a162b] text-gray-100 p-4">
      <div className="text-center max-w-2xl">
        {/* Error Icon */}
        <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent mb-6">
          404
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved. Please
          check the URL or navigate back to the homepage.
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Go Back Home</span>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
