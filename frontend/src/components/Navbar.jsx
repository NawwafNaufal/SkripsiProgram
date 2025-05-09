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
import SettingsPopup from "./Settings" // Import SettingsPopup

const SidebarContext = createContext();

export default function Layout({ children }) {
  // Changed initial state to false so sidebar is always closed on refresh/load
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // New state for settings popup
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // No need to set expanded here as it's already false by default
    };
    
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Optional: Add effect to ensure sidebar is closed after login
  useEffect(() => {
    // This will ensure sidebar is closed when auth state changes (login/logout)
    setExpanded(false);
  }, [authUser]);

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

  const openProfilePopup = (e) => {
    e.preventDefault();
    setIsProfileOpen(true);
    if (isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const openSettingsPopup = (e) => {
    e.preventDefault();
    setIsSettingsOpen(true);
    if (isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false); 
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

      <aside 
        className={`h-screen ${expanded ? "w-52" : "w-16"} 
                  transition-all duration-300 ease-in-out
                  ${isMobile ? "fixed left-0 z-40" : ""}
                  ${isMobile && !mobileMenuOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <nav className="h-full flex flex-col bg-[#F5F5F5] border-r border-gray-300 shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
              <h1 className={`text-lg font-bold text-[#4FC3F7]  overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}>N-G</h1>
            {!isMobile && (
              <button 
                onClick={toggleSidebar} 
                className="p-1.5 rounded-lg bg-[#4FC3F7]  hover:bg-[#4FC3F7]  text-black"
              >
                {expanded ? <ChevronFirst /> : <ChevronLast />}
              </button>
            )}
          </div>
          
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">
              {/* Home */}
              <Link to="/">
              <SidebarItem 
                icon={<MessageSquare className="w-5 h-5 text-black"/>} 
                text={<span className="text-black">Home</span>}
                active={location.pathname === "/"}
                />
              </Link>
              
              {/* Search */}
              <Link to="/User">
                <SidebarItem 
                  icon={<Search className="w-5 h-5 text-black" />} 
                  text={<span className="text-black">Search</span>}
                  active={location.pathname === "/User" || location.pathname === "/search"}
                />
              </Link>
              
              {/* Settings - modified to open popup instead of navigation */}
              <div onClick={openSettingsPopup}>
                <SidebarItem 
                  icon={<Settings className="w-5 h-5 text-black" />} 
                  text={<span className="text-black">Settings</span>}
                  active={location.pathname === "/settings"}
                />
              </div>
              
              {/* Profile */}
              {authUser && (
                <div onClick={openProfilePopup}>
                  <SidebarItem 
                    icon={<User className="w-5 h-5 text-black" />} 
                    text={<span className="text-black">Profile</span>}
                    textColor="text-black"
                    active={location.pathname === "/profile"}
                  />
                </div>
              )}
            </ul>
          
          <div className="mt-auto">
              {/* Logout - Moved here, right above the profile */}
              {authUser && (
                <div onClick={logout} className="px-3 mb-2">
                  <SidebarItem 
                    icon={<LogOut className="w-5 h-5 text-black" />} 
                    text={<span className="text-black">Logout</span>} 
                  />
                </div>
              )}
            
            {/* User profile section */}
            <div 
              className="border-t border-gray-300 p-3 cursor-pointer hover:bg-[#4FC3F7]  transition-colors"
              onClick={openProfilePopup}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 overflow-hidden">
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
                    <h4 className="font-semibold text-black">
                      {authUser ? authUser.fullName || "User" : "Guest"}
                    </h4>
                    <span className="text-xs text-black">
                      {authUser ? authUser.email || "user@example.com" : "guest@example.com"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </SidebarContext.Provider>
        </nav>
      </aside>
      
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#F5F5F5] bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Main content */}
      <div className={`flex-1 overflow-auto ${isMobile ? "w-full" : ""}`}>
        {/* Mobile header spacer to prevent content from hiding behind the hamburger button */}
        {isMobile && <div className="h-16"></div>}
        <div>
          {children}
        </div>
      </div>
      
      {/* Profile Popup */}
      <ProfilePopup 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
      
      {/* Settings Popup */}
      <SettingsPopup 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}

// SidebarItem remains the same
export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
        ${
          active
            ? "bg-[#4FC3F7]  text-white"
            : "hover:bg-[#4FC3F7]  text-gray-400"
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
    </li>
  );
}