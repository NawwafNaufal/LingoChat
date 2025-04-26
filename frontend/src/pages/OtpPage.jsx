import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const EmailVerificationPage = () => {
  const { t, i18n } = useTranslation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];
  const email = "Someone@gmail.com"; // This would come from your app state or route params
  const navigate = useNavigate();
  
  const handleLangChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };
  
  const handleOtpChange = (index, value) => {
    // Only allow numeric values
    if (value === '' || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input when a digit is entered
      if (value !== '' && index < 4) {
        inputRefs[index + 1].current.focus();
      }
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      // Navigate to password reset page after verification
      navigate("/password");
    }, 1500);
  };
  
  const handleResendCode = () => {
    // Logic to resend verification code
    alert("Resending verification code to " + email);
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
      
      {/* Centered Form Container */}
      <div className="w-full max-w-lg p-6 sm:p-8">
        <div className="mb-8">
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <div>
              <h1 className="text-4xl font-bold text-white">{t("Verify your email address")}</h1>
              <p className="text-gray-400 text-sm mt-2">
                {t("Please enter the 5-digit code we sent to")}
                <br />
                <span className="text-white">{email}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Fields */}
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
              />
            ))}
          </div>
          
          {/* Resend Code Text */}
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
          
          {/* Continue Button */}
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
          
          {/* Back Link */}
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