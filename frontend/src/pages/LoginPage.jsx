import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, Globe } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { login, isLoggingIn, setAuthUser, connectSocket } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');

    if (token && email) {
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);

      setAuthUser({
        data: {
          email,
          token,
        }
      });

      connectSocket();

      toast.success("Logged in successfully with Google");

      window.history.replaceState({}, document.title, window.location.pathname);

      navigate('/user');
    }
  }, [navigate, setAuthUser, connectSocket, i18n]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageMenu && !event.target.closest('.language-selector')) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showLanguageMenu]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    
    const langMapping = {
      "en": "English",
      "id": "Indonesian",
      "es": "Spanish"
    };
    
    localStorage.setItem("selectedLanguage", langMapping[lang]);
    setShowLanguageMenu(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://192.168.139.28:4000/auth/google";
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://192.168.139.28:4000/auth/github";
  };

  const getLanguageName = (code) => {
    const languages = {
      "en": "English",
      "id": "Indonesia",
      "es": "Español"
    };
    return languages[code] || code;
  };

  return (
    <div className="h-screen flex justify-center items-center bg-white text-black">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <span className="text-4xl font-bold text-[#1AA3D8]">N-G</span>
        
        {/* New Language Selector */}
        <div className="language-selector relative mr-6">
          <button 
            className="flex items-center gap-2 text-[#1AA3D8] hover:text-bg-[#0088CC] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowLanguageMenu(!showLanguageMenu);
            }}
          >
            <Globe className="h-5 w-5" />
            <span className="text-sm">{getLanguageName(i18n.language)}</span>
          </button>
          
          {showLanguageMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1AA3D8] rounded-md shadow-lg py-1 z-10 mr-2">
              <button 
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#0088CC] ${i18n.language === 'en' ? 'text-white' : 'text-white'}`}
                onClick={() => handleLangChange('en')}
              >
                English
              </button>
              <button 
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#0088CC] ${i18n.language === 'id' ? 'text-white' : 'text-white'}`}
                onClick={() => handleLangChange('id')}
              >
                Indonesia
              </button>
              <button 
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#0088CC] ${i18n.language === 'es' ? 'text-white' : 'text-white'}`}
                onClick={() => handleLangChange('es')}
              >
                Español
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Form */}
      <div className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-4">
          <h1 className="text-4xl font-bold">{t("Welcome")}</h1>
          <p className="text-black text-sm">{t("Log in to N-3 to continue to N-3.")}</p>
        </div>

        {/* OAuth Buttons */}
        <div className="mb-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
             className="w-full flex items-center justify-center shadow-md gap-3 border border-gray-200 hover:border-[#0088CC] px-4 py-2 rounded-md bg-transparent text-black transition"
          >
            <img src="/google.png" alt="Google Logo" className="h-7 w-7" />
            <span className="text-sm font-medium">{t("Log In With Google")}</span>
          </button>
        </div>
        <div className="mb-6">
          <button
            type="button" 
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center shadow-md gap-3 border border-gray-200 hover:border-[#0088CC] px-4 py-2 rounded-md bg-transparent text-black transition"
          >
            <img src="/irengG.png" alt="GitHub Logo" className="h-6 w-6" />
            <span className="text-sm font-medium">{t("Log In With GitHub")}</span>
          </button>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center mb-2">
          <div className="border-t border-gray-700 w-full"></div>
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="border-t border-gray-700 w-full"></div>
        </div>
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          {/* Email Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text  text-black font-medium">{t("email")}</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black h-5 w-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t("Your email address")}
                className="input input-bordered w-full rounded-md pl-10  shadow-md border-gray-200 focus:outline-none focus:border-[#0088CC] bg-transparent"
              />
            </div>
          </div>
          {/* Password Input */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-black font-medium">{t("password")}</span>
              <Link to="/verifEmail" className="link label-text text-black font-medium">
                {t("Forget Password?")}
              </Link>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black  h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={t("Your Password")}
                className="input input-bordered w-full rounded-md pl-10  shadow-md border-gray-200 focus:outline-none focus:border-[#0088CC] bg-transparent"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-[#1AA3D8]" /> : <Eye className="h-5 w-5 text-[#1AA3D8]" />}
              </button>
            </div>
          </div>
          <div className="h-1" />
          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-full bg-[#1AA3D8] rounded-md hover:bg-[#0088CC] disabled:bg-[#1AA3D8] border-none mt-6 text-white"
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
          <p className="text-gray-600">
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