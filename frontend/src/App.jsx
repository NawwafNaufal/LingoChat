import Layout from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import AllChats from "./pages/SearchPage"
import VerifEmail from "./pages/VerifEmailPage"
import OtpPage from "./pages/OtpPage"
import Password from "./pages/PasswordPage"

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";



const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Routes>
        {/* Authentication pages without Layout/Sidebar */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/User" />} />
        <Route path="/verifEmail" element={!authUser ? <VerifEmail /> : <Navigate to="/User" />} />
        <Route path="/otp" element={!authUser ? <OtpPage /> : <Navigate to="/password" />} />
        <Route path="/password" element={!authUser ? <Password /> : <Navigate to="/User" />} />
        
        {/* Protected routes with Layout/Sidebar */}
        <Route path="/" element={
          authUser ? (
            <Layout>
              <AllChats />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/User" element={
          authUser ? (
            <Layout>
              <HomePage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/settings" element={
          <Layout>
            <SettingsPage />
          </Layout>
        } />
        <Route path="/verifEmail" element={
          <Layout>
            <VerifEmail />
          </Layout>
        } />
        <Route path="/otp" element={
          <Layout>
            <OtpPage />
          </Layout>
        } />
        <Route path="/password" element={
          <Layout>
            <Password />
          </Layout>
        } />
        <Route path="/profile" element={
          authUser ? (
            <Layout>
              <ProfilePage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;