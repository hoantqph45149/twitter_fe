import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import SidebarOnlyLayout from "./layouts/SidebarOnlyLayout";

import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./contexts/AuthContext";
import { useConversationContext } from "./contexts/ConversationContext";
import { useSocketContext } from "./contexts/SocketContext";
import useConversationListener from "./hooks/useConversationListener";
import useSocketMessageListener from "./hooks/useSocketMessageListener";
import MessagePage from "./pages/message/MessagePage";

function App() {
  const { authUser } = useAuthContext();
  const { selectedConversationId, setSelectedConversationId } =
    useConversationContext();

  const { socket } = useSocketContext();
  const queryClient = useQueryClient();

  useSocketMessageListener({
    socket,
    authUser,
    queryClient,
    selectedConversationId,
  });

  useConversationListener({
    socket,
    queryClient,
    selectedConversationId,
    setSelectedConversationId,
  });

  return (
    <>
      <Routes>
        {/* Layout có Sidebar + RightPanel */}
        {authUser && (
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Route>
        )}

        {/* Layout chỉ có Sidebar */}
        {authUser && (
          <Route element={<SidebarOnlyLayout />}>
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/messages" element={<MessagePage />} />
          </Route>
        )}

        {/* Layout không có gì (auth pages) */}
        {!authUser && (
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
        )}

        <Route
          path="*"
          element={<Navigate to={authUser ? "/" : "/login"} replace />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
