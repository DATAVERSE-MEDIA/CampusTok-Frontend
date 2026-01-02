import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, User, BookOpen, Video, Users, Hash } from 'lucide-react'

const searchResults = {
  people: [
    { id: 1, name: 'John Smith', username: '@johnsmith', type: 'Student', avatar: null },
    { id: 2, name: 'Sarah Johnson', username: '@sarahj', type: 'Student', avatar: null },
    { id: 3, name: 'Michael Chen', username: '@mchen', type: 'Professor', avatar: null },
  ],
  posts: [
    { id: 1, title: 'Study Group Forming', author: 'John Smith', content: 'Looking for study partners for CS 101...', likes: 12 },
    { id: 2, title: 'Campus Event This Weekend', author: 'Campus Admin', content: 'Don\'t miss the annual tech fair...', likes: 45 },
  ],
  videos: [
    { id: 1, title: 'Campus Tour 2024', creator: 'Campus Media', views: '12.5K' },
    { id: 2, title: 'Study Tips', creator: 'Academic Success', views: '8.3K' },
  ],
  communities: [
    { id: 1, name: 'Computer Science Club', members: 234, description: 'For CS students and enthusiasts' },
    { id: 2, name: 'Photography Society', members: 156, description: 'Share your photos and learn together' },
  ],
  hashtags: [
    { tag: '#CampusLife', posts: 1234 },
    { tag: '#StudyGroup', posts: 567 },
    { tag: '#Events', posts: 890 },
  ]
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'people', label: 'People' },
    { id: 'posts', label: 'Posts' },
    { id: 'videos', label: 'Videos' },
    { id: 'communities', label: 'Communities' },
    { id: 'hashtags', label: 'Hashtags' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <SearchIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Search</h1>
            <p className="text-gray-600">Find people, posts, videos, and more</p>
          </div>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campus, people, posts..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-6">
        {(activeFilter === 'all' || activeFilter === 'people') && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              People
            </h2>
            <div className="space-y-3">
              {searchResults.people.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{person.name}</h3>
                      <p className="text-sm text-gray-500">{person.username} • {person.type}</p>
                    </div>
                  </div>
                  <button className="btn-primary">View Profile</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'posts') && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Posts
            </h2>
            <div className="space-y-4">
              {searchResults.posts.map((post) => (
                <div key={post.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {post.author}</span>
                    <span className="text-sm text-gray-500">{post.likes} likes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'videos') && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.videos.map((video) => (
                <div key={video.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-500">{video.creator} • {video.views} views</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'communities') && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Communities
            </h2>
            <div className="space-y-3">
              {searchResults.communities.map((community) => (
                <div key={community.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{community.name}</h3>
                    <p className="text-sm text-gray-500">{community.description}</p>
                    <p className="text-sm text-gray-600 mt-1">{community.members} members</p>
                  </div>
                  <button className="btn-primary">Join</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'hashtags') && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Hashtags
            </h2>
            <div className="flex flex-wrap gap-3">
              {searchResults.hashtags.map((hashtag, idx) => (
                <button
                  key={idx}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-medium"
                >
                  {hashtag.tag} ({hashtag.posts})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

