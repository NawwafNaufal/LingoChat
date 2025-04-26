import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail} from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const { t, i18n } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
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
      
      {/* Centered Form Container */}
      <div className="w-full max-w-md p-6 sm:p-8">
      <div className="mb-8">
  <div className="flex items-center gap-3">
    <div>
      <h1 className="text-4xl font-bold text-white">{t("Welcome")}</h1>
      <p className="text-gray-400 text-sm">{t("Log in to N-3 to continue to N-3.")}</p>
    </div>
  </div>
</div>
{/* Google Login Button */}
<div className="mb-3">
  <button
    type="button"
    className="w-full flex items-center justify-center gap-3 border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-md bg-transparent text-white transition"
    onClick={() => {
      console.log("Google login clicked");
    }}
  >
    <img src="/google.png" alt="Google Logo" className="h-7 w-7"/>
    <span className="text-sm font-medium">Log In With Google</span>
  </button>
</div>

{/* GitHub Login Button */}
<div className="mb-6">
  <button
    type="button"
    className="w-full flex items-center justify-center gap-3 border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-md bg-transparent text-white transition"
    onClick={() => {
      console.log("GitHub login clicked");
    }}
  >
    <img src="/github.png" alt="Google Logo" className="h-6 w-6"/>
    <span className="text-sm font-medium">Log In With GitHub</span>
  </button>
</div>

{/* OR separator */}
<div className="flex items-center justify-center my-4">
  <div className="border-t border-gray-700 w-full"></div>
  <span className="mx-3 text-gray-500 text-sm">OR</span>
  <div className="border-t border-gray-700 w-full"></div>
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
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">{t("password")}</span>
              <Link to="/verifEmail" className="link label-text text-gray-300 font-medium">
                              {t("Forget Password?")}
                            </Link>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10 bg-transparent border-gray-700"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn w-full bg-gray-700 hover:bg-gray-600 border-none text-white" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("loading")}
              </>
            ) : (
              t("sign_in")
            )}
          </button>
        </form>

        {/* Bottom Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            {t("no_account")}{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              {t("create_account")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;