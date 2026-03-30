// Topnav
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Search, Video, Users, BookOpen, Home } from "lucide-react";

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearchQuery)}`);
    }
  };

  const navItems = [
    { path: "/general-dashboard", icon: Home, label: "Home" },
    { path: "/video", icon: Video, label: "Video" },
    { path: "/friends", icon: Users, label: "Friends" },
    { path: "/blog", icon: BookOpen, label: "Campus Blog" },
  ];

  return (
    <div className="bg-gray-200 border-b border-gray-300 sticky top-0 z-20 w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex justify-between items-center">
        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center gap-3 py-3 px-4 rounded-[30px] bg-[#E3E3E3] w-full">
          <button
            onClick={() => navigate("/profile")}
            className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0"
          >
            {user?.name?.charAt(0).toUpperCase() ||
              user?.full_name?.charAt(0).toUpperCase() ||
              "F"}
          </button>

          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center rounded-[30px] bg-[#E3E3E3] relative"
          >
            <Search className="absolute left-2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder="Search here"
              className="w-full pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-[#E3E3E3] border-none text-gray-700 placeholder:text-gray-500"
              style={{ backgroundColor: "#E3E3E3" }}
            />
          </form>

          <div className="flex gap-3 ml-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              // add id ONLY for Campus Blog (so Video page can target it)
              const extraProps =
                item.path === "/blog" ? { id: "nav-campus-blog" } : {};

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 p-2 hover:opacity-80 transition-opacity"
                  {...extraProps}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-primary" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`text-xs whitespace-nowrap ${
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
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center w-full relative">
          {/* Search Bar with Profile Picture (Left Side) */}
          <div className="flex items-center gap-4 max-w-xl">
            <button
              onClick={() => navigate("/profile")}
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
