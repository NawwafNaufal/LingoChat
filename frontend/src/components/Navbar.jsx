import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { 
  LogOut, 
  MessageSquare, 
  Settings, 
  User, 
  ChevronLast, 
  ChevronFirst,
  Menu,
  X,
  Search
} from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";
import ProfilePopup from "../pages/ProfilePage"; // Import ProfilePopup

const SidebarContext = createContext();

export default function Layout({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State untuk ProfilePopup
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };
    
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setExpanded(curr => !curr);
    if (isMobile) {
      setMobileMenuOpen(curr => !curr);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(curr => !curr);
    if (isMobile && !expanded) {
      setExpanded(true);
    }
  };

  // Handler untuk membuka ProfilePopup
  const openProfilePopup = (e) => {
    e.preventDefault(); // Mencegah navigasi ke halaman profile
    setIsProfileOpen(true);
    if (isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false); // Tutup sidebar mobile saat popup profile dibuka
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          onClick={toggleMobileMenu} 
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white shadow-md"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`h-screen ${expanded ? "w-52" : "w-16"} 
                  transition-all duration-300 ease-in-out
                  ${isMobile ? "fixed left-0 z-40" : ""}
                  ${isMobile && !mobileMenuOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <nav className="h-full flex flex-col bg-[#111111] border-r border-gray-800 shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
              <h1 className={`text-lg font-bold text-white overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}>N-G</h1>
            {!isMobile && (
              <button 
                onClick={toggleSidebar} 
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                {expanded ? <ChevronFirst /> : <ChevronLast />}
              </button>
            )}
          </div>
          
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">
              {/* Home */}
              <Link to="/User">
              <SidebarItem 
                icon={<MessageSquare className="w-5 h-5" />} 
                text="Home" 
                active={location.pathname === "/User"}
                />
              </Link>
              
              {/* Search */}
              <Link to="/">
                <SidebarItem 
                  icon={<Search className="w-5 h-5" />} 
                  text="Search" 
                  active={location.pathname === "/" || location.pathname === "/search"}
                />
              </Link>
              
              <Link to="/settings">
                <SidebarItem 
                  icon={<Settings className="w-5 h-5" />} 
                  text="Settings" 
                  active={location.pathname === "/settings"}
                />
              </Link>
              
              {/* Profile - modifikasi untuk membuka popup alih-alih navigasi */}
              {authUser && (
                <div onClick={openProfilePopup}>
                  <SidebarItem 
                    icon={<User className="w-5 h-5" />} 
                    text="Profile" 
                    active={location.pathname === "/profile"}
                  />
                </div>
              )}
              
              {/* Logout - only show if authenticated */}
              {authUser && (
                <div onClick={logout}>
                  <SidebarItem 
                    icon={<LogOut className="w-5 h-5" />} 
                    text="Logout" 
                  />
                </div>
              )}
            </ul>
          </SidebarContext.Provider>
          
          {/* User profile section at bottom - make it clickable to open profile popup */}
          <div 
            className="border-t border-gray-800 p-3 cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={openProfilePopup}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
                {authUser && authUser.profilePic ? (
                  <img 
                    src={authUser.profilePic} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className={`overflow-hidden transition-all ${expanded ? "w-full" : "w-0"}`}>
                <div className="leading-4">
                  <h4 className="font-semibold text-white">
                    {authUser ? authUser.fullName || "User" : "Guest"}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {authUser ? authUser.email || "user@example.com" : "guest@example.com"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Main content */}
      <div className={`flex-1 overflow-auto ${isMobile ? "w-full" : ""}`}>
        {/* Mobile header spacer to prevent content from hiding behind the hamburger button */}
        {isMobile && <div className="h-16"></div>}
        <div className="p-4">
          {children}
        </div>
      </div>
      
      {/* Profile Popup */}
      <ProfilePopup 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
}

// Sidebar item component
export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-gray-700 to-gray-800 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-blue-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-800 text-gray-200 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
}