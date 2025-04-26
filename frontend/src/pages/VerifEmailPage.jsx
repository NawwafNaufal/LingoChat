import { useTranslation } from "react-i18next";
import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, CheckCircle } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
//   const { login } = useAuthStore();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoggingIn(false);
      
      // Show notification
      setShowNotification(true);
      
      // Store email in localStorage or context for the verification page
      localStorage.setItem("verificationEmail", formData.email);
      
      // Navigate to the OTP verification page after showing notification
      setTimeout(() => {
        // Using the correct route path from your App.js
        navigate("/otp");
      }, 2000); // Wait 2 seconds before navigating
    }, 1000);
  };

  const handleLangChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black text-white">
      {/* Header with logo and language selector */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        {/* N-G Logo at left corner */}
        <div className="font-bold text-xl">N-G</div>
        
        {/* Dropdown Bahasa at right corner */}
        <select
          value={i18n.language}
          onChange={handleLangChange}
          className="select select-bordered select-sm bg-transparent border-gray-700"
        >
          <option value="en">English</option>
          <option value="id">Indonesia</option>
          <option value="es">Spanish</option>
        </select>
      </div>
      
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle className="h-5 w-5" />
          <span>{t("OTP code has been sent to your email")}</span>
        </div>
      )}
      
      {/* Centered Form Container */}
      <div className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-8">
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <div>
              <h1 className="text-4xl font-bold text-white">{t("Forgot Password?")}</h1>
              <p className="text-gray-400 text-sm">{t("No worries, we'll send you reset instructions.")}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">{t("email")}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-10 bg-transparent border-gray-700"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn w-full bg-gray-700 hover:bg-gray-600 border-none text-white" 
            disabled={isLoggingIn || !formData.email}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("Sending...")}
              </>
            ) : (
              t("Reset Password")
            )}
          </button>
        </form>

        {/* Bottom Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            {t("Remember password?")}{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              {t("Back to login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;