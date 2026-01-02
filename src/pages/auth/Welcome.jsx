import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { GraduationCap, Building2 } from 'lucide-react'

export default function Welcome() {
  const navigate = useNavigate()
  const { login, emailVerified } = useAuthStore()

  if (!emailVerified) {
    navigate('/verify-email')
    return null
  }

  const handleStudent = () => {
    login({ userType: 'student', name: 'Felix' })
    navigate('/create-account')
  }

  const handleInstitution = () => {
    login({ userType: 'institution', name: 'Felix' })
    navigate('/create-account')
  }

  const handleContinueFreely = () => {
    login({ userType: 'visitor', name: 'Felix' })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Panel - Primary Color */}
      <div className="w-2/5 bg-primary rounded-r-3xl flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">CampusTOK</h1>
      </div>

      {/* Right Panel - Light Gray */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-12">
        <div className="w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">HI Felix,</h2>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to CampusTOK</h3>
          <p className="text-gray-600 mb-8">your gateway to campus information, learning and connection.</p>

          <div className="w-32 h-32 mx-auto mb-8 bg-primary-200 rounded-lg flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>

          <h4 className="text-xl font-bold text-gray-900 mb-6">Create Account As</h4>

          <div className="space-y-4 mb-6">
            <button
              onClick={handleStudent}
              className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-5 h-5" />
              Student
            </button>
            <button
              onClick={handleInstitution}
              className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              Institution
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 text-gray-500 font-medium">OR</span>
            </div>
          </div>

          <button
            onClick={handleContinueFreely}
            className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Freely
          </button>
        </div>
      </div>
    </div>
  )
}

