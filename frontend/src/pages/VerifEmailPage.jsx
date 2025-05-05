import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setShowNotification(false);

    try {
      const res = await axios.post("http://localhost:4000/passwordAuth/emailVerif", {
        email: formData.email
      });
      
      if (res.data.status === "error") {
        setShowNotification(true);
        alert(t("Email not found, please try again.")); 
      } else {
        console.log(res.data); 
  
        setShowNotification(true);
  
        localStorage.setItem("verificationEmail", formData.email);
  
        setTimeout(() => {
          navigate("/otp");
        }, 2000);
      }

      setTimeout(() => {
        navigate("/otp");
        
      }, 2000);
    } catch (error) {
      console.error("Gagal mengirim email:", error);
      alert("Gagal mengirim email, coba lagi.");
    } finally {
      setIsLoggingIn(false);
    }
  };


  return (
    <div className="h-screen flex justify-center items-center bg-white text-black">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
      <span className="text-4xl font-bold text-[#1AA3D8]">N-G</span>
      </div>

      {/* Notifikasi Sukses */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle className="h-5 w-5" />
          <span>{t("OTP code has been sent to your email")}</span>
        </div>
      )}

      {/* Form */}
      <div className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-8">
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <div>
              <h1 className="text-4xl font-bold text-black">{t("Forget Password?")}</h1>
              <p className="text-black text-sm">{t("No worries, we'll send you reset instructions.")}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text text-black font-medium">{t("email")}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-black" />
              </div>
              <input
                type="email"
                 className="input input-bordered w-full rounded-md pl-10  shadow-md border-gray-200 focus:outline-none focus:border-[#0088CC] bg-transparent"
                placeholder="Your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn w-full bg-[#1AA3D8] rounded-md hover:bg-[#0088CC] border-none mt-6 text-white disabled:text-white disabled:opacity-100 disabled:bg-[#1AA3D8]"
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

        <div className="text-center">
          <p className="text-gray-600">
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