import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useAppStore } from '../store/useAppStore'
import {
  User,
  MessageSquare,
  Users,
  GraduationCap,
  Plus,
  ChevronDown,
  Shield,
  X,
  Bell,
  Settings,
  LogOut,
  HelpCircle,
  AlertCircle,
  LayoutDashboard,
  Eye,
  FileText,
  BookOpen,
  AtSign,
  Building2
} from 'lucide-react'

// General account menu items - matching Figma
const generalMenuItems = [
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/community', icon: Users, label: 'Communities' },
  { path: '/messages', icon: MessageSquare, label: 'Messages' },
]

// Student menu items
const studentMenuItems = [
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/community', icon: Users, label: 'Communities' },
  { path: '/messages', icon: MessageSquare, label: 'Messages' },
  { path: '/complaints', icon: HelpCircle, label: 'complaints' },
  { path: '/student-portal', icon: GraduationCap, label: 'Student Portal' },
  { path: '/notifications', icon: Bell, label: 'Notification' },
]

// Institution menu items - matching Figma design
const institutionMenuItems = [
  { path: '/institution-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/community', icon: Users, label: 'Communities' },
  { path: '/chatbot', icon: Eye, label: 'ChatBot Bank' },
  { path: '/faculties', icon: FileText, label: 'Faculties / Department' },
  { path: '/courses', icon: BookOpen, label: 'Courses / Programs' },
  { path: '/notifications', icon: Bell, label: 'Notification' },
]

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user, userType } = useAuthStore()
  const { selectedSchool, setSelectedSchool, schools } = useAppStore()
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)

  // Determine which menu items to show based on user type
  const menuItems = 
    userType === 'institution' ? institutionMenuItems :
    userType === 'general' || !userType ? generalMenuItems :
    studentMenuItems

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

        {/* User/Institution Profile Section - Matching Figma */}
        <div className="p-4 lg:p-6 border-b border-gray-700">
          {userType === 'institution' ? (
            // Institution Profile - Matching Figma design
            <div className="flex items-center gap-3">
              {/* Institution Crest/Logo */}
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user?.logo || selectedSchool?.logo ? (
                  <img 
                    src={user.logo || selectedSchool.logo} 
                    alt={user?.name || selectedSchool?.name || 'Institution'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm lg:text-base truncate">
                  {user?.name || selectedSchool?.name || 'University of Lagos'}
                </h3>
                <p className="text-xs lg:text-sm text-gray-300 truncate">
                  {user?.address || selectedSchool?.address || 'University Road Lagos Mainland A...'}
                </p>
              </div>
            </div>
          ) : userType === 'general' || !userType ? (
            // General Account Profile - Matching Figma
            <div className="flex items-center gap-3">
              {/* Profile Picture */}
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0) || 'F'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm lg:text-base truncate">{user?.name || 'Felix Gabriel'}</h3>
                <p className="text-xs lg:text-sm text-gray-300 truncate">General Account</p>
              </div>
            </div>
          ) : (
            // Student Profile
            <div className="flex items-center gap-3">
              {/* Profile Picture */}
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0) || 'F'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm lg:text-base truncate">{user?.name || 'Felix Gabriel'}</h3>
                <p className="text-xs lg:text-sm text-gray-300 truncate">
                  {user?.school ? `${user.school}` : selectedSchool ? `${selectedSchool.name}` : 'University of Lagos'}
                  {user?.department && `, ${user.department}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Matching Figma */}
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

        {/* Post Button - Matching Figma */}
        <div className="p-3 lg:p-4 border-t border-gray-700">
          <button
            onClick={() => handleNavigate('/')}
            className="w-full border-2 border-white text-white py-2.5 lg:py-3 rounded-full font-medium hover:bg-gray-700 transition-colors text-sm lg:text-base"
          >
            Post
          </button>
        </div>

        {/* Create Account As Section - Only for general accounts */}
        {(userType === 'general' || !userType) && (
          <div className="p-3 lg:p-4 border-t border-gray-700">
            <p className="text-xs lg:text-sm text-gray-400 uppercase mb-2 lg:mb-3 font-semibold px-2">
              Create Account As
            </p>
            <div className="space-y-1">
              <button
                onClick={() => navigate('/signup?type=student')}
                className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm lg:text-base"
              >
                <GraduationCap className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">A Student</span>
              </button>
              <button
                onClick={() => navigate('/create-account')}
                className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm lg:text-base"
              >
                <Building2 className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">An Institution</span>
              </button>
            </div>
          </div>
        )}

        {/* Settings and Logout - Matching Figma (Hidden for general accounts) */}
        {userType !== 'general' && userType && (
          <div className="p-3 lg:p-4 border-t border-gray-700 space-y-1">
            {userType === 'institution' ? (
              <>
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm lg:text-base"
                >
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">Settings</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSettingsDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSettingsDropdown && (
                  <div className="ml-4 pl-4 border-l border-gray-600 space-y-1">
                    <button
                      onClick={() => {
                        handleNavigate('/settings')
                        setShowSettingsDropdown(false)
                      }}
                      className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-colors text-sm"
                    >
                      <AtSign className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Account Settings</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => handleNavigate('/settings')}
                className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm lg:text-base"
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm lg:text-base"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}
