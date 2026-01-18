import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Check,
  BadgeCheck,
  Users,
  UserPlus,
} from "lucide-react";

/* ---------------- DATA + ALGORITHM ---------------- */

const rawPeople = [
  {
    id: "1",
    name: "Onasanya Olawale",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    mutualCount: 6,
    department: "Engineering",
    verified: true,
    status: "online",
  },
  {
    id: "2",
    name: "Farinloye Jolextom",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    mutualCount: 4,
    department: "Design",
    verified: false,
    status: "away",
  },
  {
    id: "3",
    name: "John Doe",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    mutualCount: 2,
    department: "Engineering",
    verified: true,
    status: "offline",
  },
  {
    id: "4",
    name: "James Peter",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    mutualCount: 7,
    department: "Business",
    verified: false,
    status: "online",
  },
  {
    id: "5",
    name: "Ohachaism Theodore",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    mutualCount: 3,
    department: "Engineering",
    verified: false,
    status: "offline",
  },
  {
    id: "6",
    name: "Felix Gabriel",
    image:
      "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=400&q=80",
    mutualCount: 5,
    department: "Design",
    verified: true,
    status: "online",
  },
];

// Ranking algorithm
const rankSuggestions = (people) =>
  [...people]
    .map((p) => ({
      ...p,
      score: p.mutualCount * 3 + (p.department === "Engineering" ? 2 : 1),
    }))
    .sort((a, b) => b.score - a.score);

/* ---------------- COMPONENT ---------------- */

export default function FriendsPage() {
  const [requests, setRequests] = useState(rankSuggestions(rawPeople));
  const [followingId, setFollowingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("suggestions");

  /* Toast auto close */
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const followBack = (person) => {
    setFollowingId(person.id);
    setTimeout(() => {
      setRequests((prev) => prev.filter((p) => p.id !== person.id));
      setFollowingId(null);
      setToast(`You are now following ${person.name}`);
    }, 700);
  };

  const statusColor = (status) => {
    if (status === "online") return "bg-green-500";
    if (status === "away") return "bg-yellow-400";
    return "bg-gray-400";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find Friends</h1>
            <p className="text-sm text-gray-500">
              Connect with your campus community
            </p>
          </div>
        </div>
        <button className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
            activeTab === "suggestions"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Suggestions ({requests.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
            activeTab === "requests"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Friend Requests (0)
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
            activeTab === "following"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Following (0)
        </button>
      </div>

      {/* Empty state for other tabs */}
      {activeTab !== "suggestions" && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            No {activeTab} yet
          </h3>
          <p className="text-gray-500 text-sm">
            {activeTab === "requests"
              ? "Friend requests will appear here"
              : "People you follow will appear here"}
          </p>
        </div>
      )}

      {/* Suggestions Grid */}
      {activeTab === "suggestions" && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {requests.map((person) => (
            <motion.div
              key={person.id}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              {/* Image */}
              <Link to={`/friends/${person.id}`} className="block">
                <div className="relative">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  {/* Online status */}
                  <span
                    className={`absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white shadow ${statusColor(
                      person.status,
                    )}`}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </Link>

              {/* Info overlay at bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-semibold text-sm truncate">
                    {person.name}
                  </h3>
                  {person.verified && (
                    <BadgeCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-white/80 mb-3 line-clamp-1">
                  {person.mutualCount} mutual · {person.department}
                </p>

                <button
                  className="w-full py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                  onClick={() => followBack(person)}
                >
                  {followingId === person.id ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 z-50">
          <Check className="w-4 h-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
