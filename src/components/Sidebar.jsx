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
  Shield,
  X
} from 'lucide-react'

const menuItems = [
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/community', icon: Users, label: 'Communities' },
  { path: '/messages', icon: MessageSquare, label: 'Messages' },
]

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuthStore()
  const { selectedSchool, setSelectedSchool, schools } = useAppStore()
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavigate = (path) => {
    navigate(path)
    setIsOpen(false) // Close sidebar on mobile after navigation
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40
        w-64 bg-gray-800 text-white
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4 border-b border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo Section with School Dropdown */}
        <div className="p-4 lg:p-6 border-b border-gray-700">
          <button
            onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
            className="w-full flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center relative flex-shrink-0">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <h1 className="text-lg lg:text-xl font-bold flex-1 text-left">CampusTOK</h1>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSchoolDropdown ? 'rotate-180' : ''}`} />
          </button>
        
        {/* School Dropdown */}
        {showSchoolDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowSchoolDropdown(false)}
            />
            <div className="absolute left-0 mt-2 w-full lg:w-64 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-20">
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
                      setIsOpen(false) // Close sidebar on mobile
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
                    <div className="font-medium text-sm lg:text-base">{school.name}</div>
                    <div className="text-xs text-gray-400">{school.code}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

        {/* User Profile Section */}
        <div className="p-4 lg:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
              {user?.name?.charAt(0) || 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm lg:text-base truncate">{user?.name || 'Felix Gabriel'}</h3>
              <p className="text-xs lg:text-sm text-gray-300">General Account</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 lg:p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
                      isActive
                        ? 'bg-gray-700 text-white font-medium'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Post Button */}
        <div className="p-3 lg:p-4 border-t border-gray-700">
          <button
            onClick={() => handleNavigate('/')}
            className="w-full border-2 border-white text-white py-2.5 lg:py-3 rounded-full font-medium hover:bg-gray-700 transition-colors text-sm lg:text-base"
          >
            Post
          </button>
        </div>

        {/* Account Creation Options */}
        <div className="p-3 lg:p-4 border-t border-gray-700 space-y-1">
          <button
            onClick={() => handleNavigate('/create-account')}
            className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm lg:text-base"
          >
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-gray-400 flex items-center justify-center flex-shrink-0">
              <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </div>
            <span className="truncate">Create Account As</span>
          </button>
          <button
            onClick={() => handleNavigate('/create-account')}
            className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm lg:text-base"
          >
            <GraduationCap className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">A Student</span>
          </button>
          <button
            onClick={() => handleNavigate('/create-account')}
            className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm lg:text-base"
          >
            <Building2 className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">An Institution</span>
          </button>
        </div>
      </div>
    </>
  )
}
