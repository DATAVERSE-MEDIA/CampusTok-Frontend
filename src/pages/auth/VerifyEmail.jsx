import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import {useVerifyEmail , useResendVerification} from '../../hooks/useAuth'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const { email,  } = useAuthStore()
  const [code, setCode] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const { mutate: verifyEmail, isPending:isVerifying, error: verifyError } = useVerifyEmail() 
  const { mutate: resendVerification, isPending: isResending } = useResendVerification()

  useEffect(() => {
    if (!email) {
    //  navigate('/signup')
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

   const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '')
    
    if (pastedData.length === 4) {
      const digits = pastedData.split('')
      setCode(digits)
      
      // Focus on last input
      const lastInput = document.getElementById('code-3')
      if (lastInput) lastInput.focus()
    }
  }

  const handleVerify = () => {
    const verificationCode = code.join('')
    
    // Validation
    if (verificationCode.length !== 4) {
      setError('Please enter the complete 4-digit verification code')
      return
    }

    // Check if all are numbers
    if (!/^\d{4}$/.test(verificationCode)) {
      setError('Please enter a valid 4-digit number')
      return
    }

    // Call API
    verifyEmail(
      { token: verificationCode },
      {
        onSuccess: (response) => {
          // Update auth store with verification status and token
          setVerified(true)
          if (response.data?.token) {
            setToken(response.data.token)
          }
          
          // Navigate to next page
          navigate('/pick-profile-picture')
        },
        onError: (error) => {
          setError(
            error.response?.data?.message || 
            'Invalid verification code. Please try again.'
          )
        }
      }
    )
  }

  const handleResend = () => {
    if (!email) {
      setError('No email found. Please return to signup.')
      return
    }

    resendVerification(
      { email },
      {
        onSuccess: () => {
          setSuccessMessage('New verification code sent to your email!')
          setError('')
          
          // Clear success message after 5 seconds
          setTimeout(() => setSuccessMessage(''), 5000)
        },
        onError: (error) => {
          setError(
            error.response?.data?.message || 
            'Failed to resend verification code. Please try again.'
          )
          setSuccessMessage('')
        }
      }
    )
  }

  // const handleVerify = () => {
  //   const verificationCode = code.join('')
  //   if (verificationCode.length !== 4) {
  //     setError('Please enter the complete verification code')
  //     return
  //   }

  //   if (verificationCode === '1234') {
  //     verifyEmail()
  //     navigate('/pick-profile-picture')
  //   } else {
  //     setError('Invalid verification code. Try 1234 for demo.')
  //   }
  // }

  // const handleResend = () => {
  //   alert('Verification code resent to your email!')
  // }

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
           <p className="text-primary font-medium mb-8">{email}</p>

          <div className="flex justify-center gap-3 mb-6"  onPaste={handlePaste}>
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
          {(error || verifyError) && <p className="text-sm text-red-600 text-center mb-4">{error || verifyError?.response?.data?.message || 'Verification failed'}</p>}
          
          {/* Success Message */}
          {successMessage && (
            <p className="text-sm text-green-600 text-center mb-4">
              {successMessage}
            </p>
          )}

          {/* Loading State */}
          {(isVerifying || isResending) && (
            <p className="text-sm text-gray-500 text-center mb-4">
              {isVerifying ? 'Verifying...' : 'Sending new code...'}
            </p>
          )}


          <button
            onClick={handleVerify}
            disabled={isVerifying || isResending}
            className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors mb-4 disabled:cursor-not-allowed "
          >
             {isVerifying ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center">
            <span className="text-gray-600">Didn't receive any code? </span>
            <button
              disabled={isVerifying || isResending || !email}
              onClick={handleResend}
              className="text-primary underline font-medium disabled:cursor-not-allowed"
            >
             {isResending ? 'Sending...' : 'Request again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
