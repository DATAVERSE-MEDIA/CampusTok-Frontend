import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import {
  Eye,
  FileUp,
  AlertTriangle,
  Megaphone,
  Brain,
  Users,
  BarChart3,
  FileText,
  Settings,
  TrendingUp,
} from "lucide-react";

// Animated counter component
const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(String(value).replace(/[^0-9]/g, ""), 10) || 0;
    if (start === end) return;

    let incrementTime = (duration * 1000) / end;
    if (incrementTime < 1) incrementTime = 1;

    let timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start > end) start = end;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, 20);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

import { useState, useEffect } from "react";

// Mock data for the institution
const MOCK_STATS = {
  following: 500,
  followers: 10200,
  posts: 20500,
};

const QUICK_ACTIONS = [
  {
    id: 1,
    title: "View Posts",
    description: "Track how your posts are performing.",
    icon: Eye,
    color: "from-blue-500 to-blue-600",
    route: "/campus-blog",
  },
  {
    id: 2,
    title: "Upload Document",
    description: "Upload documents for chatbot training.",
    icon: FileUp,
    color: "from-purple-500 to-purple-600",
    route: "/chatbot",
  },
  {
    id: 3,
    title: "View Complaints",
    description: "Review student complaints and feedback.",
    icon: AlertTriangle,
    color: "from-orange-500 to-orange-600",
    route: "/sentiment-bank",
  },
  {
    id: 4,
    title: "Post Announcement",
    description: "Share important updates with students.",
    icon: Megaphone,
    color: "from-green-500 to-green-600",
    route: "/campus-blog",
  },
];

const KPI_CARDS = [
  {
    id: 1,
    title: "Sentiment Score",
    value: "72%",
    change: "+5%",
    positive: true,
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Active Students",
    value: "2,845",
    change: "+12%",
    positive: true,
    icon: Users,
  },
  {
    id: 3,
    title: "Pending Complaints",
    value: "12",
    change: "-3",
    positive: true,
    icon: MessageSquareWarning,
  },
  {
    id: 4,
    title: "Posts This Week",
    value: "28",
    change: "+8",
    positive: true,
    icon: FileText,
  },
];

export default function InstitutionDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { selectedSchool } = useAppStore();

  const institutionName =
    selectedSchool?.name || user?.institution_name || "University of Lagos";
  const institutionAddress =
    selectedSchool?.address ||
    "University Road, Lagos Mainland, Akoka, Yaba, Lagos";

  // Get cover image based on school
  const getCoverImage = () => {
    const schoolName = selectedSchool?.name?.toLowerCase() || "";
    if (schoolName.includes("lagos") || schoolName.includes("unilag")) {
      return "/blog-images/UNILAG Campus Blog Images/image 22.svg";
    } else if (schoolName.includes("oau") || schoolName.includes("obafemi")) {
      return "/blog-images/OAU Campus Blog images/image 28.svg";
    } else if (schoolName.includes("yabatech") || schoolName.includes("yaba")) {
      return "/blog-images/Yabatech Campus blog images/image 6.svg";
    }
    return "/blog-images/UNILAG Campus Blog Images/image 22.svg";
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto pb-8">
        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-48 md:h-64 w-full overflow-hidden"
        >
          <img
            src={getCoverImage()}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>

        {/* Profile Section */}
        <div className="px-4 md:px-8 -mt-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row md:items-end gap-4"
          >
            {/* Institution Logo */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex-shrink-0">
              {selectedSchool?.logo ? (
                <img
                  src={selectedSchool.logo}
                  alt={institutionName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-3xl font-bold">
                  {institutionName.charAt(0)}
                </div>
              )}
            </div>

            {/* Institution Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {institutionName}
              </h1>
              <p className="text-gray-500 text-sm md:text-base mt-1">
                {institutionAddress}
              </p>
            </div>

            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/settings")}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Settings className="w-4 h-4" />
              Settings
            </motion.button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-8 mt-6 border-b border-gray-200 pb-6"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                <Counter value={MOCK_STATS.following} />
              </p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                <Counter value={MOCK_STATS.followers} />
              </p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                <Counter value={MOCK_STATS.posts} />
              </p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Grid */}
        <div className="px-4 md:px-8 mt-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg font-semibold text-gray-900 mb-4"
          >
            Quick Actions
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {QUICK_ACTIONS.map((action) => (
              <motion.button
                key={action.id}
                variants={item}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.route)}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {action.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* KPI Cards */}
        <div className="px-4 md:px-8 mt-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg font-semibold text-gray-900 mb-4"
          >
            Key Metrics
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {KPI_CARDS.map((kpi) => (
              <motion.div
                key={kpi.id}
                variants={item}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <kpi.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      kpi.positive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-sm text-gray-500 mt-1">{kpi.title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sentiment Bank CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="px-4 md:px-8 mt-8"
        >
          <div
            onClick={() => navigate("/sentiment-bank")}
            className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-2xl p-6 md:p-8 text-white cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Sentiment Bank</h3>
                <p className="text-white/80 text-sm mt-1">
                  View AI-powered analysis of student feedback and campus
                  sentiment trends.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
