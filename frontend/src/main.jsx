import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Homepage from "./routes/homepage/Homepage.jsx";
import ChatPage from "./routes/chatPage/ChatPage.jsx";
import SignInPage from "./routes/signInPage/SignInPage.jsx";
import SignUpPage from "./routes/signUpPage/SignUpPage.jsx";
import DashboardPage from "./routes/dashboardPage/DashboardPage.jsx";
import RootLayout from "./layouts/rootLayout/RootLayout.jsx";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import NotFound from "./routes/notFound/NotFound.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminOverview from "./components/admin/AdminOverview/AdminOverview.jsx";
import AdminDashboard from "./routes/adminDashboard/AdminDashboard.jsx";
import ManageUsers from "./components/admin/adminMangeUser/ManageUser.jsx";
import ChatbotsManage from "./components/admin/chatbotsMange/ChatbotsManage.jsx";
import ChatbotsActive from "./components/admin/chatbotsMange/chatbotsActive/ChatbotsActive.jsx";
import ChatbotsAdd from "./components/admin/chatbotsMange/chatbotsAdd/ChatbotsAdd.jsx";
import VerifyAccount from "./routes/signUpPage/VerifyAccount.jsx";
import VerifyPage from "./routes/signUpPage/VerifyPage.jsx";
import PublicLayout from "./layouts/publicLayout/PublicLayout.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Homepage /> },
      {
        path: "/sign-in",
        element: (
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        ),
      },
      {
        path: "/sign-up",
        element: (
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        ),
      },
      { path: "/verify/:token", element: <VerifyPage /> },
      { path: "/verify", element: <VerifyAccount /> },
    ],
  },
  {
    element: (
      <PrivateRoute>
        <RootLayout />
      </PrivateRoute>
    ),
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/chats/:id", element: <ChatPage /> },
        ],
      },
    ],
  },

  {
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
    children: [
      { path: "/admin", element: <AdminOverview /> },
      { path: "/admin/users", element: <ManageUsers /> },
      {
        path: "/admin/chatbots",
        element: <ChatbotsManage />,
        children: [
          { index: true, element: <ChatbotsActive /> },
          { path: "active", element: <ChatbotsActive /> },
          { path: "add", element: <ChatbotsAdd /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </AuthProvider>
);
