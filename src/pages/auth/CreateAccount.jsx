import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { ArrowLeft, ChevronDown, Mail, Building2 } from 'lucide-react'
import { useRegister } from '../../hooks/useAuth'

const institutions = [
  'University of Lagos',
  'Harvard University',
  'MIT',
  'Stanford University',
  'Yale University',
  'Oxford University',
  'Cambridge University',
  'University of Ibadan',
  'Covenant University',
  'Federal University of Technology'
]

export default function CreateAccount() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup } = useAuthStore()
  const { mutate: register, isPending } = useRegister()
  const [formData, setFormData] = useState({
    institution: '',
    email: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [errors, setErrors] = useState({})
  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false)
  const institutionDropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (institutionDropdownRef.current && !institutionDropdownRef.current.contains(event.target)) {
        setShowInstitutionDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleInstitutionSelect = (institution) => {
    setFormData({ ...formData, institution })
    setShowInstitutionDropdown(false)
    if (errors.institution) {
      setErrors({ ...errors, institution: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Institution email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!agreedToTerms) {
      alert('Please agree to Terms & Conditions')
      return
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Prepare registration data for institution
    const reqBody = {
      full_name: formData.institution,
      email: formData.email,
      password: 'temp-password-' + Date.now(), // Temporary password, should be set properly
      role: 'institution'
    }

    // Call registration API
    register(reqBody, {
      onSuccess: (data) => {
        console.log('Institution registration successful:', data)
        // Save email to auth store for OTP verification
        const email = data?.data?.email || data?.email || formData.email
        if (email) {
          signup(email)
        }
        // Navigate to OTP verification screen
        navigate('/verify-email')
      },
      onError: (error) => {
        console.error('Institution registration failed:', error)
        setErrors({
          submit: error?.response?.data?.message || error?.message || 'Registration failed. Please try again.'
        })
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Panel - Primary Color - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 rounded-r-3xl items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center px-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Building2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-white mb-4">CampusTOK</h1>
          <p className="text-lg xl:text-xl text-white/90">Create your institution account to connect with students</p>
        </div>
      </div>

      {/* Right Panel - Light Gray */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate('/signup')}
            className="mb-4 lg:mb-6 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            disabled={isPending}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary-900">CampusTOK</h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Sign Up</h2>
          <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8 text-center">Sign up as an Institution</p>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            {/* Institution Dropdown */}
            <div className="relative" ref={institutionDropdownRef}>
              <button
                type="button"
                onClick={() => setShowInstitutionDropdown(!showInstitutionDropdown)}
                disabled={isPending}
                className={`w-full px-4 py-3 bg-white rounded-lg border text-left ${
                  errors.institution ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className={formData.institution ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.institution || 'Select Your Institution'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showInstitutionDropdown ? 'transform rotate-180' : ''}`} />
              </button>
              {showInstitutionDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {institutions.map((inst) => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => handleInstitutionSelect(inst)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-100 transition-colors text-sm"
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              )}
              {errors.institution && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.institution}</p>
              )}
            </div>

            {/* Institution Email */}
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isPending}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white rounded-lg border text-sm sm:text-base ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Institution Email"
              />
            </div>
            {errors.email && (
              <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.email}</p>
            )}

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={isPending}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 mt-0.5 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700">
                Agree with{' '}
                <button
                  type="button"
                  className="underline text-gray-900 hover:text-gray-700"
                  onClick={() => alert('Terms & Conditions')}
                  disabled={isPending}
                >
                  Terms & Condition
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary-800 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isPending ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
