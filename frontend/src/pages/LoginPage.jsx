import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn, setAuthUser, connectSocket } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Check if language is already set in localStorage
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');

    if (token && email) {
      // Simpan ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);

      // Set auth data ke store
      setAuthUser({
        data: {
          email,
          token,
        }
      });

      // Connect socket kalau ada
      connectSocket();

      // Tampilkan notifikasi sukses
      toast.success("Logged in successfully with Google");

      // Bersihkan URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Redirect ke dashboard
      navigate('/user');
    }
  }, [navigate, setAuthUser, connectSocket, i18n]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleLangChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    
    localStorage.setItem("lang", lang);
    
    const langMapping = {
      "en": "English",
      "id": "Indonesian",
      "es": "Spanish"
    };
    
    // Also save the display name for the settings component
    localStorage.setItem("selectedLanguage", langMapping[lang]);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:4000/auth/github";
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <span className="text-3xl font-bold">N-G</span>
        <select
          value={i18n.language}
          onChange={handleLangChange}
          className="select select-bordered bg-[#111111] text-white select-sm rounded-md border-gray-700"
        >
          <option value="en">English</option>
          <option value="id">Indonesia</option>
          <option value="es">Spanish</option>
        </select>
      </div>

      {/* Main Form */}
      <div className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{t("Welcome")}</h1>
          <p className="text-gray-400 text-sm">{t("Log in to N-3 to continue to N-3.")}</p>
        </div>

        {/* OAuth Buttons */}
        <div className="mb-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-md bg-transparent text-white transition"
          >
            <img src="/google.png" alt="Google Logo" className="h-7 w-7" />
            <span className="text-sm font-medium">Log In With Google</span>
          </button>
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-md bg-transparent text-white transition"
          >
            <img src="/github.png" alt="GitHub Logo" className="h-6 w-6" />
            <span className="text-sm font-medium">Log In With GitHub</span>
          </button>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center my-4">
          <div className="border-t border-gray-700 w-full"></div>
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="border-t border-gray-700 w-full"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email Input */}
          <div className="form-control mb-2 ">
            <label className="label">
              <span className="label-text  text-gray-300 font-medium">{t("email")}</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Your email address"
                className="input input-bordered w-full rounded-md pl-10 bg-transparent border-gray-700"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">{t("password")}</span>
              <Link to="/verifEmail" className="link label-text text-gray-300 font-medium">
                {t("Forget Password?")}
              </Link>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Your Password"
                className="input input-bordered w-full rounded-md pl-10 bg-transparent border-gray-700"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>
          <div className="h-1" />
          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-full bg-[#111111] rounded-md hover:bg-[#222222] border-none mt-6 text-white"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("loading")}
              </>
            ) : (
              t("Log In")
            )}
          </button>
        </form>

        {/* Sign up Link */}
        <div className="text-center ">
          <p className="text-gray-400">
            {t("Don't have an account?")}{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              {t("Sign up")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;