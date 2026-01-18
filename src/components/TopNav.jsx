import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { Search, Video, Users, BookOpen, Home, Menu } from "lucide-react";

export default function TopNav({ onMenuClick }) {
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
    { path: "/", icon: Home, label: "Home" },
    { path: "/video", icon: Video, label: "Video" },
    { path: "/friends", icon: Users, label: "Friends" },
    { path: "/blog", icon: BookOpen, label: "Campus Blog" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-20"
      >
        <div className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
          {/* Mobile Layout */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Hamburger Menu */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </motion.button>

            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Search here"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            {/* Profile Picture - Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
              className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity flex-shrink-0"
            >
              {user?.name?.charAt(0).toUpperCase() || "F"}
            </motion.button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between gap-6">
            {/* Search Bar with Profile Picture */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 flex-1 max-w-md"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity flex-shrink-0"
              >
                {user?.full_name?.charAt(0).toUpperCase() || "F"}
              </motion.button>
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    placeholder="Search here"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </form>
            </motion.div>

            {/* Navigation Icons with Labels - Centered */}
            <motion.div
              className="flex items-center gap-6 xl:gap-8 flex-1 justify-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <motion.button
                    key={item.path}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    <Icon
                      className={`w-5 h-5 xl:w-6 xl:h-6 ${isActive ? "text-primary" : "text-gray-500"}`}
                    />
                    <span
                      className={`text-xs ${isActive ? "text-primary font-medium" : "text-gray-600"}`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Empty space for balance */}
            <div className="flex-1 max-w-md"></div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation for Mobile */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 px-2 py-2"
      >
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 p-2 hover:opacity-80 transition-opacity flex-1"
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-600"}`}
                />
                <span
                  className={`text-xs ${isActive ? "text-primary font-medium" : "text-gray-600"}`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
