import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGoogleAuth } from '../../hooks/useAuth'
import React from 'react'
import {
  clearStoredPostLoginAction,
  clearStoredPostLoginRedirect,
  getStoredPostLoginAction,
  getStoredPostLoginRedirect,
  resolvePostLoginAction,
  resolvePostLoginRedirect,
} from '../../utils/postLoginRedirect'

export default function GoogleCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const { mutate: googleAuth, isPending } = useGoogleAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const state = urlParams.get('state')
      const errorParam = urlParams.get('error')

      console.log('Google Callback triggered with:', { code, state, errorParam })

      if (errorParam) {
        console.error('Google OAuth error:', errorParam)
        alert(`Google login failed: ${errorParam}`)
        navigate('/login', {
          replace: true,
          state: {
            from: getStoredPostLoginRedirect(),
            postLoginAction: getStoredPostLoginAction(),
          },
        })
        return
      }

      if (!code || !state) {
        console.error('Missing code or state parameters')
        alert('Authentication failed: Missing parameters')
        navigate('/login', {
          replace: true,
          state: {
            from: getStoredPostLoginRedirect(),
            postLoginAction: getStoredPostLoginAction(),
          },
        })
        return
      }

      // Verify state to prevent CSRF
      const savedState = localStorage.getItem('oauth_state')
      console.log('State verification:', { savedState, received: state })
      
      if (!savedState) {
        alert('Security error: Session expired. Please try again.')
        navigate('/login', {
          replace: true,
          state: {
            from: getStoredPostLoginRedirect(),
            postLoginAction: getStoredPostLoginAction(),
          },
        })
        return
      }

      if (state !== savedState) {
        alert('Security error: Invalid authentication request.')
        navigate('/login', {
          replace: true,
          state: {
            from: getStoredPostLoginRedirect(),
            postLoginAction: getStoredPostLoginAction(),
          },
        })
        return
      }

      // Exchange code for token
      googleAuth(code, {
        onSuccess: (data) => {
          console.log('Google authentication successful:', data)
          
          // Clean up
          localStorage.removeItem('oauth_state')
          
          // Store user data if needed
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user))
          }

          // Redirect based on user type
          const userType = data.user?.userType || data.user?.role || 'general'
          const redirectTarget = resolvePostLoginRedirect({
            requestedPath: location.state?.from,
            userType,
          })
          const postLoginAction = resolvePostLoginAction(
            location.state?.postLoginAction
          )

          clearStoredPostLoginAction()
          clearStoredPostLoginRedirect()
          navigate(redirectTarget, {
            replace: true,
            state: postLoginAction ? { postLoginAction } : null,
          })
        },
        onError: (error) => {
          console.error('Google authentication error:', error)
          alert(error.response?.data?.message || error.message || 'Authentication failed')
          navigate('/login', {
            replace: true,
            state: {
              from: getStoredPostLoginRedirect(),
              postLoginAction: getStoredPostLoginAction(),
            },
          })
        },
        onSettled: () => {
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      })
    }

    handleCallback()
  }, [googleAuth, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Completing Google Sign In</h2>
        <p className="text-gray-600">Please wait while we authenticate your account...</p>
        {isPending && (
          <p className="text-sm text-gray-500 mt-4">Processing your login credentials...</p>
        )}
      </div>
    </div>
  )
}
