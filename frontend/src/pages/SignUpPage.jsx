import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const { signup, isSigningUp } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    // Add click outside handler to close language menu
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

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    
    const langMapping = {
      "en": "English",
      "id": "Indonesian",
      "es": "Spanish"
    };
    
    // Also save the display name for the settings component
    localStorage.setItem("selectedLanguage", langMapping[lang]);
    setShowLanguageMenu(false);
  };

  // Helper function to get language name
  const getLanguageName = (code) => {
    const languages = {
      "en": "English",
      "id": "Indonesia",
      "es": "Español"
    };
    return languages[code] || code;
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error(t("fullname_required"));
    if (!formData.email.trim()) return toast.error(t("email_required"));
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error(t("invalid_email"));
    if (!formData.password) return toast.error(t("password_required"));
    if (formData.password.length < 6) return toast.error(t("password_min_length"));

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) {
      try {
        // Don't store auth user after signup
        await signup(formData, false);
        
        toast.success(t("Registration successful! Please login."));
        
        // Navigate to login page
        navigate("/login");
      } catch (error) {
        console.error("Signup error:", error);
      }
    }
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
      
      {/* Centered content */}
      <div className="w-full max-w-md p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-4xl font-bold text-black">{t("Create Your Account")}</h1>
              <p className="text-black text-sm mb-6">{t("Sign up to start your journey with N-G .")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-black">{t("Username")}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40 text-black"/>
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full rounded-md pl-10  shadow-md border-gray-200 focus:outline-none focus:border-[#0088CC] bg-transparent"
                  placeholder={t("Username")}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-black">{t("email")}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40 text-black" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full rounded-md pl-10  shadow-md border-gray-200 focus:outline-none focus:border-[#0088CC] bg-transparent"
                  placeholder={t("Email")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-black">{t("password")}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40 text-black"  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full rounded-md pl-10  shadow-md border-gray-200 focus:outline-none focus:border-[#0088CC] bg-transparent"
                  placeholder={t("Password")}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-[#1AA3D8]" /> : <Eye className="h-5 w-5 text-[#1AA3D8]" />}
                </button>
              </div>
            </div>
            <div className="h-1" />
            <button type="submit" className="btn w-full bg-[#1AA3D8] rounded-md hover:bg-[#0088CC] border-none mt-6 text-white" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  {t("loading")}
                </>
              ) : (
                t("Sign Up")
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              {t("Already have an account?")}{" "}
              <Link to="/login" className="link text-blue-400">
                {t("Log In")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;