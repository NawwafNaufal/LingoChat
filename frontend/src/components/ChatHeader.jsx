import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState, useEffect } from "react";
import UserProfilePopup from "./skeletons/PopUpPorfile";

const ChatHeader = ({ onLangChange }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  const [sourceLang, setSourceLang] = useState(() => {
    return localStorage.getItem("chatSourceLang") || "English";
  });
  
  const [targetLang, setTargetLang] = useState(() => {
    return localStorage.getItem("chatTargetLang") || "Indonesia";
  });

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
    <div className="p-2.5 border border-[#e9e9e9] bg-[#Ffffff]">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer  "
          onClick={toggleUserProfile} 
          role="button"
          tabIndex="0"
        >
          <div className="avatar">
            <div className="size-10 rounded-full relative text-black">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-black">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70 text-black">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1 text-sm text-black">
            <select
              value={sourceLang}
              onChange={handleSourceLangChange}
              className="bg-[#fff]  text-black px-1 outline-none"
            >
              <option>English</option>
              <option>Indonesia</option>
              <option>Spanish</option>
            </select>
            <span className="mx-1">⇄</span>
            <select
              value={targetLang}
              onChange={handleTargetLangChange}
              className="bg-[#fff] text-black px-1 outline-none "
            >
              <option>English</option>
              <option>Indonesia</option>
              <option>Spanish</option>
            </select>
          </div>
          <button onClick={() => setSelectedUser(null)}>
            <X className="text-black"/>
          </button>
        </div>
      </div>
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