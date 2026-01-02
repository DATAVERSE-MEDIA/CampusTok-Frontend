import { useState } from 'react'
import { Users, UserPlus, Hash, MessageSquare, Calendar } from 'lucide-react'

const communities = [
  {
    id: 1,
    name: 'Computer Science Club',
    description: 'For CS students and enthusiasts. Share projects, discuss topics, and network.',
    members: 234,
    posts: 156,
    category: 'Academic',
    tags: ['Programming', 'Tech', 'Study'],
    isJoined: true
  },
  {
    id: 2,
    name: 'Photography Society',
    description: 'Share your photos, learn techniques, and participate in photo walks.',
    members: 156,
    posts: 89,
    category: 'Arts',
    tags: ['Photography', 'Creative'],
    isJoined: false
  },
  {
    id: 3,
    name: 'Entrepreneurship Network',
    description: 'Connect with aspiring entrepreneurs and startup founders.',
    members: 189,
    posts: 112,
    category: 'Business',
    tags: ['Startup', 'Business', 'Innovation'],
    isJoined: true
  },
  {
    id: 4,
    name: 'Sports & Fitness',
    description: 'Stay active and connect with fellow athletes and fitness enthusiasts.',
    members: 312,
    posts: 203,
    category: 'Sports',
    tags: ['Fitness', 'Sports', 'Health'],
    isJoined: false
  },
]

const recentPosts = [
  {
    id: 1,
    community: 'Computer Science Club',
    author: 'John Smith',
    title: 'New Study Group Forming',
    content: 'Looking for 3-4 people to study algorithms together. Meeting weekly on Tuesdays.',
    likes: 12,
    comments: 5,
    time: '2h ago'
  },
  {
    id: 2,
    community: 'Entrepreneurship Network',
    author: 'Sarah Johnson',
    title: 'Startup Pitch Event',
    content: 'We\'re hosting a pitch event next month. Sign up if you want to present your idea!',
    likes: 34,
    comments: 8,
    time: '5h ago'
  },
]

export default function Community() {
  const [activeTab, setActiveTab] = useState('all')
  const [joinedCommunities, setJoinedCommunities] = useState(
    communities.filter(c => c.isJoined).map(c => c.id)
  )

  const handleJoin = (communityId) => {
    setJoinedCommunities([...joinedCommunities, communityId])
  }

  const handleLeave = (communityId) => {
    setJoinedCommunities(joinedCommunities.filter(id => id !== communityId))
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
            <p className="text-gray-600">Join communities and connect with like-minded people</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Communities
        </button>
        <button
          onClick={() => setActiveTab('joined')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'joined'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          My Communities ({joinedCommunities.length})
        </button>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {communities
          .filter(c => activeTab === 'all' || joinedCommunities.includes(c.id))
          .map((community) => (
            <div key={community.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{community.name}</h2>
                  <p className="text-gray-600 text-sm mb-3">{community.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {community.members} members
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {community.posts} posts
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                      {community.category}
                    </span>
                    {community.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {joinedCommunities.includes(community.id) ? (
                <button
                  onClick={() => handleLeave(community.id)}
                  className="w-full btn-secondary"
                >
                  Leave Community
                </button>
              ) : (
                <button
                  onClick={() => handleJoin(community.id)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Join Community
                </button>
              )}
            </div>
          ))}
      </div>

      {/* Recent Posts */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Posts from Your Communities</h2>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-primary-600">{post.community}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">{post.author}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">{post.time}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="hover:text-red-600">Like ({post.likes})</button>
                <button className="hover:text-primary-600">Comment ({post.comments})</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

