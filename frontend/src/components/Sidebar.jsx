import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  
  // State untuk menyimpan lebar sidebar
  const [sidebarWidth, setSidebarWidth] = useState(384); // nilai default 384px = w-96
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const minWidth = 70; // minimal width yang lebih kecil (seperti Telegram)
  const maxWidth = 500; // maksimal width
  
  // Computed value untuk mengetahui apakah sidebar dalam mode compact
  const isCompactMode = sidebarWidth <= 100;

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Fungsi untuk memulai resize
  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Fungsi untuk melakukan resize saat mouse bergerak
  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    let newWidth = e.clientX;
    
    // Pastikan width dalam batas yang diizinkan
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;
    
    setSidebarWidth(newWidth);
  };

  // Fungsi untuk menghentikan resize
  const stopResizing = () => {
    setIsResizing(false);
  };

  // Tambahkan event listener untuk mouse move dan mouse up
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
        className="h-full border-r border-base-300 flex flex-col transition-colors duration-200"
      >
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            {!isCompactMode && <span className="font-medium">Contacts</span>}
          </div>
          
          {/* Name search input - hanya muncul jika tidak dalam mode compact */}
          {!isCompactMode && (
            <div className="mt-3 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-sm input-bordered w-full pl-8"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 size-4 text-zinc-500" />
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
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
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

              {/* User info - hanya muncul jika tidak dalam mode compact */}
              {!isCompactMode && (
                <div className="text-left min-w-0">
                  <div className="font-medium truncate">{user.fullName}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              )}
            </button>
          ))}

          {searchQuery !== "" && filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No users found</div>
          )}
          {searchQuery === "" && (
            <div className="text-center text-zinc-500 py-4">
              {isCompactMode ? "" : "Type to search contacts"}
            </div>
          )}
        </div>
      </aside>
      
      {/* Resize handle */}
      <div
        className="cursor-col-resize w-1 bg-zinc-800 hover:bg-zinc-600 active:bg-zinc-500"
        onMouseDown={startResizing}
      ></div>
    </div>
  );
};

export default Sidebar;