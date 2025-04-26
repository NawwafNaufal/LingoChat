import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";
const ChatHeader = ({ onLangChange }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Indonesia");

  const handleSourceLangChange = (e) => {
    const newSource = e.target.value;
    console.log("🚀 ~ handleSourceLangChange ~ newSource:", newSource)
    setSourceLang(newSource);
    onLangChange?.(newSource, targetLang);
  };

  const handleTargetLangChange = (e) => {
    const newTarget = e.target.value;
    console.log("🚀 ~ handleTargetLangChange ~ newTarget:", newTarget)
    setTargetLang(newTarget);
    onLangChange?.(sourceLang, newTarget);
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Kiri: Avatar + Nama */}
        <div className="flex items-center gap-3">
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
              className="bg-transparent text-white px-1 outline-none"
            >
              <option>English</option>
              <option>Indonesia</option>
              <option>Spanish</option>
            </select>
            <span className="mx-1">⇄</span>
            <select
              value={targetLang}
              onChange={handleTargetLangChange}
              className="bg-transparent text-white px-1 outline-none"
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
    </div>
  );
};


export default ChatHeader;
