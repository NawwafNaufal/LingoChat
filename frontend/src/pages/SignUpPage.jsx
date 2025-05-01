import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLangChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
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
    <div className="h-screen flex justify-center items-center bg-black text-white">
      {/* N-G text in top-left */}
      <div className="absolute top-0 left-0 p-4">
        <span className="text-3xl font-bold">N-G</span>
      </div>
      
      {/* Language selector moved to top-right */}
      <div className="absolute top-0 right-0 p-4">
        <select
          value={i18n.language}
          onChange={handleLangChange}
          className="select select-bordered bg-[#111111]text-white select-sm rounded-md border-gray-700"
        >
          <option value="en">English</option>
          <option value="id">Indonesia</option>
          <option value="es">Spanish</option>
        </select>
      </div>
      
      {/* Centered content */}
      <div className="w-full max-w-md p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-4xl font-bold text-white">{t("Create Your Account")}</h1>
              <p className="text-gray-400 text-sm mb-6">{t("Sign up to start your journey with N-G .")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">{t("Username")}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full rounded-md pl-10 bg-transparent border-gray-7000"
                  placeholder={t("Username")}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">{t("email")}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full rounded-md pl-10 bg-transparent border-gray-7000"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium">{t("password")}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full rounded-md pl-10 bg-transparent border-gray-7000"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <div className="h-1" />
            <button type="submit" className="btn w-full bg-[#111111] rounded-md hover:bg-[#222222] border-none mt-6 text-white" disabled={isSigningUp}>
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
            <p className="text-base-content/60">
              {t("Already have an account?")}{" "}
              <Link to="/login" className="link link-primary">
                {t("Log in")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;