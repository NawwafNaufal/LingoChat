import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeletonProfile";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [sidebarWidth, setSidebarWidth] = useState(384); 
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const minWidth = 70; 
  const maxWidth = 500; 
  const { t, i18n } = useTranslation();
  
  const isCompactMode = sidebarWidth <= 100;

  useEffect(() => {
    getUsers();
  }, [getUsers]);

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

  const filteredUsers = searchQuery
    ? users.filter((user) => 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <div className="flex h-full">
      <aside 
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px`, minWidth: `${minWidth}px` }}
        className="h-full border-gray-600 flex flex-col bg-[#ffffff] duration-200"
      >
        <div className="border-grey-600 w-full p-5">
          <div className="flex items-center gap-2">
            {!isCompactMode && <span className="font-medium text-black text-4xl">{t("Contacts")}</span>}
          </div>
          
          {!isCompactMode && (
            <div className="mt-3 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder= {t("Search by name...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-500 rounded-md px-4 py-2 pl-10 text-sm text-black focus:outline-none focus:border-gray-500 focus:ring-0"
/>
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 size-4 text-zinc-600" />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-[#4FC3F7] transition-colors
                ${selectedUser?._id === user._id ? "hover:bg-[#4FC3F7]" : ""}
              `}
            >
              <div className={`relative ${isCompactMode ? 'mx-auto' : ''}`}>
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {!isCompactMode && (
                <div className="text-left min-w-0">
                  <div className="font-medium truncate text-[#111111]">{user.fullName}</div>
                  <div className="text-sm text-zinc-600">
                    {user.description || t("No description")}
                  </div>
                </div>
              )}
            </button>
          ))}

          {searchQuery !== "" && filteredUsers.length === 0 && (
            <div className="text-center text-zinc-600 py-4">{t("No users found")}</div>
          )}
          {searchQuery === "" && (
            <div className="text-center text-zinc-600 py-4">
              {isCompactMode ? "" : t("Type to search contacts")}
            </div>
          )}
        </div>
      </aside>
      <div
        className="cursor-col-resize w-1 bg-[#e9e9e9] hover:bg-zinc-600 active:bg-zinc-500"
        onMouseDown={startResizing}
      ></div>
    </div>
  );
};

export default Sidebar;