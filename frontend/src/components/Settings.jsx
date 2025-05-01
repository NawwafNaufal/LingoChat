import { useState, useEffect } from 'react';
import { X, User, Lock, Languages } from 'lucide-react';
import PasswordChangePopup from './ChangePassword';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next'; // Import i18n

export default function SettingsPopup({ isOpen, onClose }) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  
  // Ambil authUser dari store
  const { authUser } = useAuthStore();
  // Get i18n functions
  const { i18n } = useTranslation();

  // Language mapping for consistency between i18n codes and display names
  const languageMapping = {
    "English": "en",
    "Indonesian": "id",
    "Spanish": "es",
    // Reverse mapping
    "en": "English",
    "id": "Indonesian",
    "es": "Spanish"
  };

  useEffect(() => {
    // Try to get language from localStorage first using the consistent key from login page
    const savedLang = localStorage.getItem('lang');
    
    if (savedLang) {
      // Convert i18n language code to display name
      setSelectedLanguage(languageMapping[savedLang] || "English");
    } else {
      // Fallback to the selectedLanguage in localStorage if exists
      const savedDisplayLanguage = localStorage.getItem('selectedLanguage');
      if (savedDisplayLanguage) {
        setSelectedLanguage(savedDisplayLanguage);
      }
    }
  }, []);

  const handleLanguageSelect = (language) => {
    // Update the displayed language
    setSelectedLanguage(language);
    
    // Save display language
    localStorage.setItem('selectedLanguage', language);
    
    // Also update i18n language using the consistent key
    const langCode = languageMapping[language];
    if (langCode) {
      i18n.changeLanguage(langCode);
      localStorage.setItem('lang', langCode);
    }
  };

  if (!isOpen) return null;

  const openPasswordChange = () => {
    setIsPasswordChangeOpen(true);
  };

  // Jika authUser belum tersedia, bisa tampilkan loading atau null
  if (!authUser) {
    return null;
  }

  // Extract user data yang dibutuhkan
  const userData = {
    name: authUser.fullName || authUser.name || "",
    email: authUser.email || "",
    status: authUser.description || authUser.status || "This is Away",
    profilePic: authUser.profilePic || null
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1c1c1c] w-80 max-w-md rounded-lg shadow-lg overflow-hidden border border-gray-800">

          {/* Header */}
          <div className="flex justify-between items-center p-5 pb-6">
            <h2 className="text-xl font-medium text-white">Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="px-5 pb-6 flex items-center">
            <div className="h-16 w-16 rounded-full bg-gray-300 flex-shrink-0 mr-4">
              {userData.profilePic ? (
                <img 
                  src={userData.profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-2xl">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-white text-lg">{userData.name}</div>
              <div className="text-sm text-gray-400">{userData.email}</div>
              <div className="text-sm text-gray-400">{userData.status}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 w-full mt-2"></div>

          {/* Menu Items */}
          <div className="py-2">
            <button className="w-full text-left px-5 py-4 text-white hover:bg-gray-800 transition-colors flex items-center">
              <User className="w-5 h-5 mr-3 text-gray-400" />
              My Account
            </button>

            <button 
              onClick={openPasswordChange}
              className="w-full text-left px-5 py-4 text-white hover:bg-gray-800 transition-colors flex items-center"
            >
              <Lock className="w-5 h-5 mr-3 text-gray-400" />
              Change Password
            </button>

            {/* Language Selector */}
            <div className="w-full">
              <div className="px-5 py-4 text-white flex items-center">
                <Languages className="w-5 h-5 mr-3 text-gray-400" />
                Language
              </div>

              <div className="bg-[#1c1c1c] w-full border-t border-b border-gray-800">
                <button 
                  onClick={() => handleLanguageSelect("English")}
                  className={`w-full text-left pl-12 py-3 ${selectedLanguage === "English" ? "text-blue-400" : "text-gray-300"} hover:bg-gray-800 transition-colors`}
                >
                  English
                </button>
                <button 
                  onClick={() => handleLanguageSelect("Indonesian")}
                  className={`w-full text-left pl-12 py-3 ${selectedLanguage === "Indonesian" ? "text-blue-400" : "text-gray-300"} hover:bg-gray-800 transition-colors`}
                >
                  Indonesian
                </button>
                <button 
                  onClick={() => handleLanguageSelect("Spanish")}
                  className={`w-full text-left pl-12 py-3 ${selectedLanguage === "Spanish" ? "text-blue-400" : "text-gray-300"} hover:bg-gray-800 transition-colors`}
                >
                  Spanish
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-gray-400 text-sm text-center">
            By Naufal
          </div>
        </div>
      </div>

      {/* Password Change Popup */}
      <PasswordChangePopup 
        isOpen={isPasswordChangeOpen} 
        onClose={() => setIsPasswordChangeOpen(false)} 
      />
    </>
  );
}