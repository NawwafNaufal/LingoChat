import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

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
    type: "success", 
    message: ""
  });
  
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);
  
  useEffect(() => {
    const storedEmail = localStorage.getItem("verificationEmail");
    
    const stateEmail = location.state?.email;
    
    if (storedEmail) {
      setEmail(storedEmail);
      console.log("Email diambil dari localStorage:", storedEmail);
    } else if (stateEmail) {
      setEmail(stateEmail);
      console.log("Email diambil dari state:", stateEmail);
    } else {
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

    if (duration) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, duration);
    }
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

    const otpString = otp.join('');
    console.log("Mengirim verifikasi OTP:", { email, otp: otpString });

    try {
      const response = await axios.post('http://192.168.0.103:4000/passwordAuth/validateOtp', {
        email: email,
        otp: otpString
      }, {
        withCredentials: false, 
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Verifikasi berhasil:", response.data);
      
      showNotification("success", t("OTP verification successful!"));
      
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
      
      const errorMessage = error.response?.data?.message || 
                         t("Invalid OTP code. Please check and try again.");
      
      showNotification("error", errorMessage);
      
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
      const response = await axios.post('http://192.168.139.28:4000/passwordAuth/newOtp', {
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
    <div className="h-screen flex justify-center items-center bg-white text-black">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <span className="text-4xl font-bold text-[#1AA3D8]">N-G</span>
      </div>

      {notification.show && (
        <div className={`fixed top-4 right-4 ${getNotificationColor()} text-black px-4 py-2 rounded-md flex items-center gap-2 shadow-lg animate-fadeIn`}>
          {getNotificationIcon()}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Form */}
      <div className="w-full max-w-lg p-6 sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">{t("Verify your email address")}</h1>
          <p className="text-black text-sm mt-2">
            {t("Please enter the 5-digit code we sent to")}<br />
            <span className="text-black">{email}</span>
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
                className="input input-bordered w-12 h-12 text-center rounded-md shadow-md text-xl bg-transparent focus:outline-none focus:border-[#0088CC] border-gray-300"
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
              className="btn w-80 bg-[#1AA3D8] rounded-md hover:bg-[#0088CC] border-none mt-1 text-white disabled:text-white disabled:opacity-100 disabled:bg-[#1AA3D8]"
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
        </form>
        <div className="text-center text-gray-600 mt-1">
          {t("Need to change your email?")}{" "}
          <Link to="/verifEmail" className="text-blue-400 hover:underline">
            {t("Return to sign-up")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;