import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { User, GraduationCap, Building2 } from 'lucide-react'

export default function PickProfile() {
  const navigate = useNavigate()
  const { selectProfile, emailVerified } = useAuthStore()

  // Redirect if email not verified
  if (!emailVerified) {
    navigate('/verify-email')
    return null
  }

  const handleProfileSelect = (profileType) => {
    selectProfile(profileType)
    navigate('/create-account')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pick Your Profile</h1>
          <p className="text-gray-600">Choose the type of account you want to create</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleProfileSelect('student')}
            className="group p-8 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-500 transition-colors">
              <GraduationCap className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Student</h3>
            <p className="text-gray-600">
              Join as a student to connect with peers, access resources, and engage with your campus community.
            </p>
          </button>

          <button
            onClick={() => handleProfileSelect('institution')}
            className="group p-8 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-500 transition-colors">
              <Building2 className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Institution</h3>
            <p className="text-gray-600">
              Create an institutional account to manage your campus presence, share updates, and connect with students.
            </p>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  )
}

