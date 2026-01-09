// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// //import { useAuthStore } from '../../store/useAuthStore'
// import { User, Lock, ArrowLeft, ChevronDown } from 'lucide-react'
// import { useLogin } from '../../hooks/useAuth'

// const userTypes = [
//   { value: 'student', label: 'Student' },
//   { value: 'institution', label: 'Institution' },
//   { value: 'general', label: 'General User' },
// ]

// export default function Login() {
//   const navigate = useNavigate()
//   // const { login } = useAuthStore()
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     userType: ''
//   })
//   const [agreedToTerms, setAgreedToTerms] = useState(true)
//   const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false)
//   const [errors, setErrors] = useState({})
//   const [isLoading, setIsLoading] = useState(false)

//   const { mutate: login, isPending, error } = useLogin()

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: '' })
//     }
//   }

//   const handleUserTypeSelect = (userType) => {
//     setFormData({ ...formData, userType: userType.value })
//     setShowUserTypeDropdown(false)
//     if (errors.userType) {
//       setErrors({ ...errors, userType: '' })
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const newErrors = {}

//     if (!formData.userType) {
//       newErrors.userType = 'Please select a login type'
//     }
//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required'
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required'
//     }
//     if (!agreedToTerms) {
//       alert('Please agree to Terms & Conditions')
//       return
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       return
//     }

//     setIsLoading(true);
//     // Use the login mutation from React Query
//     login(
//       {
//         email: formData.username, // Usually APIs expect email not username
//         password: formData.password,
//         userType: formData.userType
//       },
//       {
//         onSuccess: (data) => {
//           // Handle successful login
//           console.log('Login successful:', data)
          
//           // Redirect based on user type
//           if (formData.userType === 'student') {
//             navigate('/student-dashboard')
//           } else if (formData.userType === 'institution') {
//             navigate('/institution-dashboard')
//           } else {
//             navigate('/')
//           }
//         },
//         onError: (error) => {
//           // Handle login error
//           console.error('Login failed:', error)
//           alert(error?.message || 'Login failed. Please try again.')
//         }
//       }
//     )
  
//     // Simulate API call
//     // setTimeout(() => {
//     //   login({
//     //     username: formData.username,
//     //     name: formData.username,
//     //     userType: formData.userType
//     //   })
//     //   setIsLoading(false)
      
//     //   // Redirect based on user type
//     //   if (formData.userType === 'student') {
//     //     navigate('/')
//     //   } else if (formData.userType === 'institution') {
//     //     navigate('/')
//     //   } else {
//     //     navigate('/')
//     //   }
//     // }, 1000)
//   }

//   const handleGoogleLogin = () => {
//     // Handle Google login
//     alert('Google login functionality will be implemented')
//   }

//   return (
//     <div className="min-h-screen flex bg-black">
//       {/* Left Panel - Primary Color */}
//       <div className="w-2/5 bg-primary rounded-r-3xl flex items-center justify-center">
//         <h1 className="text-6xl font-bold text-white">CampusTok</h1>
//       </div>

//       {/* Right Panel - Light Gray */}
//       <div className="flex-1 bg-gray-100 flex items-center justify-center p-12">
//         <div className="w-full max-w-md">
//           {/* Back Button */}
//           <button
//             onClick={() => navigate('/signup')}
//             className="mb-6 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5 text-gray-700" />
//           </button>

//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Login</h2>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Login As Dropdown */}
//             <div className="relative">
//               <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
//                 Login As
//               </label>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowUserTypeDropdown(!showUserTypeDropdown)
//                 }}
//                 className={`w-full px-4 py-3 bg-white rounded-lg border ${errors.userType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between`}
//               >
//                 <span className={formData.userType ? 'text-gray-900' : 'text-gray-400'}>
//                   {formData.userType 
//                     ? userTypes.find(t => t.value === formData.userType)?.label 
//                     : 'Select a category'}
//                 </span>
//                 <ChevronDown className="w-5 h-5 text-gray-400" />
//               </button>
//               {showUserTypeDropdown && (
//                 <>
//                   <div
//                     className="fixed inset-0 z-10"
//                     onClick={() => setShowUserTypeDropdown(false)}
//                   />
//                   <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
//                     {userTypes.map((type) => (
//                       <button
//                         key={type.value}
//                         type="button"
//                         onClick={() => handleUserTypeSelect(type)}
//                         className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
//                       >
//                         {type.label}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//               {errors.userType && <p className="mt-1 text-sm text-red-600">{errors.userType}</p>}
//             </div>

//             {/* Username Field */}
//             <div className="relative">
//               <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
//                 placeholder="Username"
//               />
//             </div>
//             {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}

//             {/* Password Field */}
//             <div className="relative">
//               <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
//                 placeholder="Password"
//               />
//             </div>
//             {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

//             {/* Terms & Condition Checkbox */}
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 id="terms"
//                 checked={agreedToTerms}
//                 onChange={(e) => setAgreedToTerms(e.target.checked)}
//                 className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
//               />
//               <label htmlFor="terms" className="text-sm text-gray-700">
//                 Agree with{' '}
//                 <button
//                   type="button"
//                   className="underline text-gray-900"
//                   onClick={() => alert('Terms & Conditions')}
//                 >
//                   Terms & Condition
//                 </button>
//               </label>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-gray-100 text-gray-500">or</span>
//             </div>
//           </div>

//           {/* Google Login Button */}
//           <button
//             onClick={handleGoogleLogin}
//             className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
//           >
//             <div className="w-6 h-6 flex items-center justify-center">
//               <span className="text-xl font-bold">G</span>
//             </div>
//             <span>Continue with Google</span>
//           </button>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Don't have an account?{' '}
//               <button
//                 onClick={() => navigate('/signup')}
//                 className="text-primary underline font-medium"
//               >
//                 Sign up
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



// import { useState, useEffect } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom' // Add useLocation
// import { User, Lock, ArrowLeft, ChevronDown } from 'lucide-react'
// import { useLogin, useGoogleAuth } from '../../hooks/useAuth'
// import React from 'react'

// const userTypes = [
//   { value: 'student', label: 'Student' },
//   { value: 'institution', label: 'Institution' },
//   { value: 'general', label: 'General User' },
// ]

// // CRITICAL: Fix the redirect URI to match Google Cloud Console
// const env = (import.meta as any).env
// const GOOGLE_CLIENT_ID = env.VITE_APP_GOOGLE_CLIENT_ID || '742970125508-huruco1fq1l11jb0k8kikvsvdb24bkhq.apps.googleusercontent.com'
// const GOOGLE_REDIRECT_URI = `${window.location.origin}/auth/google/callback` // FIXED

// export default function Login() {
//   const navigate = useNavigate()
//   const location = useLocation() // Add location hook
  
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     userType: ''
//   })
//   const [agreedToTerms, setAgreedToTerms] = useState(true)
//   const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false)
//   const [errors, setErrors] = useState({})
//   const [isLoading, setIsLoading] = useState(false)
//   const [googleAuthInProgress, setGoogleAuthInProgress] = useState(false)

//   const { mutate: login, isPending } = useLogin()
//   const { mutate: googleAuth, isPending: isGoogleAuthPending } = useGoogleAuth()

//   // Check if we're on the callback route
//   const isCallbackRoute = location.pathname === '/auth/google/callback'

//   // Handle Google callback when on callback route
//   useEffect(() => {
//     console.log('Login Component mounted')
//     console.log('Current URL:', window.location.href)
//     console.log('Redirect URI configured:', GOOGLE_REDIRECT_URI)
//     console.log('Current path:', location.pathname)
//     console.log('Is callback route?', isCallbackRoute)

//     if (isCallbackRoute) {
//       handleGoogleCallback()
//     }
//   }, [isCallbackRoute, location.pathname])

//   const handleGoogleCallback = async () => {
//     console.log('handleGoogleCallback triggered - on callback route')
    
//     const urlParams = new URLSearchParams(window.location.search)
//     const code = urlParams.get('code')
//     const state = urlParams.get('state')
//     const errorParam = urlParams.get('error')
//     const errorDescription = urlParams.get('error_description')

//     console.log('URL parameters:', { 
//       code, 
//       state, 
//       errorParam, 
//       errorDescription,
//       fullSearch: window.location.search
//     })

//     if (errorParam) {
//       console.error('Google OAuth error:', { errorParam, errorDescription })
//       alert(`Google login failed: ${errorDescription || errorParam}`)
//       // Redirect back to login page
//       navigate('/login', { replace: true })
//       return
//     }

//     if (!code || !state) {
//       console.error('Missing code or state parameters')
//       console.log('Full URL search:', window.location.search)
//       // Redirect back to login page
//       navigate('/login', { replace: true })
//       return
//     }

//     try {
//       // Verify state to prevent CSRF
//       const savedState = localStorage.getItem('oauth_state')
//       console.log('Saved state:', savedState)
      
//       if (!savedState) {
//         throw new Error('No OAuth state found. The login session may have expired.')
//       }

//       if (state !== savedState) {
//         console.error('State mismatch:', { received: state, saved: savedState })
//         throw new Error('Security error: Invalid state parameter.')
//       }

//       setGoogleAuthInProgress(true)

//       // Use the mutation hook
//       googleAuth(code, {
//         onSuccess: (data) => {
//           console.log('Google login successful:', data)
          
//           // Store user data if needed
//           if (data.user) {
//             localStorage.setItem('user', JSON.stringify(data.user))
//           }

//           // Clean up
//           localStorage.removeItem('oauth_state')
          
//           // Clean URL
//           window.history.replaceState({}, document.title, '/')
          
//           // Redirect based on user type or default
//           const userType = data.user?.userType || 'general'
          
//           if (userType === 'student') {
//             navigate('/student-dashboard', { replace: true })
//           } else if (userType === 'institution') {
//             navigate('/institution-dashboard', { replace: true })
//           } else {
//             navigate('/dashboard', { replace: true })
//           }
//         },
//         onError: (error) => {
//           console.error('Google authentication error:', error)
//           alert(error.response?.data?.message || error.message || 'Failed to authenticate with Google')
//           navigate('/login', { replace: true })
//         },
//         onSettled: () => {
//           setGoogleAuthInProgress(false)
//         }
//       })

//     } catch (error) {
//       console.error('Google callback processing error:', error)
//       alert(error.message || 'Failed to process Google authentication')
//       navigate('/login', { replace: true })
//       setGoogleAuthInProgress(false)
//     }
//   }

//   const handleGoogleLogin = () => {
//     // Prevent multiple clicks
//     if (googleAuthInProgress || isGoogleAuthPending) {
//       console.log('Google auth already in progress, ignoring click')
//       return
//     }
    
//     console.log('=== Starting Google OAuth Flow ===')
//     console.log('Client ID:', GOOGLE_CLIENT_ID)
//     console.log('Redirect URI:', GOOGLE_REDIRECT_URI)
//     console.log('This MUST match Google Cloud Console exactly!')

//     // Generate and store a random state for CSRF protection
//     const state = Math.random().toString(36).substring(2, 15) + 
//                   Math.random().toString(36).substring(2, 15)
    
//     localStorage.setItem('oauth_state', state)
//     console.log('Generated and saved state:', state)

//     // Set flag to track auth in progress
//     setGoogleAuthInProgress(true)

//     // Construct Google OAuth URL with proper parameters
//     const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    
//     // CRITICAL: These parameters must match Google Cloud Console exactly
//     const params = {
//       client_id: GOOGLE_CLIENT_ID,
//       redirect_uri: GOOGLE_REDIRECT_URI, // This must be EXACTLY: http://localhost:3000/auth/google/callback
//       response_type: 'code',
//       scope: 'openid profile email',
//       state: state,
//       access_type: 'online',
//       prompt: 'consent', // Show consent screen
//       include_granted_scopes: 'true'
//     }

//     Object.entries(params).forEach(([key, value]) => {
//       googleAuthUrl.searchParams.append(key, value)
//     })

//     console.log('=== Final Google OAuth URL ===')
//     console.log(googleAuthUrl.toString())
//     console.log('=== Redirecting to Google OAuth ===')
    
//     // Store timestamp to detect if user cancelled
//     localStorage.setItem('oauth_start_time', Date.now().toString())
    
//     // Redirect to Google OAuth
//     window.location.href = googleAuthUrl.toString()
//   }

//   // Check if user cancelled OAuth (optional)
//   useEffect(() => {
//     const checkForCancelledOAuth = () => {
//       const startTime = localStorage.getItem('oauth_start_time')
//       if (startTime && googleAuthInProgress && !isCallbackRoute) {
//         const elapsed = Date.now() - parseInt(startTime)
//         if (elapsed > 30000) { // 30 seconds
//           console.log('OAuth may have been cancelled by user')
//           setGoogleAuthInProgress(false)
//           localStorage.removeItem('oauth_start_time')
//         }
//       }
//     }

//     const interval = setInterval(checkForCancelledOAuth, 5000)
//     return () => clearInterval(interval)
//   }, [googleAuthInProgress, isCallbackRoute])

//   const redirectBasedOnUserType = (userType: string) => {
//     if (userType === 'student') {
//       navigate('/student-dashboard')
//     } else if (userType === 'institution') {
//       navigate('/institution-dashboard')
//     } else {
//       navigate('/dashboard')
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: '' })
//     }
//   }

//   const handleUserTypeSelect = (userType) => {
//     setFormData({ ...formData, userType: userType.value })
//     setShowUserTypeDropdown(false)
//     if (errors.userType) {
//       setErrors({ ...errors, userType: '' })
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const newErrors = {}

//     if (!formData.userType) {
//       newErrors.userType = 'Please select a login type'
//     }
//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required'
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required'
//     }
//     if (!agreedToTerms) {
//       alert('Please agree to Terms & Conditions')
//       return
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       return
//     }

//     setIsLoading(true)
    
//     login(
//       {
//         email: formData.username,
//         password: formData.password,
//         userType: formData.userType
//       },
//       {
//         onSuccess: (data) => {
//           console.log('Login successful:', data)
//           redirectBasedOnUserType(formData.userType)
//         },
//         onError: (error) => {
//           console.error('Login failed:', error)
//           alert(error?.message || 'Login failed. Please try again.')
//         },
//         onSettled: () => {
//           setIsLoading(false)
//         }
//       }
//     )
//   }

//   // If we're on the callback route, show loading screen
//   if (isCallbackRoute) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//         <div className="text-center max-w-md p-8">
//           <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-3">Completing Google Sign In</h2>
//           <p className="text-gray-600 mb-4">Please wait while we authenticate your account...</p>
//           {googleAuthInProgress ? (
//             <p className="text-sm text-gray-500 animate-pulse">Processing authentication...</p>
//           ) : (
//             <p className="text-sm text-gray-500">Redirecting...</p>
//           )}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex bg-black">
//       {/* Left Panel - Primary Color */}
//       <div className="w-2/5 bg-primary rounded-r-3xl flex items-center justify-center">
//         <h1 className="text-6xl font-bold text-white">CampusTok</h1>
//       </div>

//       {/* Right Panel - Light Gray */}
//       <div className="flex-1 bg-gray-100 flex items-center justify-center p-12">
//         <div className="w-full max-w-md">
//           {/* Debug info - keep for now, remove in production */}
//           <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
//             <div className="font-semibold mb-1">Debug Info:</div>
//             <div>Current URL: {window.location.href}</div>
//             <div className="text-green-600 font-semibold">
//               Redirect URI: {GOOGLE_REDIRECT_URI}
//             </div>
//             <div className="text-sm mt-1">
//               This must match Google Cloud Console exactly!
//             </div>
//           </div>

//           {/* Back Button */}
//           <button
//             onClick={() => navigate('/signup')}
//             className="mb-6 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
//             disabled={isLoading || googleAuthInProgress}
//           >
//             <ArrowLeft className="w-5 h-5 text-gray-700" />
//           </button>

//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Login</h2>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Login As Dropdown */}
//             <div className="relative">
//               <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
//                 Login As
//               </label>
//               <button
//                 type="button"
//                 onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}
//                 disabled={isLoading || googleAuthInProgress}
//                 className={`w-full px-4 py-3 bg-white rounded-lg border ${errors.userType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed`}
//               >
//                 <span className={formData.userType ? 'text-gray-900' : 'text-gray-400'}>
//                   {formData.userType 
//                     ? userTypes.find(t => t.value === formData.userType)?.label 
//                     : 'Select a category'}
//                 </span>
//                 <ChevronDown className="w-5 h-5 text-gray-400" />
//               </button>
//               {showUserTypeDropdown && (
//                 <>
//                   <div
//                     className="fixed inset-0 z-10"
//                     onClick={() => setShowUserTypeDropdown(false)}
//                   />
//                   <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
//                     {userTypes.map((type) => (
//                       <button
//                         key={type.value}
//                         type="button"
//                         onClick={() => handleUserTypeSelect(type)}
//                         className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
//                       >
//                         {type.label}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//               {errors.userType && <p className="mt-1 text-sm text-red-600">{errors.userType}</p>}
//             </div>

//             {/* Username Field */}
//             <div className="relative">
//               <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 disabled={isLoading || googleAuthInProgress}
//                 className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
//                 placeholder="Username or Email"
//               />
//             </div>
//             {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}

//             {/* Password Field */}
//             <div className="relative">
//               <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 disabled={isLoading || googleAuthInProgress}
//                 className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
//                 placeholder="Password"
//               />
//             </div>
//             {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

//             {/* Terms & Condition Checkbox */}
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 id="terms"
//                 checked={agreedToTerms}
//                 onChange={(e) => setAgreedToTerms(e.target.checked)}
//                 disabled={isLoading || googleAuthInProgress}
//                 className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
//               />
//               <label htmlFor="terms" className="text-sm text-gray-700">
//                 Agree with{' '}
//                 <button
//                   type="button"
//                   className="underline text-gray-900"
//                   onClick={() => alert('Terms & Conditions')}
//                   disabled={isLoading || googleAuthInProgress}
//                 >
//                   Terms & Condition
//                 </button>
//               </label>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={isLoading || googleAuthInProgress}
//               className="w-full bg-primary hover:bg-primary-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-gray-100 text-gray-500">or</span>
//             </div>
//           </div>

//           {/* Google Login Button */}
//           <button
//             onClick={handleGoogleLogin}
//             disabled={isLoading || googleAuthInProgress}
//             className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {googleAuthInProgress ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
//                 <span>Redirecting to Google...</span>
//               </>
//             ) : (
//               <>
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path
//                     fill="currentColor"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 <span>Continue with Google</span>
//               </>
//             )}
//           </button>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Don't have an account?{' '}
//               <button
//                 onClick={() => navigate('/signup')}
//                 className="text-primary underline font-medium"
//                 disabled={isLoading || googleAuthInProgress}
//               >
//                 Sign up
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, ArrowLeft, ChevronDown } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useLogin, useGoogleAuth } from '../../hooks/useAuth'
import React from 'react'

const userTypes = [
  { value: 'student', label: 'Student' },
  { value: 'institution', label: 'Institution' },
  { value: 'general', label: 'General User' },
]

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false)

  const { mutate: login, isPending } = useLogin()
  const { mutate: googleAuth, isPending: isGoogleAuthPending } = useGoogleAuth()

  // Update your useGoogleAuth hook to accept JWT token
  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential
    
    if (!token) {
      console.error('No token received from Google')
      return
    }

    setGoogleAuthLoading(true)
    
    try {
      googleAuth(token, {
        onSuccess: (data) => {
          console.log('Google authentication successful:', data)
          
          // Store user data if needed
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user))
          }

          // Redirect based on user type
          const userType = data.user?.userType || 'general'
          
          if (userType === 'student') {
            navigate('/student-dashboard', { replace: true })
          } else if (userType === 'institution') {
            navigate('/institution-dashboard', { replace: true })
          } else {
            navigate('/dashboard', { replace: true })
          }
        },
        onError: (error) => {
          console.error('Google backend auth error:', error)
          alert(error.response?.data?.message || 'Authentication failed')
        },
        onSettled: () => {
          setGoogleAuthLoading(false)
        }
      })
    } catch (error) {
      console.error('Google auth error:', error)
      setGoogleAuthLoading(false)
    }
  }

  const handleGoogleError = () => {
    console.log('Google login failed')
    alert('Google authentication failed. Please try again.')
  }

  // Rest of your existing functions...
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
    
    login(
      {
        email: formData.username,
        password: formData.password,
        userType: formData.userType
      },
      {
        onSuccess: (data) => {
          console.log('Login successful:', data)
          redirectBasedOnUserType(formData.userType)
        },
        onError: (error) => {
          console.error('Login failed:', error)
          alert(error?.message || 'Login failed. Please try again.')
        },
        onSettled: () => {
          setIsLoading(false)
        }
      }
    )
  }

  const redirectBasedOnUserType = (userType: string) => {
    if (userType === 'student') {
      navigate('/student-dashboard')
    } else if (userType === 'institution') {
      navigate('/institution-dashboard')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black">
      {/* Left Panel - Primary Color - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-2/5 bg-primary rounded-r-3xl items-center justify-center">
        <h1 className="text-4xl xl:text-6xl font-bold text-white px-4">CampusTok</h1>
      </div>

      {/* Right Panel - Light Gray */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate('/signup')}
            className="mb-4 lg:mb-6 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            disabled={isLoading || googleAuthLoading}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <h1 className="text-3xl font-bold text-primary">CampusTok</h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 text-center">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login As Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Login As
              </label>
              <button
                type="button"
                onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}
                disabled={isLoading || googleAuthLoading}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-lg border text-sm sm:text-base ${errors.userType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className={formData.userType ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.userType 
                    ? userTypes.find(t => t.value === formData.userType)?.label 
                    : 'Select a category'}
                </span>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              </button>
              {showUserTypeDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserTypeDropdown(false)}
                  />
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {userTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleUserTypeSelect(type)}
                        className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg text-sm sm:text-base"
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {errors.userType && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.userType}</p>}
            </div>

            {/* Username Field */}
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading || googleAuthLoading}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white rounded-lg border text-sm sm:text-base ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Username or Email"
              />
            </div>
            {errors.username && <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.username}</p>}

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading || googleAuthLoading}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white rounded-lg border text-sm sm:text-base ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Password"
              />
            </div>
            {errors.password && <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.password}</p>}

            {/* Terms & Condition Checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={isLoading || googleAuthLoading}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 mt-0.5 flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700">
                Agree with{' '}
                <button
                  type="button"
                  className="underline text-gray-900"
                  onClick={() => alert('Terms & Conditions')}
                  disabled={isLoading || googleAuthLoading}
                >
                  Terms & Condition
                </button>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || googleAuthLoading}
              className="w-full bg-primary hover:bg-primary-800 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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

          {/* Google Login Button - Using react-oauth/google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              text="continue_with"
              shape="rectangular"
              width="400"
              theme="outline"
              logo_alignment="left"
              context="signin"
              ux_mode="popup"
              useOneTap={false}
              disabled={isLoading || googleAuthLoading}
            />
          </div>

          {/* Loading indicator for Google auth */}
          {googleAuthLoading && (
            <div className="mt-4 text-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Authenticating with Google...</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary underline font-medium"
                disabled={isLoading || googleAuthLoading}
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