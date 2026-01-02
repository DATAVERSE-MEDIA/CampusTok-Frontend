import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { User, Lock, ArrowLeft, ChevronDown } from 'lucide-react'

const userTypes = [
  { value: 'student', label: 'Student' },
  { value: 'institution', label: 'Institution' },
  { value: 'general', label: 'General User' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleUserTypeSelect = (userType) => {
    setFormData({ ...formData, userType: userType.value })
    setShowUserTypeDropdown(false)
    if (errors.userType) {
      setErrors({ ...errors, userType: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.userType) {
      newErrors.userType = 'Please select a login type'
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    if (!agreedToTerms) {
      alert('Please agree to Terms & Conditions')
      return
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      login({
        username: formData.username,
        name: formData.username,
        userType: formData.userType
      })
      setIsLoading(false)
      
      // Redirect based on user type
      if (formData.userType === 'student') {
        navigate('/')
      } else if (formData.userType === 'institution') {
        navigate('/')
      } else {
        navigate('/')
      }
    }, 1000)
  }

  const handleGoogleLogin = () => {
    // Handle Google login
    alert('Google login functionality will be implemented')
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Panel - Primary Color */}
      <div className="w-2/5 bg-primary rounded-r-3xl flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">CampusTok</h1>
      </div>

      {/* Right Panel - Light Gray */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate('/signup')}
            className="mb-6 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login As Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Login As
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowUserTypeDropdown(!showUserTypeDropdown)
                }}
                className={`w-full px-4 py-3 bg-white rounded-lg border ${errors.userType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between`}
              >
                <span className={formData.userType ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.userType 
                    ? userTypes.find(t => t.value === formData.userType)?.label 
                    : 'Select a category'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              {showUserTypeDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserTypeDropdown(false)}
                  />
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {userTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleUserTypeSelect(type)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {errors.userType && <p className="mt-1 text-sm text-red-600">{errors.userType}</p>}
            </div>

            {/* Username Field */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Username"
              />
            </div>
            {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Password"
              />
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

            {/* Terms & Condition Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                Agree with{' '}
                <button
                  type="button"
                  className="underline text-gray-900"
                  onClick={() => alert('Terms & Conditions')}
                >
                  Terms & Condition
                </button>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 text-gray-500">or</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-xl font-bold">G</span>
            </div>
            <span>Continue with Google</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
