import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const { email, verifyEmail } = useAuthStore()
  const [code, setCode] = useState(['', '', '', ''])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!email) {
      navigate('/signup')
    }
  }, [email, navigate])

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    setError('')
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerify = () => {
    const verificationCode = code.join('')
    if (verificationCode.length !== 4) {
      setError('Please enter the complete verification code')
      return
    }

    if (verificationCode === '1234') {
      verifyEmail()
      navigate('/pick-profile-picture')
    } else {
      setError('Invalid verification code. Try 1234 for demo.')
    }
  }

  const handleResend = () => {
    alert('Verification code resent to your email!')
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Panel - Primary Color */}
      <div className="w-1/3 bg-primary rounded-r-3xl flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">CampusTOK</h1>
      </div>

      {/* Right Panel - Light Gray */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Verify Email</h2>
          <p className="text-gray-600 mb-8">Confirm the code sent to your Email.</p>

          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            ))}
          </div>
          {error && <p className="text-sm text-red-600 text-center mb-4">{error}</p>}
          <p className="text-xs text-gray-500 text-center mb-6">
            Demo: Use code <span className="font-mono font-bold">1234</span>
          </p>

          <button
            onClick={handleVerify}
            className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors mb-4"
          >
            Verify Code
          </button>

          <div className="text-center">
            <span className="text-gray-600">Didn't receive any code? </span>
            <button
              onClick={handleResend}
              className="text-primary underline font-medium"
            >
              Request again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
