import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useAppStore } from '../store/useAppStore'
import {
  User,
  MessageSquare,
  Users,
  GraduationCap,
  Building2,
  Plus,
  ChevronDown,
  Shield
} from 'lucide-react'

const menuItems = [
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/community', icon: Users, label: 'Communities' },
  { path: '/messages', icon: MessageSquare, label: 'Messages' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuthStore()
  const { selectedSchool, setSelectedSchool, schools } = useAppStore()
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      {/* Logo Section with School Dropdown */}
      <div className="p-6 border-b border-gray-700">
        <button
          onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
          className="w-full flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center relative flex-shrink-0">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <h1 className="text-xl font-bold flex-1 text-left">CampusTOK</h1>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSchoolDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {/* School Dropdown */}
        {showSchoolDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowSchoolDropdown(false)}
            />
            <div className="absolute left-0 mt-2 w-64 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-20">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase mb-1">
                  Select School/Institution
                </div>
                {schools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => {
                      setSelectedSchool(school)
                      setShowSchoolDropdown(false)
                      // Refresh the page or update content
                      if (location.pathname === '/') {
                        window.location.reload()
                      } else {
                        navigate('/')
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors ${
                      selectedSchool?.id === school.id ? 'bg-gray-600 text-white' : 'text-gray-300'
                    }`}
                  >
                    <div className="font-medium">{school.name}</div>
                    <div className="text-xs text-gray-400">{school.code}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
            {user?.name?.charAt(0) || 'F'}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white">{user?.name || 'Felix Gabriel'}</h3>
            <p className="text-sm text-gray-300">General Account</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-700 text-white font-medium'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Post Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => navigate('/')}
          className="w-full border-2 border-white text-white py-3 rounded-full font-medium hover:bg-gray-700 transition-colors"
        >
          Post
        </button>
      </div>

      {/* Account Creation Options */}
      <div className="p-4 border-t border-gray-700 space-y-1">
        <button
          onClick={() => navigate('/create-account')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <span>Create Account As</span>
        </button>
        <button
          onClick={() => navigate('/create-account')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <GraduationCap className="w-5 h-5" />
          <span>A Student</span>
        </button>
        <button
          onClick={() => navigate('/create-account')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <Building2 className="w-5 h-5" />
          <span>An Institution</span>
        </button>
      </div>
    </div>
  )
}
