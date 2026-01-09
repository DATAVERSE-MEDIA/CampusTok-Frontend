import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { email, verifyEmail, resendVerification, loading } = useAuthStore()
  const [tokenInput, setTokenInput] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // parse token from query string if present
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (token) {
      // do not mutate or generate token on frontend; send token to backend
      (async () => {
        try {
          await verifyEmail(token)
          setSuccess(true)
          // backend should issue session or token; navigate next
          navigate('/pick-profile-picture')
        } catch (err) {
          setError(err?.message || 'Verification failed')
        }
      })()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  const handleVerify = async () => {
    setError('')
    if (!tokenInput) {
      setError('Please enter the verification token you received by email.')
      return
    }
    try {
      await verifyEmail(tokenInput)
      setSuccess(true)
      navigate('/pick-profile-picture')
    } catch (err) {
      setError(err?.message || 'Verification failed')
    }
  }

  const handleResend = async () => {
    setError('')
    if (!email) {
      setError('No email found in session; please sign up or sign in first.')
      return
    }
    try {
      await resendVerification(email)
      alert('Verification token resent to your email if the address exists.')
    } catch (err) {
      setError(err?.message || 'Failed to resend verification token')
    }
  }

  return (
    <div className="min-h-screen flex bg-black">
      <div className="w-1/3 bg-primary rounded-r-3xl flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">CampusTOK</h1>
      </div>

      <div className="flex-1 bg-gray-100 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Verify Email</h2>
          <p className="text-gray-600 mb-8">Enter the verification token sent to your email, or use the link in the email.</p>

          {success && <p className="text-sm text-green-600 mb-4">Email verified successfully.</p>}
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <div className="mb-6">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste verification token"
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors mb-4 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Token'}
          </button>

          <div className="text-center">
            <span className="text-gray-600">Didn't receive a token? </span>
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
