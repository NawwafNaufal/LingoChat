import { useState } from 'react';
import { X, User, Lock, Languages, ChevronDown, ChevronUp } from 'lucide-react';
import PasswordChangePopup from './ChangePassword';

export default function SettingsPopup({ isOpen, onClose, user }) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);

  if (!isOpen) return null;

  // Default user data if not provided
  const userData = user || {
    name: "Naufal",
    email: "Naufal23@gmail.com",
    status: "This is Away",
    profilePic: null
  };

  const toggleLanguageDropdown = () => {
    setLanguageOpen(!languageOpen);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setLanguageOpen(false);
  };

  const openPasswordChange = () => {
    setIsPasswordChangeOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="bg-black w-80 max-w-md rounded-lg shadow-lg overflow-hidden border border-gray-800">
          {/* Header with title and close button */}
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
              ) : null}
            </div>
            <div>
              <div className="font-medium text-white text-lg">{userData.name}</div>
              <div className="text-sm text-gray-400">{userData.email}</div>
              <div className="text-sm text-gray-400">{userData.status}</div>
            </div>
          </div>

          {/* Full-width Divider */}
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
            
            {/* Language selector with dropdown */}
            <div className="w-full">
              <button 
                onClick={toggleLanguageDropdown}
                className="w-full text-left px-5 py-4 text-white hover:bg-gray-800 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Languages className="w-5 h-5 mr-3 text-gray-400" />
                  Language
                </div>
                {languageOpen ? 
                  <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>
              
              {/* Language dropdown */}
              {languageOpen && (
                <div className="bg-gray-900 w-full border-t border-b border-gray-800">
                  <button 
                    onClick={() => selectLanguage("English")}
                    className={`w-full text-left pl-12 py-3 ${selectedLanguage === "English" ? "text-blue-400" : "text-gray-300"} hover:bg-gray-800 transition-colors`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => selectLanguage("Indonesian")}
                    className={`w-full text-left pl-12 py-3 ${selectedLanguage === "Indonesian" ? "text-blue-400" : "text-gray-300"} hover:bg-gray-800 transition-colors`}
                  >
                    Indonesian
                  </button>
                  <button 
                    onClick={() => selectLanguage("Spanish")}
                    className={`w-full text-left pl-12 py-3 ${selectedLanguage === "Spanish" ? "text-blue-400" : "text-gray-300"} hover:bg-gray-800 transition-colors`}
                  >
                    Spanish
                  </button>
                </div>
              )}
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