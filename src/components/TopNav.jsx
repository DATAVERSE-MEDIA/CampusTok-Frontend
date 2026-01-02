import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { useAuthStore } from '../store/useAuthStore'
import {
  Search,
  Video,
  Users,
  BookOpen,
  Home
} from 'lucide-react'

export default function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const [localSearchQuery, setLocalSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (localSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearchQuery)}`)
    }
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/video', icon: Video, label: 'Video' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/blog', icon: BookOpen, label: 'Campus Blog' },
  ]

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Search Bar with Profile Picture */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity flex-shrink-0"
            >
              {user?.name?.charAt(0).toUpperCase() || 'F'}
            </button>
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
          </div>

          {/* Navigation Icons with Labels - Centered */}
          <div className="flex items-center gap-8 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-gray-600'}`} />
                  <span className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Empty space for balance */}
          <div className="flex-1 max-w-md"></div>
        </div>
      </div>
    </div>
  )
}
