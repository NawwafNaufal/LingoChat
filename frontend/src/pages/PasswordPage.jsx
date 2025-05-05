import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2, Lock, CheckCircle } from "lucide-react";
import axios from "axios";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [isResetting, setIsResetting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();
  
  // Cek status verifikasi dan email saat komponen dipasang
  useEffect(() => {
    // Cek apakah ada email yang diteruskan dari halaman OTP
    const stateEmail = location.state?.email;
    const stateVerified = location.state?.verified;
    
    if (stateEmail) {
      setEmail(stateEmail);
      console.log("Email diterima dari state:", stateEmail);
      
      // Jika verified=true dalam state, user telah memverifikasi OTP
      if (stateVerified) {
        setIsVerified(true);
        console.log("Status verifikasi: Terverifikasi");
      } else {
        console.log("Status verifikasi: Belum terverifikasi");
      }
    } else {
      // Jika tidak ada email, cek dari localStorage
      const storedEmail = localStorage.getItem("verificationEmail");
      if (storedEmail) {
        setEmail(storedEmail);
        console.log("Email diambil dari localStorage:", storedEmail);
      } else {
        // Jika tidak ada email sama sekali, arahkan kembali ke forgot password
        console.log("Email tidak ditemukan, mengalihkan ke halaman forgot password");
        alert("Silakan masukkan email Anda terlebih dahulu.");
        navigate("/forgot-password");
      }
    }
  }, [location.state, navigate]);
  
  // Cek verifikasi (jika belum terverifikasi dan punya email)
  useEffect(() => {
    if (!isVerified && email) {
      console.log("Status belum terverifikasi, mengalihkan ke halaman OTP");
      navigate("/verify-email", { state: { email } });
    }
  }, [isVerified, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Password dan Confirm Password tidak sama");
      return;
    }

    if (!email) {
      alert("Email tidak ditemukan. Silakan ulangi proses reset password.");
      navigate("/forgot-password");
      return;
    }

    setIsResetting(true);

    try {
      // Sesuaikan endpoint sesuai dengan controller yang diberikan
      const response = await axios.patch(`http://localhost:4000/passwordAuth/changePassword/${email}`, {
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Reset password berhasil:", response.data);
      setShowNotification(true);

      // Hapus data verifikasi dari localStorage
      localStorage.removeItem("verificationEmail");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Reset password gagal:", error);
      alert(error.response?.data?.message || "Gagal reset password. Coba lagi nanti.");
    } finally {
      setIsResetting(false);
    }
  };


  return (
    <div className="h-screen flex justify-center items-center bg-white text-white">
      {/* Header with logo and language selector */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <div className="text-4xl font-bold text-[#1AA3D8]">N-3</div>
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
              <h1 className="text-4xl font-bold text-black">{t("Set New Password")}</h1>
              <p className="text-black text-sm mt-2">{t("For")} {email}</p>
              <p className="text-black text-sm">{t("Password must be at least 8 characters")}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Password */}
          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text text-black font-medium">{t("Password")}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-black" />
              </div>
              <input
                type="password"
                className="input input-bordered shadow-md w-full pl-10 rounded-md bg-transparent border-gray-200 focus:outline-none focus:border-[#0088CC]"
                placeholder={t("Enter new password")}
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
              <span className="label-text text-black font-medium">{t("Confirm Password")}</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-black" />
              </div>
              <input
                type="password"
                className="input input-bordered shadow-md w-full pl-10 rounded-md bg-transparent border-gray-200 focus:outline-none focus:border-[#0088CC]"
                placeholder={t("Confirm your password")}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={8}
              />
            </div>
          </div>
          <div className="h-1" />
          {/* Submit */}
          <button 
            type="submit" 
            className="btn w-full bg-[#1AA3D8] rounded-md hover:bg-[#0088CC] border-none mt-1 text-white disabled:text-white disabled:opacity-100 disabled:bg-[#1AA3D8]" 
            disabled={isResetting || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
          >
            {isResetting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("Processing...")}
              </>
            ) : (
              t("Reset Password")
            )}
          </button>
        </form>

        {/* Bottom Link */}
        <div className="text-center">
          <p className="text-gray-400">
            <Link to="/verifEmail" className="text-blue-400 hover:underline">
              {t("Back to Forgot Password")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;