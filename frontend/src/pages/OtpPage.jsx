import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Konfigurasi axios global untuk CORS
axios.defaults.headers.common['Content-Type'] = 'application/json';

const EmailVerificationPage = () => {
  const { t, i18n } = useTranslation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [email, setEmail] = useState("");
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();
  const location = useLocation();
  
  const [notification, setNotification] = useState({
    show: false,
    type: "success", // success, error, warning
    message: ""
  });
  
  // Ambil email saat komponen dipasang
  useEffect(() => {
    // Coba ambil dari localStorage terlebih dahulu
    const storedEmail = localStorage.getItem("verificationEmail");
    
    // Coba ambil dari state
    const stateEmail = location.state?.email;
    
    // Prioritaskan yang tersedia
    if (storedEmail) {
      setEmail(storedEmail);
      console.log("Email diambil dari localStorage:", storedEmail);
    } else if (stateEmail) {
      setEmail(stateEmail);
      console.log("Email diambil dari state:", stateEmail);
    } else {
      // Jika tidak ada, arahkan kembali ke halaman forgot password
      showNotification("error", t("Email not found. Please try again from the beginning."));
      setTimeout(() => {
        navigate("/forgot-password");
      }, 2000);
    }
  }, [location.state, navigate, t]);
  
  const showNotification = (type, message, duration = 3000) => {
    setNotification({
      show: true,
      type,
      message
    });

    // Sembunyikan notifikasi setelah durasi tertentu
    if (duration) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, duration);
    }
  };
  
  const handleLangChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };
  
  const handleOtpChange = (index, value) => {
    if (value === '' || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < 4) {
        inputRefs[index + 1].current.focus();
      }
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);

    // Gabung array otp jadi string
    const otpString = otp.join('');
    console.log("Mengirim verifikasi OTP:", { email, otp: otpString });

    try {
      // Pastikan format request body sesuai dengan backend
      const response = await axios.post('http://localhost:4000/passwordAuth/validateOtp', {
        email: email,
        otp: otpString
      }, {
        // Tambahkan konfigurasi tambahan untuk CORS jika perlu
        withCredentials: false, // Set true jika perlu kirim cookie
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Verifikasi berhasil:", response.data);
      
      // Tampilkan notifikasi sukses
      showNotification("success", t("OTP verification successful!"));
      
      // Kalau verifikasi sukses, redirect ke halaman reset password setelah delay
      setTimeout(() => {
        navigate("/password", { 
          state: { 
            email: email,
            verified: true 
          } 
        });
      }, 1500);
    } catch (error) {
      console.error("Gagal verifikasi OTP:", error);
      
      // Dapatkan pesan error dari response
      const errorMessage = error.response?.data?.message || 
                         t("Invalid OTP code. Please check and try again.");
      
      // Tampilkan notifikasi error
      showNotification("error", errorMessage);
      
      // Reset input OTP jika kode salah
      if (error.response?.status === 400 || error.response?.status === 401) {
        setOtp(['', '', '', '', '']);
        inputRefs[0].current.focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResendCode = async () => {
    try {
      const response = await axios.post('http://localhost:4000/passwordAuth/newOtp', {
        email
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Kode OTP baru dikirim:", response.data);
      showNotification("success", t("New OTP code has been sent to your email."));
    } catch (error) {
      console.error("Gagal kirim ulang OTP:", error);
      showNotification("error", error.response?.data?.message || t("Failed to resend OTP code."));
    }
  };
  
  // Mendapatkan komponen ikon yang sesuai dengan tipe notifikasi
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "warning":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  // Mendapatkan warna background yang sesuai dengan tipe notifikasi
  const getNotificationColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };
  
  return (
    <div className="h-screen flex justify-center items-center bg-black text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <div className="font-bold text-xl">N-G</div>
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

      {/* Notifikasi (Success, Error, atau Warning) */}
      {notification.show && (
        <div className={`fixed top-4 right-4 ${getNotificationColor()} text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg animate-fadeIn`}>
          {getNotificationIcon()}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Form */}
      <div className="w-full max-w-lg p-6 sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">{t("Verify your email address")}</h1>
          <p className="text-gray-400 text-sm mt-2">
            {t("Please enter the 5-digit code we sent to")}<br />
            <span className="text-white">{email}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="input input-bordered w-12 h-12 text-center text-xl bg-transparent border-gray-700"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {t("Didn't get OTP code?")}{" "}
              <button 
                type="button" 
                onClick={handleResendCode}
                className="text-blue-400 hover:underline"
              >
                {t("Resend Code")}
              </button>
            </p>
          </div>

          <div className="flex justify-center">
            <button 
              type="submit" 
              className="btn w-96 rounded-lg bg-gray-700 hover:bg-gray-600 border-none text-white" 
              disabled={isVerifying || otp.some(digit => digit === '')}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("Verifying...")}
                </>
              ) : (
                t("Continue")
              )}
            </button>
          </div>

          <div className="text-center">
            <Link to="/forgot-password" className="text-gray-400 hover:underline">
              {t("Back to Forgot Password")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerificationPage;