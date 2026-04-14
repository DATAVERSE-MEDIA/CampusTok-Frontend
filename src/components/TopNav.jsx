// Topnav
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { requestAuthNotice } from "../utils/authNotice";
import { getAuthNoticeForPath } from "../utils/authNoticeContent";
import { isUserSessionAuthenticated } from "../utils/sessionAuth";
import { Search, Video, Users, BookOpen, Home, Menu } from "lucide-react";

export default function TopNav({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userType, isAuthenticated } = useAuthStore();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const hasAuthenticatedSession = isUserSessionAuthenticated(isAuthenticated);
  const canAccessProfile =
    hasAuthenticatedSession && userType !== "general" && !user?.isGuest;

  const handleProfileClick = () => {
    if (!hasAuthenticatedSession) {
      requestAuthNotice({
        ...getAuthNoticeForPath("/profile"),
        from: "/profile",
      });
      return;
    }

    if (!canAccessProfile) {
      navigate("/general-dashboard");
      return;
    }

    navigate("/profile");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearchQuery)}`);
    }
  };

  const homePath =
    userType === "institution"
      ? "/institution-dashboard"
      : userType === "student"
        ? "/student-dashboard"
        : "/general-dashboard";

  const navItems = [
    { path: homePath, icon: Home, label: "Home" },
    { path: "/video", icon: Video, label: "Video" },
    { path: "/friends", icon: Users, label: "Friends" },
    { path: "/blog", icon: BookOpen, label: "Campus Blog" },
  ];

  return (
    <div className="bg-gray-200 border-b border-gray-300 sticky top-0 z-20 w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex justify-between items-center">
        {/* Mobile Layout */}
        <div className="lg:hidden w-full space-y-3">
          <div className="flex items-center gap-3 rounded-[24px] bg-[#E3E3E3] px-3 py-2.5">
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              onClick={handleProfileClick}
              className="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0"
            >
              {user?.name?.charAt(0).toUpperCase() ||
                user?.full_name?.charAt(0).toUpperCase() ||
                "F"}
            </button>

            <form onSubmit={handleSearch} className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Search here"
                  className="w-full rounded-full border-none bg-white/90 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>
          </div>

          <div className="-mx-1 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max items-stretch gap-2 px-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                const extraProps =
                  item.path === "/blog" ? { id: "nav-campus-blog" } : {};

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex min-w-[84px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-colors ${
                      isActive
                        ? "bg-white text-primary shadow-sm"
                        : "bg-transparent text-gray-600"
                    }`}
                    {...extraProps}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-medium leading-tight text-center whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center w-full relative">
          {/* Search Bar with Profile Picture (Left Side) */}
          <div className="flex items-center gap-4 max-w-xl">
            <button
              onClick={handleProfileClick}
              className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity flex-shrink-0"
            >
              {user?.full_name?.charAt(0).toUpperCase() || "F"}
            </button>

            <form onSubmit={handleSearch} className="w-80">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Search here"
                  className="max-w-[300px] pl-12 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>
          </div>

          {/* Centered Navigation Icons */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div
              id="nav-tabs-container"
              className="flex items-center gap-4 xl:gap-8 bg-[#E3E3E3] rounded-[30px] px-8 py-3"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                const extraProps =
                  item.path === "/blog" ? { id: "nav-campus-blog" } : {};

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                    {...extraProps}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? "text-primary" : "text-gray-600"
                      }`}
                    />
                    <span
                      className={`text-sm whitespace-nowrap ${
                        isActive ? "text-primary font-medium" : "text-gray-600"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>


        
      </div>
    </div>
  );
}
