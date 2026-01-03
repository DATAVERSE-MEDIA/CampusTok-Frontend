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
// import { useNavigate } from 'react-router-dom'
// import { User, Lock, ArrowLeft, ChevronDown } from 'lucide-react'
// import { useLogin } from '../../hooks/useAuth'
// import React from 'react'

// // Add Google OAuth config - you should store these in environment variables
// const env = (import.meta as any).env
// const GOOGLE_CLIENT_ID = env.VITE_APP_GOOGLE_CLIENT_ID || 'your-google-client-id'
// const GOOGLE_REDIRECT_URI = env.VITE_APP_GOOGLE_REDIRECT_URI || window.location.origin

// const userTypes = [
//   { value: 'student', label: 'Student' },
//   { value: 'institution', label: 'Institution' },
//   { value: 'general', label: 'General User' },
// ]

// export default function Login() {
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     userType: ''
//   })
//   const [agreedToTerms, setAgreedToTerms] = useState(true)
//   const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false)
//   const [errors, setErrors] = useState({})
//   const [isLoading, setIsLoading] = useState(false)
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false)

//   const { mutate: login, isPending, error } = useLogin()

//   // Handle Google OAuth callback
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search)
//     const code = urlParams.get('code')
//     const state = urlParams.get('state')
//     const errorParam = urlParams.get('error')

//     if (errorParam) {
//       console.error('Google OAuth error:', errorParam)
//       alert(`Google login failed: ${errorParam}`)
//       // Clean URL
//       window.history.replaceState({}, document.title, window.location.pathname)
//       return
//     }

//     if (code && state) {
//       handleGoogleCallback(code, state)
//     }
//   }, [])

//   const handleGoogleCallback = async (code: string, state: string) => {
//     setIsGoogleLoading(true)
//     try {
//       // Verify state to prevent CSRF
//       const savedState = localStorage.getItem('oauth_state')
//       if (state !== savedState) {
//         throw new Error('Invalid state parameter')
//       }

//       // Exchange code for token with your backend
//       const response = await fetch('/api/v1/auth/google_token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ code }),
//         credentials: 'include' // Important for cookies
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()

//       if (data.success) {
//         // Handle successful Google login
//         console.log('Google login successful:', data)
        
//         // Store user data if needed
//         if (data.user) {
//           localStorage.setItem('user', JSON.stringify(data.user))
//         }

//         // Redirect based on user type or default
//         // You might want to get userType from the backend response
//         const userType = data.user?.userType || 'general'
        
//         if (userType === 'student') {
//           navigate('/student-dashboard')
//         } else if (userType === 'institution') {
//           navigate('/institution-dashboard')
//         } else {
//           navigate('/dashboard')
//         }
//       } else {
//         throw new Error(data.message || 'Google authentication failed')
//       }
//     } catch (error) {
//       console.error('Google callback error:', error)
//       alert(error.message || 'Failed to authenticate with Google')
//     } finally {
//       setIsGoogleLoading(false)
//       // Clean URL and localStorage
//       window.history.replaceState({}, document.title, window.location.pathname)
//       localStorage.removeItem('oauth_state')
//     }
//   }

//   const handleGoogleLogin = () => {
//     setIsGoogleLoading(true)
    
//     // Generate and store a random state for CSRF protection
//     const state = Math.random().toString(36).substring(2, 15)
//     localStorage.setItem('oauth_state', state)

//     // Construct Google OAuth URL
//     const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    
//     const params = {
//       client_id: GOOGLE_CLIENT_ID,
//       redirect_uri: GOOGLE_REDIRECT_URI,
//       response_type: 'code',
//       scope: 'openid profile email',
//       state: state,
//       access_type: 'offline', // Optional: for refresh tokens
//       prompt: 'consent' // Optional: force consent screen
//     }

//     Object.entries(params).forEach(([key, value]) => {
//       googleAuthUrl.searchParams.append(key, value)
//     })

//     // Redirect to Google OAuth
//     window.location.href = googleAuthUrl.toString()
//   }

//   // Alternative approach if you need to handle Google login without redirect
//   const handleGoogleLoginAlternative = async () => {
//     setIsGoogleLoading(true)
    
//     try {
//       // Load Google Identity Services
//       if (!window.google) {
//         // Dynamically load the Google Identity Services script
//         await new Promise((resolve, reject) => {
//           const script = document.createElement('script')
//           script.src = 'https://accounts.google.com/gsi/client'
//           script.async = true
//           script.defer = true
//           script.onload = resolve
//           script.onerror = reject
//           document.head.appendChild(script)
//         })
//       }

//       // Initialize Google Identity Services
//       const tokenClient = google.accounts.oauth2.initTokenClient({
//         client_id: GOOGLE_CLIENT_ID,
//         scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
//         callback: async (response) => {
//           if (response.error) {
//             console.error('Google auth error:', response)
//             alert('Google login failed')
//             setIsGoogleLoading(false)
//             return
//           }

//           try {
//             // Exchange Google access token with your backend
//             const backendResponse = await fetch('/api/v1/auth/google_token', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ 
//                 token: response.access_token,
//                 code: response.access_token // Some backends might expect this as code
//               }),
//               credentials: 'include'
//             })

//             const data = await backendResponse.json()
            
//             if (data.success) {
//               // Handle successful login
//               const userType = data.user?.userType || 'general'
              
//               if (userType === 'student') {
//                 navigate('/student-dashboard')
//               } else if (userType === 'institution') {
//                 navigate('/institution-dashboard')
//               } else {
//                 navigate('/dashboard')
//               }
//             } else {
//               throw new Error(data.message || 'Google authentication failed')
//             }
//           } catch (error) {
//             console.error('Backend token exchange error:', error)
//             alert('Failed to authenticate with Google')
//           } finally {
//             setIsGoogleLoading(false)
//           }
//         }
//       })

//       // Request token
//       tokenClient.requestAccessToken()
      
//     } catch (error) {
//       console.error('Google login error:', error)
//       setIsGoogleLoading(false)
//       alert('Failed to initialize Google login')
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
          
//           if (formData.userType === 'student') {
//             navigate('/student-dashboard')
//           } else if (formData.userType === 'institution') {
//             navigate('/institution-dashboard')
//           } else {
//             navigate('/dashboard')
//           }
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

//   // Add a helper function to extract user type from email domain
//   const determineUserTypeFromEmail = (email: string): string => {
//     if (email.endsWith('.edu')) {
//       return 'student'
//     }
//     // Add more logic as needed
//     return 'general'
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
//               disabled={isLoading || isGoogleLoading}
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
//             disabled={isGoogleLoading || isLoading}
//             className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isGoogleLoading ? (
//               <span>Authenticating...</span>
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

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, ArrowLeft, ChevronDown } from 'lucide-react'
import { useLogin, useGoogleAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/useAuthStore'
import React from 'react'

const userTypes = [
  { value: 'student', label: 'Student' },
  { value: 'institution', label: 'Institution' },
  { value: 'general', label: 'General User' },
]

export default function Login() {
  const navigate = useNavigate()
  const loginStore = useAuthStore(state => state.login)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(true)
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { mutate: login, isPending } = useLogin()
  const { mutate: googleAuth, isPending: isGoogleAuthPending } = useGoogleAuth()

  // Handle Google OAuth callback
  useEffect(() => {
    const handleGoogleCallback = async (code: string, state: string) => {
      try {
        // Verify state to prevent CSRF
        const savedState = localStorage.getItem('oauth_state')
        if (state !== savedState) {
          throw new Error('Invalid state parameter')
        }

        // Use the mutation hook
        googleAuth(code, {
          onSuccess: (data) => {
            console.log('Google login successful:', data)
            
            // Redirect based on user type or default
            const userType = data.user?.userType || 'general'
            redirectBasedOnUserType(userType)
          },
          onError: (error) => {
            console.error('Google authentication error:', error)
            alert(error.message || 'Failed to authenticate with Google')
          },
          onSettled: () => {
            // Clean URL and localStorage
            window.history.replaceState({}, document.title, window.location.pathname)
            localStorage.removeItem('oauth_state')
          }
        })

      } catch (error) {
        console.error('Google callback error:', error)
        alert(error.message || 'Failed to authenticate with Google')
        
        // Clean URL and localStorage
        window.history.replaceState({}, document.title, window.location.pathname)
        localStorage.removeItem('oauth_state')
      }
    }

    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    const errorParam = urlParams.get('error')

    if (errorParam) {
      console.error('Google OAuth error:', errorParam)
      alert(`Google login failed: ${errorParam}`)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    if (code && state) {
      handleGoogleCallback(code, state)
    }
  }, [googleAuth, navigate])

  // Helper function for redirect logic
  const redirectBasedOnUserType = (userType: string) => {
    if (userType === 'student') {
      navigate('/student-dashboard')
    } else if (userType === 'institution') {
      navigate('/institution-dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  const handleGoogleLogin = () => {
    // Generate and store a random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15)
    localStorage.setItem('oauth_state', state)

    // Construct Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    
    const params = {
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
      redirect_uri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || window.location.origin,
      response_type: 'code',
      scope: 'openid profile email',
      state: state,
      access_type: 'offline',
      prompt: 'select_account' // Shows account selector
    }

    Object.entries(params).forEach(([key, value]) => {
      googleAuthUrl.searchParams.append(key, value)
    })

    // Redirect to Google OAuth
    window.location.href = googleAuthUrl.toString()
  }

  // Alternative: If you want a more comprehensive hook with more options
  const handleGoogleLoginWithLoadingState = () => {
    // Show loading state
    setIsLoading(true)
    
    // Call the main function
    handleGoogleLogin()
    
    // Set a timeout to reset loading if redirect doesn't happen
    setTimeout(() => {
      if (window.location.href.includes('localhost') || window.location.href.includes('yourdomain')) {
        setIsLoading(false)
      }
    }, 5000)
  }

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
            disabled={isLoading || isGoogleAuthPending}
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
                onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}
                disabled={isLoading || isGoogleAuthPending}
                className={`w-full px-4 py-3 bg-white rounded-lg border ${errors.userType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed`}
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
                disabled={isLoading || isGoogleAuthPending}
                className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Username or Email"
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
                disabled={isLoading || isGoogleAuthPending}
                className={`w-full pl-12 pr-4 py-3 bg-white rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
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
                disabled={isLoading || isGoogleAuthPending}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                Agree with{' '}
                <button
                  type="button"
                  className="underline text-gray-900"
                  onClick={() => alert('Terms & Conditions')}
                  disabled={isLoading || isGoogleAuthPending}
                >
                  Terms & Condition
                </button>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleAuthPending}
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
            disabled={isLoading || isGoogleAuthPending}
            className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(isGoogleAuthPending || isLoading) ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary underline font-medium"
                disabled={isLoading || isGoogleAuthPending}
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