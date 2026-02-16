/**
 * Toast Notification Component
 *
 * Displays temporary notification messages
 */

import { useEffect } from "react";

const Toast = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: "bg-white",
      border: "border-zinc-300",
      icon: "text-zinc-900",
      text: "text-zinc-800",
    },
    error: {
      bg: "bg-white",
      border: "border-zinc-300",
      icon: "text-zinc-900",
      text: "text-zinc-800",
    },
    info: {
      bg: "bg-white",
      border: "border-zinc-300",
      icon: "text-zinc-900",
      text: "text-zinc-800",
    },
  };

  const style = styles[type] || styles.success;

  return (
    <div className="fixed top-4 right-4 z-[60] animate-slide-in-right">
      <div
        className={`${style.bg} ${style.border} border rounded-xl shadow-lg p-4 pr-12 max-w-md animate-fade-in`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {type === "success" && (
              <svg
                className={`w-5 h-5 ${style.icon}`}
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
            )}
            {type === "error" && (
              <svg
                className={`w-5 h-5 ${style.icon}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {type === "info" && (
              <svg
                className={`w-5 h-5 ${style.icon}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>

          {/* Message */}
          <p className={`text-sm font-medium ${style.text} leading-relaxed`}>
            {message}
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-3 right-3 ${style.icon} hover:opacity-70 transition-opacity`}
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
        </div>
      </div>
    </div>
  );
};

export default Toast;
