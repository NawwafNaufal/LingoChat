import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Lock, CheckCircle } from "lucide-react";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [isResetting, setIsResetting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsResetting(true);
    
    // Simulate password reset process
    setTimeout(() => {
      setIsResetting(false);
      
      // Show notification
      setShowNotification(true);
      
      // Navigate to login page after showing notification
      setTimeout(() => {
        navigate("/login");
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
        {/* N-3 Logo at left corner */}
        <div className="font-bold text-xl">N-3</div>
        
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
          <span>{t("Password has been reset successfully")}</span>
        </div>
      )}
      
      {/* Centered Form Container */}
      <div className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-8">
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <div>
              <h1 className="text-4xl font-bold text-white">{t("Set New Password")}</h1>
              <p className="text-gray-400 text-sm">{t("Password must be at least 8 characters")}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Password */}
          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">{t("Password")}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                className="input input-bordered w-full pl-10 bg-transparent border-gray-700"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">{t("Confirm Password")}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                className="input input-bordered w-full pl-10 bg-transparent border-gray-700"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={8}
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn w-full bg-gray-700 hover:bg-gray-600 border-none text-white" 
            disabled={isResetting || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
          >
            {isResetting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("Processing...")}
              </>
            ) : (
              t("Continue")
            )}
          </button>
        </form>

        {/* Bottom Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            <Link to="/forgot-password" className="text-blue-400 hover:underline">
              {t("Back to Forgot Password")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;