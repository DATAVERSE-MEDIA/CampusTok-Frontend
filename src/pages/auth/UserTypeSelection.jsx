import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { GraduationCap, Building2 } from 'lucide-react'

export default function UserTypeSelection() {
  const navigate = useNavigate()
  const { login, userType: currentUserType } = useAuthStore()

  const handleUserTypeSelect = (type) => {
    login({
      userType: type,
      email: 'user@example.com',
      name: type === 'student' ? 'Student User' : 'Institution User'
    })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Account Type</h1>
          <p className="text-gray-600">Choose how you want to use Campustok</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleUserTypeSelect('student')}
            className="group p-8 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-500 transition-colors">
              <GraduationCap className="w-10 h-10 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Student</h3>
            <p className="text-gray-600 mb-4">
              Access student resources, connect with peers, join communities, and stay updated with campus events.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Connect with friends and classmates</li>
              <li>• Access campus resources</li>
              <li>• Join student communities</li>
              <li>• View campus blog and videos</li>
            </ul>
          </button>

          <button
            onClick={() => handleUserTypeSelect('institution')}
            className="group p-8 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all text-left"
          >
            <div className="flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-500 transition-colors">
              <Building2 className="w-10 h-10 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Institution</h3>
            <p className="text-gray-600 mb-4">
              Manage your institution's presence, share updates, and engage with the student community.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Manage institution profile</li>
              <li>• Share campus updates</li>
              <li>• Engage with students</li>
              <li>• Access analytics and insights</li>
            </ul>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already selected? You can change this later in settings.
          </p>
        </div>
      </div>
    </div>
  )
}

