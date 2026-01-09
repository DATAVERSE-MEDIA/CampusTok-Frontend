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
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 pb-20 lg:pb-6">
      <div className="card mb-4 lg:mb-6">
        <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <SearchIcon className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Search</h1>
            <p className="text-sm lg:text-base text-gray-600 mt-0.5">Find people, posts, videos, and more</p>
          </div>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campus, people, posts..."
            className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm lg:text-lg"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 lg:mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-medium transition-colors text-sm lg:text-base whitespace-nowrap flex-shrink-0 ${
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
      <div className="space-y-4 lg:space-y-6">
        {(activeFilter === 'all' || activeFilter === 'people') && (
          <div className="card">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
              <User className="w-4 h-4 lg:w-5 lg:h-5" />
              People
            </h2>
            <div className="space-y-2 lg:space-y-3">
              {searchResults.people.map((person) => (
                <div key={person.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-2 lg:p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base flex-shrink-0">
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm lg:text-base text-gray-900 truncate">{person.name}</h3>
                      <p className="text-xs lg:text-sm text-gray-500 truncate">{person.username} • {person.type}</p>
                    </div>
                  </div>
                  <button className="btn-primary text-xs lg:text-sm px-3 lg:px-4 py-1.5 lg:py-2 w-full sm:w-auto">View Profile</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'posts') && (
          <div className="card">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5" />
              Posts
            </h2>
            <div className="space-y-3 lg:space-y-4">
              {searchResults.posts.map((post) => (
                <div key={post.id} className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-sm lg:text-base text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-xs lg:text-sm text-gray-600 mb-2 break-words">{post.content}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span className="text-xs lg:text-sm text-gray-500">By {post.author}</span>
                    <span className="text-xs lg:text-sm text-gray-500">{post.likes} likes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'videos') && (
          <div className="card">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
              <Video className="w-4 h-4 lg:w-5 lg:h-5" />
              Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              {searchResults.videos.map((video) => (
                <div key={video.id} className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-sm lg:text-base text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-xs lg:text-sm text-gray-500">{video.creator} • {video.views} views</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'communities') && (
          <div className="card">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 lg:w-5 lg:h-5" />
              Communities
            </h2>
            <div className="space-y-2 lg:space-y-3">
              {searchResults.communities.map((community) => (
                <div key={community.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm lg:text-base text-gray-900">{community.name}</h3>
                    <p className="text-xs lg:text-sm text-gray-500 break-words">{community.description}</p>
                    <p className="text-xs lg:text-sm text-gray-600 mt-1">{community.members} members</p>
                  </div>
                  <button className="btn-primary text-xs lg:text-sm px-3 lg:px-4 py-1.5 lg:py-2 w-full sm:w-auto">Join</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === 'all' || activeFilter === 'hashtags') && (
          <div className="card">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4 lg:w-5 lg:h-5" />
              Hashtags
            </h2>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {searchResults.hashtags.map((hashtag, idx) => (
                <button
                  key={idx}
                  className="px-3 lg:px-4 py-1.5 lg:py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-medium text-xs lg:text-sm"
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

