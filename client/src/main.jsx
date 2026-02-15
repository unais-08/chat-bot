import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./features/auth/context/AuthContext";
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from "./features/auth/components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NewDashboardPage from "./pages/NewDashboardPage";
import NewChatPage from "./pages/NewChatPage";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },

  // Auth routes (only accessible when NOT logged in)
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  // Protected routes (only accessible when logged in)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <NewDashboardPage />,
      },
      {
        path: "/dashboard/chats/new",
        element: <NewChatPage />,
      },
      {
        path: "/dashboard/chats/:chatId",
        element: <NewChatPage />,
      },
    ],
  },

  // Catch-all for 404
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1f2937",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  </AuthProvider>,
);
