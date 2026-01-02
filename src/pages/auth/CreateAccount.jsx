import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { ArrowLeft, ChevronDown } from 'lucide-react'

const institutions = [
  'University of Lagos',
  'Harvard University',
  'MIT',
  'Stanford University',
  'Yale University'
]

const departments = [
  'Computer Science',
  'Civil Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Business Administration',
  'Medicine',
  'Law'
]

const levels = [
  '100 Level',
  '200 Level',
  '300 Level',
  '400 Level',
  '500 Level',
  'Graduate'
]

export default function CreateAccount() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState({
    institution: '',
    matricNumber: '',
    department: '',
    level: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [errors, setErrors] = useState({})
  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false)
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const [showLevelDropdown, setShowLevelDropdown] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required'
    }
    if (!formData.matricNumber.trim()) {
      newErrors.matricNumber = 'Matric number is required'
    }
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required'
    }
    if (!formData.level.trim()) {
      newErrors.level = 'Level is required'
    }
    if (!agreedToTerms) {
      alert('Please agree to Terms & Conditions')
      return
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    login({
      ...formData,
      name: 'Felix Gabriel'
    })
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
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate('/welcome')}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-6 hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Institution Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowInstitutionDropdown(!showInstitutionDropdown)
                  setShowDepartmentDropdown(false)
                  setShowLevelDropdown(false)
                }}
                className={`w-full px-4 py-3 bg-white rounded-lg border ${errors.institution ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between`}
              >
                <span className={formData.institution ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.institution || 'Select Your Institution'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              {showInstitutionDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {institutions.map((inst) => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, institution: inst })
                        setShowInstitutionDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Matric Number */}
            <input
              type="text"
              name="matricNumber"
              value={formData.matricNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white rounded-lg border ${errors.matricNumber ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Matric Number"
            />
            {errors.matricNumber && <p className="text-sm text-red-600">{errors.matricNumber}</p>}

            {/* Department Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowDepartmentDropdown(!showDepartmentDropdown)
                  setShowInstitutionDropdown(false)
                  setShowLevelDropdown(false)
                }}
                className={`w-full px-4 py-3 bg-white rounded-lg border ${errors.department ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between`}
              >
                <span className={formData.department ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.department || 'Your Department / Faculty'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              {showDepartmentDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, department: dept })
                        setShowDepartmentDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Level Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowLevelDropdown(!showLevelDropdown)
                  setShowInstitutionDropdown(false)
                  setShowDepartmentDropdown(false)
                }}
                className={`w-full px-4 py-3 bg-white rounded-lg border ${errors.level ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between`}
              >
                <span className={formData.level ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.level || 'Select Your Level'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              {showLevelDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {levels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, level: level })
                        setShowLevelDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="text-gray-700">
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

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
