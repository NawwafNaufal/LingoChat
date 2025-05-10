import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const AllChat = () => {
  const { 
    getUsersAll, 
    users, 
    selectedUser, 
    setSelectedUser, 
    getMessages
  } = useChatStore();
  const { onlineUsers, socket } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [loading, setLoading] = useState(true); // Tambahkan state loading lokal
  
  const [sidebarWidth, setSidebarWidth] = useState(384); 
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const minWidth = 70; 
  const maxWidth = 500; 

  const { t, i18n } = useTranslation();
  
  const isCompactMode = sidebarWidth <= 100;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading hanya saat pertama kali loading
      try {
        await getUsersAll();
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
    
    const intervalId = setInterval(() => {
      // Panggil getUsersAll tanpa mengubah state loading
      getUsersAll();
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, [getUsersAll]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (!users.some(user => user._id === message.senderId)) {
        // Panggil getUsersAll tanpa mengubah state loading untuk pesan baru
        getUsersAll();
      }
    };

    socket.on('newMessage', handleNewMessage);
    
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, users, getUsersAll]);

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    let newWidth = e.clientX;
    
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;
    
    setSidebarWidth(newWidth);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Fungsi untuk memilih pengguna dan mengambil pesan
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Ambil pesan dari pengguna yang dipilih
    getMessages(user._id);
  };

  // Hanya tampilkan SidebarSkeleton saat pertama kali loading
  if (loading) return <SidebarSkeleton />;

  return (
    <div className="flex h-full">
      <aside 
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px`, minWidth: `${minWidth}px` }}
        className="h-full border-base-300 flex flex-col bg-[#ffffff] transition-colors duration-200"
      >
        {/* Header */}
        <div className="border-b border-gray-300 w-full p-3">
          <div className="flex items-center gap-2">
            {!isCompactMode && <span className="font-medium text-black text-4xl">{t("Chats")}</span>}
          </div>
          
          {!isCompactMode && (
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("Search by name...")}
                  className="w-full bg-white border border-gray-500 rounded-md px-4 py-2 pl-10 text-sm text-black"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}
          
          {!isCompactMode && (
            <div className="mt-3 flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="checkbox border-gray-600"
                />
                <span className="text-gray-600">{t("Show online only")}</span>
              </label>
              <span className="text-xs text-black">({onlineUsers.length - 1} {t("online")})</span>
            </div>
          )}
        </div>

        {/* User List */}
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-[#4FC3F7] transition-colors ${
                  selectedUser?._id === user._id ? "bg-[#4FC3F7]" : ""
                }`}
              >
                <div className={`relative ${isCompactMode ? 'mx-auto' : ''}`}>
                  <div className="relative">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="size-12 object-cover rounded-full"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span
                        className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
                      />
                    )}
                  </div>
                </div>

                {!isCompactMode && (
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium truncate text-[#111111]">{user.fullName}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-600 truncate max-w-[220px]">
                        {user.lastMessage
                          ? typeof user.lastMessage === 'object' && user.lastMessage.text
                            ? user.lastMessage.text
                            : typeof user.lastMessage === 'object' && user.lastMessage.image
                            ? "📷 Image"
                            : typeof user.lastMessage === 'string'
                            ? user.lastMessage
                            : t("No messages yet")
                          : t("No messages yet")}
                      </span>
                      
                      {user.lastMessageTime && (
                        <span className="text-xs text-zinc-600 whitespace-nowrap ml-1">
                          {formatTime(user.lastMessageTime)}
                        </span>
                      )}
                      {user.createdAt && !user.lastMessageTime && (
                        <span className="text-xs text-zinc-600 whitespace-nowrap ml-1">
                          {formatTime(user.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="text-center text-zinc-500 py-4">
              {showOnlineOnly ? t("No online users") : ""}
            </div>
          )}
        </div>
      </aside>
      
      {/* Resize handle */}
      <div
        className="cursor-col-resize w-0.5 bg-[#e9e9e9] hover:bg-gray-300 active:bg-gray-300"
        onMouseDown={startResizing}
      ></div>
    </div>
  );
};

export default AllChat;