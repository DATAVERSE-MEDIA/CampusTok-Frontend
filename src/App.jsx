import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import Layout from './components/Layout'
import Signup from './pages/auth/Signup'
import VerifyEmail from './pages/auth/VerifyEmail'
import PickProfilePicture from './pages/auth/PickProfilePicture'
import Welcome from './pages/auth/Welcome'
import Login from './pages/auth/Login'
import CreateAccount from './pages/auth/CreateAccount'
import UserTypeSelection from './pages/auth/UserTypeSelection'
import LandingPage from './pages/LandingPage'
import Chatbot from './pages/Chatbot'
import CampusBlog from './pages/CampusBlog'
import Video from './pages/Video'
import Friends from './pages/Friends'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Community from './pages/Community'
import Complaints from './pages/Complaints'
import Notifications from './pages/Notifications'
import StudentPortal from './pages/StudentPortal'
import Settings from './pages/Settings'
import GoogleCallback from './pages/auth/GoogleCallback'
import StudentDashboard from './pages/StudentDashboard'
import InstitutionDashboard from './pages/InstitutionDashboard'
import GeneralDashboard from './pages/GeneralDashboard'
import SentimentBank from './pages/SentimentBank'
import AuthRequired from './pages/AuthRequired'
import { getAuthNoticeForPath } from './utils/authNoticeContent'
import { isUserSessionAuthenticated } from './utils/sessionAuth'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()
  const from = `${location.pathname}${location.search}${location.hash}`

  return isUserSessionAuthenticated(isAuthenticated)
    ? children
    : (
      <Navigate
        to="/auth-required"
        replace
        state={{
          from,
          notice: getAuthNoticeForPath(location.pathname),
        }}
      />
    )
}

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/pick-profile-picture" element={<PickProfilePicture />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth-required" element={<AuthRequired />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/user-type" element={<UserTypeSelection />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      
      {/* Dashboard Routes - Allow guest access without full auth */}
      <Route element={<Layout />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/institution-dashboard" element={<InstitutionDashboard />} />
        <Route path="/general-dashboard" element={<GeneralDashboard />} />
        <Route path="/sentiment-bank" element={<SentimentBank />} />
        <Route path="/blog" element={<CampusBlog />} />
        <Route path="/video" element={<Video />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/search" element={<Search />} />
      </Route>
      
      {/* Main App Routes with Layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/community" element={<Community />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/student-portal" element={<StudentPortal />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
