import { useState, useEffect } from 'react';
import { X, User, Lock, Languages, AlertTriangle } from 'lucide-react';
import PasswordChangePopup from './ChangePassword';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';


export default function SettingsPopup({ isOpen, onClose }) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [showProviderMessage, setShowProviderMessage] = useState(false);
  
  const { authUser } = useAuthStore();
  const { t, i18n } = useTranslation();

  const languageMapping = {
    "English": "en",
    "Indonesian": "id",
    "Spanish": "es",
    "en": "English",
    "id": "Indonesian",
    "es": "Spanish"
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    
    if (savedLang) {
      setSelectedLanguage(languageMapping[savedLang] || "English");
    } else {
      const savedDisplayLanguage = localStorage.getItem('selectedLanguage');
      if (savedDisplayLanguage) {
        setSelectedLanguage(savedDisplayLanguage);
      }
    }
  }, []);

  useEffect(() => {
      const savedLang = localStorage.getItem("lang");
      if (savedLang) {
        i18n.changeLanguage(savedLang);
      }
    }, [i18n]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    
    localStorage.setItem('selectedLanguage', language);
    
    const langCode = languageMapping[language];
    if (langCode) {
      i18n.changeLanguage(langCode);
      localStorage.setItem('lang', langCode);
    }
  };

  if (!isOpen) return null;

  const handlePasswordChangeClick = () => {
    if (authUser && (authUser.provider === 'google' || authUser.provider === 'github')) {
      setShowProviderMessage(true);
      setTimeout(() => {
        setShowProviderMessage(false);
      }, 3000); 
    } else {
      setIsPasswordChangeOpen(true);
    }
  };

  if (!authUser) {
    return null;
  }

  const userData = {
    name: authUser.fullName || authUser.name || "",
    email: authUser.email || "",
    status: authUser.description || authUser.status || "This is Away",
    profilePic: authUser.profilePic || null,
    provider: authUser.provider || "local"
  };

  const getProviderName = (provider) => {
    switch(provider) {
      case 'google': return 'Google';
      case 'github': return 'GitHub';
      case 'facebook': return 'Facebook';
      default: return 'Email';
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#fff] w-80 max-w-md rounded-lg shadow-lg overflow-hidden ">

          {/* Header */}
          <div className="flex justify-between items-center p-5 pb-6">
            <h2 className="text-xl font-medium text-black">{t("Settings")}</h2>
            <button onClick={onClose} className="text-black hover:text-black">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="px-5 pb-6 flex items-center">
            <div className="h-16 w-16 rounded-full bg-white flex-shrink-0 mr-4">
              {userData.profilePic ? (
                <img 
                  src={userData.profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-2xl rounded-full">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-black text-lg">{userData.name}</div>
              <div className="text-sm text-black">{userData.email}</div>
              <div className="text-sm text-black">{userData.status}</div>
              {userData.provider !== 'local' && (
                <div className="text-xs text-gray-500 mt-1">
                  {t('Signed in with')} {getProviderName(userData.provider)}
                </div>
              )}
            </div>
          </div>

          {/* Provider message */}
          {showProviderMessage && (
            <div className="mx-5 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700">
                {t('Password change is not available for')} {getProviderName(userData.provider)} {t('accounts')}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 w-full mt-2"></div>

          {/* Menu Items */}
          <div className="py-2">
            <button className="w-full text-left px-5 py-4 text-black hover:bg-[#e9e9e9] transition-colors flex items-center">
              <User className="w-5 h-5 mr-3 text-black" />
              {t('My Account')}
            </button>

            <button 
              onClick={handlePasswordChangeClick}
              className={`w-full text-left px-5 py-4 flex items-center ${
                userData.provider === 'google' || userData.provider === 'github' 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-black hover:bg-[#e9e9e9] transition-colors'
              }`}
            >
              <Lock className={`w-5 h-5 mr-3 ${
                userData.provider === 'google' || userData.provider === 'github' 
                  ? 'text-gray-400' 
                  : 'text-black'
              }`} />
              {t('Change Password')}
              {(userData.provider === 'google' || userData.provider === 'github') && (
                <span className="ml-auto text-xs text-gray-400">{t('Not available')}</span>
              )}
            </button>

            {/* Language Selector */}
            <div className="w-full">
              <div className="px-5 py-4 text-black flex items-center">
                <Languages className="w-5 h-5 mr-3 text-black" />
                {t('Language')}
              </div>

              <div className="bg-[#fff] w-full border-t border-b border-gray-200">
                <button 
                  onClick={() => handleLanguageSelect("English")}
                  className={`w-full text-left pl-12 py-3 ${selectedLanguage === "English" ? "text-black" : "text-gray-600"} hover:bg-[#e9e9e9] transition-colors`}
                >
                  English
                </button>
                <button 
                  onClick={() => handleLanguageSelect("Indonesian")}
                  className={`w-full text-left pl-12 py-3 ${selectedLanguage === "Indonesian" ? "text-black" : "text-gray-600"} hover:bg-[#e9e9e9] transition-colors`}
                >
                  Indonesian
                </button>
                <button 
                  onClick={() => handleLanguageSelect("Spanish")}
                  className={`w-full text-left pl-12 py-3 ${selectedLanguage === "Spanish" ? "text-black" : "text-gray-600"} hover:bg-[#e9e9e9] transition-colors`}
                >
                  Spanish
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-black text-sm text-center">
            By Naufal
          </div>
        </div>
      </div>

      {/* Password Change Popup - Only show for local accounts */}
      {authUser && authUser.provider === 'local' ? (
        <PasswordChangePopup 
          isOpen={isPasswordChangeOpen} 
          onClose={() => setIsPasswordChangeOpen(false)} 
        />
      ) : null}
    </>
  );
}