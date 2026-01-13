import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, Check, BadgeCheck } from "lucide-react";

/* ---------------- DATA + ALGORITHM ---------------- */

const rawPeople = [
  {
    id: "1",
    name: "Onasanya Olawale",
    image:
      "https://images.unsplash.com/photo-1520975922284-8b456906c813?auto=format&fit=crop&w=900&q=80",
    mutualCount: 6,
    department: "Engineering",
    verified: true,
    status: "online",
  },
  {
    id: "2",
    name: "Farinloye Jolextom",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    mutualCount: 4,
    department: "Design",
    verified: false,
    status: "away",
  },
  {
    id: "3",
    name: "John Doe",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    mutualCount: 2,
    department: "Engineering",
    verified: true,
    status: "offline",
  },
  {
    id: "4",
    name: "James Peter",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
    mutualCount: 7,
    department: "Business",
    verified: false,
    status: "online",
  },
  {
    id: "5",
    name: "Ohachaism Theodore",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80",
    mutualCount: 3,
    department: "Engineering",
    verified: false,
    status: "offline",
  },
  {
    id: "6",
    name: "Felix Gabriel",
    image:
      "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=900&q=80",
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
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold">
          Find your friends and connect with them
        </h1>
        <button className="p-2 rounded-lg border hover:bg-gray-100">
          <SlidersHorizontal />
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-center mb-10">
        Friend Requests
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {requests.map((person) => (
          <div
            key={person.id}
            className="relative rounded-3xl overflow-hidden shadow-lg"
          >
            {/* Image */}
            <Link to={`/friends/${person.id}`}>
              <img
                src={person.image}
                alt={person.name}
                className="w-full h-[420px] object-cover"
              />
            </Link>

            {/* Online status */}
            <span
              className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-white ${statusColor(
                person.status
              )}`}
            />

            {/* Bottom card */}
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4 shadow">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{person.name}</h3>
                {person.verified && (
                  <BadgeCheck className="w-5 h-5 text-blue-600" />
                )}
              </div>

              {/* Suggestion reason */}
              <p className="text-sm text-gray-500 mb-4">
                Suggested because you share {person.mutualCount} mutual friends
                {person.department && ` · ${person.department}`}
              </p>

              <div className="flex gap-3">
                <button
                  className="flex-1 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                  onClick={() =>
                    setRequests((prev) =>
                      prev.filter((p) => p.id !== person.id)
                    )
                  }
                >
                  Remove
                </button>

                <button
                  className="flex-1 py-2 rounded-full bg-gray-900 text-white flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                  onClick={() => followBack(person)}
                >
                  {followingId === person.id ? (
                    <>
                      <Check className="animate-bounce" />
                      Following
                    </>
                  ) : (
                    "Follow back"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
