import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { Mail, Lock, User } from 'lucide-react'

export default function Signup() {
  const navigate = useNavigate()
  const { signup, loading, error } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // build payload according to API UserCreateGeneralModel
      const payload = {
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
      }
      await signup(payload)
      navigate('/verify-email')
    } catch (err) {
      console.error('Signup failed', err)
    }
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Panel - Primary Color */}
      <div className="w-2/5 bg-primary rounded-r-3xl flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">CampusTOK</h1>
      </div>

      {/* Right Panel - Light Gray */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Full Name"
              />
            </div>
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Email"
              />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

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

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="Confirm Password"
              />
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Continue'}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error.message || 'Signup failed'}</p>}
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 text-gray-500">or continue with</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <span className="text-xl font-bold">G</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-black border border-gray-300 flex items-center justify-center hover:bg-gray-900 transition-colors">
              <span className="text-white text-xl">🍎</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-6"
          >
            Explore as Visitor
          </button>

          <div className="text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary underline font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
