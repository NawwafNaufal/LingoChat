import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState, useEffect } from "react";
import UserProfilePopup from "./skeletons/PopUpPorfile";

const ChatHeader = ({ onLangChange }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  // Load language preferences from localStorage or use defaults
  const [sourceLang, setSourceLang] = useState(() => {
    return localStorage.getItem("chatSourceLang") || "English";
  });
  
  const [targetLang, setTargetLang] = useState(() => {
    return localStorage.getItem("chatTargetLang") || "Indonesia";
  });

  // Initialize language settings on component mount
  useEffect(() => {
    onLangChange?.(sourceLang, targetLang);
  }, [onLangChange, sourceLang, targetLang]);

  const handleSourceLangChange = (e) => {
    const newSource = e.target.value;
    setSourceLang(newSource);
    localStorage.setItem("chatSourceLang", newSource);
    onLangChange?.(newSource, targetLang);
  };

  const handleTargetLangChange = (e) => {
    const newTarget = e.target.value;
    setTargetLang(newTarget);
    localStorage.setItem("chatTargetLang", newTarget);
    onLangChange?.(sourceLang, newTarget);
  };

  const toggleUserProfile = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setShowUserProfile(!showUserProfile);
  };

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Kiri: Avatar + Nama */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={toggleUserProfile} // Tautan untuk memicu popup
          role="button"
          tabIndex="0"
        >
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Kanan: Dropdown Bahasa + Tombol Close */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1 text-sm text-white">
            <select
              value={sourceLang}
              onChange={handleSourceLangChange}
              className="bg-[#111111]  text-white px-1 outline-none"
            >
              <option>English</option>
              <option>Indonesia</option>
              <option>Spanish</option>
            </select>
            <span className="mx-1">⇄</span>
            <select
              value={targetLang}
              onChange={handleTargetLangChange}
              className="bg-[#111111] text-white px-1 outline-none"
            >
              <option>English</option>
              <option>Indonesia</option>
              <option>Spanish</option>
            </select>
          </div>

          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>

      {/* Popup User Profile */}
      {showUserProfile && (
        <UserProfilePopup
          userId={selectedUser._id}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;