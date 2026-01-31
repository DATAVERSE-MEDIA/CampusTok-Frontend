// import { useState } from 'react'
// import { UserPlus, UserCheck, Search, MessageCircle, MoreVertical } from 'lucide-react'

// const friends = [
//   { id: 1, name: 'John Smith', username: '@johnsmith', mutual: 12, status: 'online', avatar: null },
//   { id: 2, name: 'Sarah Johnson', username: '@sarahj', mutual: 8, status: 'offline', avatar: null },
//   { id: 3, name: 'Michael Chen', username: '@mchen', mutual: 15, status: 'online', avatar: null },
//   { id: 4, name: 'Emily Davis', username: '@emilyd', mutual: 5, status: 'away', avatar: null },
//   { id: 5, name: 'David Wilson', username: '@dwilson', mutual: 20, status: 'online', avatar: null },
// ]

// const friendRequests = [
//   { id: 6, name: 'Alex Brown', username: '@alexb', mutual: 3 },
//   { id: 7, name: 'Jessica Martinez', username: '@jessm', mutual: 7 },
// ]

// export default function Friends() {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [activeTab, setActiveTab] = useState('all')

//   const filteredFriends = friends.filter(friend =>
//     friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     friend.username.toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="card mb-6">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
//             <UserCheck className="w-6 h-6 text-pink-600" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
//             <p className="text-gray-600">Connect with your campus community</p>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-6">
//         <button
//           onClick={() => setActiveTab('all')}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//             activeTab === 'all'
//               ? 'bg-primary-600 text-white'
//               : 'bg-white text-gray-700 hover:bg-gray-100'
//           }`}
//         >
//           All Friends ({friends.length})
//         </button>
//         <button
//           onClick={() => setActiveTab('requests')}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//             activeTab === 'requests'
//               ? 'bg-primary-600 text-white'
//               : 'bg-white text-gray-700 hover:bg-gray-100'
//           }`}
//         >
//           Requests ({friendRequests.length})
//         </button>
//       </div>

//       {/* Search */}
//       <div className="card mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search friends..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//           />
//         </div>
//       </div>

//       {/* Friends List */}
//       {activeTab === 'all' ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredFriends.map((friend) => (
//             <div key={friend.id} className="card hover:shadow-lg transition-shadow">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
//                       {friend.name.charAt(0)}
//                     </div>
//                     <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
//                       friend.status === 'online' ? 'bg-green-500' :
//                       friend.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
//                     }`} />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-900">{friend.name}</h3>
//                     <p className="text-sm text-gray-500">{friend.username}</p>
//                   </div>
//                 </div>
//                 <button className="p-2 hover:bg-gray-100 rounded-lg">
//                   <MoreVertical className="w-5 h-5 text-gray-400" />
//                 </button>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">{friend.mutual} mutual friends</span>
//                 <div className="flex gap-2">
//                   <button className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors">
//                     <MessageCircle className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {friendRequests.map((request) => (
//             <div key={request.id} className="card flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
//                   {request.name.charAt(0)}
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-900">{request.name}</h3>
//                   <p className="text-sm text-gray-500">{request.username}</p>
//                   <p className="text-sm text-gray-600">{request.mutual} mutual friends</p>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <button className="btn-primary flex items-center gap-2">
//                   <UserCheck className="w-5 h-5" />
//                   Accept
//                 </button>
//                 <button className="btn-secondary">Decline</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

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
    <div className="max-w-4xl mx-auto px-4 pb-20">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                person.status,
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
                      prev.filter((p) => p.id !== person.id),
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
