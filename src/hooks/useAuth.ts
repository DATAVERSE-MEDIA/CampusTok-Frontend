// // hooks/useAuth.ts
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { apiClient, authApi } from '../api'
// import {mockAuthApi} from '../api/mockApi'
// import { useAuthStore } from '../store/useAuthStore'
// import { useEffect } from 'react'

// // Auth keys for query cache
// export const authKeys = {
//   all: ['auth'] as const,
//   profile: () => [...authKeys.all, 'profile'] as const,
// }

// // Authentication hooks
// export const useLogin = () => {
//   const queryClient = useQueryClient()
//   const loginStore = useAuthStore(state => state.login)

//   return useMutation({
//     mutationFn: (credentials: { email: string; password: string; userType?: string }) => authApi.login(credentials).then(res => res.data),
//     onSuccess: (data, variables) => {
//       // Update Zustand store with user data including userType
//       // Preserve userType from credentials if not in response
//       const userData = {
//         ...data.user,
//         userType: data.user?.userType || data.user?.role || variables.userType || 'general',
//         role: data.user?.role || data.user?.userType || variables.userType || 'general',
//         isAuthenticated: true
//       }
//       loginStore(userData)
      
//       // Save token (adjust for React Native)
//       if (data.token) {
//         localStorage.setItem('auth_token', data.token)
//       }
      
//       // Invalidate user profile query
//       queryClient.invalidateQueries({ queryKey: authKeys.profile() })
//     },
//     onError: (error: any) => {
//       console.error('Login mutation error:', error)
//       // You can handle specific error types here if needed
//       // The error will be available in the mutation result for the component to use
//     }
//   })
// }

// export const useRegister = () => {
//   const signupStore = useAuthStore(state => state.signup)

//   return useMutation({
//     mutationFn: (userData: {full_name:string, email: string; password: string; role?: string }) =>
//        authApi.register(userData).then(res => res.data),
//     onSuccess: (data: any) => {
//       console.log('Registration response:', data)
//       // Extract email from response (could be in data.email, data.data.email, or use the request email)
//       const email = data?.data?.email || data?.email || data?.user?.email
//       if (email) {
//         signupStore(email)
//       } else {
//         // Fallback: use email from the request (this is handled in the component)
//         console.warn('Email not found in registration response, will use request email')
//       }
//     },
//     onError: (error: any) => {
//       console.error('Registration error:', error)
//       // The API layer already handles dummy responses, so if we get here,
//       // it's a real error that should be displayed
//       throw error
//     }
//   })
// }

// export const useVerifyEmail = () => {
//   const verifyEmailStore = useAuthStore(state => state.verifyEmail)
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (token: string | { token: string }) => {
//       // Handle both string and object parameter formats
//       const verificationToken = typeof token === 'string' ? token : token.token
      
//       return authApi.verifyEmail(verificationToken).then(res => res.data).catch((error: any) => {
//         // For testing: return dummy success response if endpoint doesn't exist
//         if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
//           // Check if token matches a test token (for testing purposes)
//           const testTokens = ['1234', '0000', '1111', '9999']
//           if (testTokens.includes(verificationToken)) {
//             return Promise.resolve({
//               status: true,
//               message: "Email verified successfully",
//               data: {
//                 verified: true,
//                 token: 'dummy-verified-token-' + Date.now()
//               }
//             })
//           } else {
//             // Return error for invalid test token
//             return Promise.reject(new Error('Invalid verification code. Try 1234, 0000, 1111, or 9999 for testing.'))
//           }
//         }
//         throw error
//       })
//     },
//     onSuccess: (data: any) => {
//       // Mark email as verified
//       verifyEmailStore()
      
//       // Save token if provided
//       if (data?.data?.token || data?.token) {
//         localStorage.setItem('auth_token', data?.data?.token || data?.token)
//       }
      
//       // Invalidate queries
//       queryClient.invalidateQueries({ queryKey: authKeys.profile() })
//     },
//   })
// }

// export const useLogout = () => {
//   const logoutStore = useAuthStore(state => state.logout)
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: () => authApi.logout().then(res => res.data),
//     onSuccess: () => {
//       logoutStore()
//       localStorage.removeItem('auth_token')
//       queryClient.clear() // Clear all queries on logout
//     },
//   })
// }

// export const useProfile = () => {
//   const isAuthenticated = useAuthStore(state => state.isAuthenticated)

//   return useQuery({
//     queryKey: authKeys.profile(),
//     queryFn: () => authApi.getProfile().then(res => res.data),
//     enabled: isAuthenticated, // Only fetch if authenticated
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     retry: 1,
//   })
// }

// // Custom hook to sync profile with Zustand
// export const useProfileWithSync = () => {
//   const { user, setUser } = useAuthStore()
//   const query = useProfile()

//   useEffect(() => {
//     if (query.data && query.isSuccess && !user) {
//       setUser(query.data)
//     }
//   }, [query.data, query.isSuccess, user, setUser])

//   return query
// }

// export const useUpdateProfile = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (profileData: any) =>
//       authApi.updateProfile(profileData).then(res => res.data),
//     onSuccess: (data) => {
//       // Update profile in cache
//       queryClient.setQueryData(authKeys.profile(), data)
//     },
//     onError: (error) => {
//       console.error('Profile update failed:', error)
//     },
//   })
// }

// export const useForgotPassword = () => {
//   return useMutation({
//     mutationFn: (email: string) =>
//       authApi.forgotPassword(email).then(res => res.data),
//   })
// }

// export const useResetPassword = () => {
//   return useMutation({
//     mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
//       authApi.resetPassword(token, newPassword).then(res => res.data),
//   })
// }

// export const useResendVerification = () => {
//   return useMutation({
//     mutationFn: (data: { email: string }) => 
//       authApi.resendVerification(data).then(res => res.data)
//   })
// }

// // hooks/useAuth.ts - Add this hook
// export const useGoogleAuth = () => {
//   const queryClient = useQueryClient()
//   const loginStore = useAuthStore(state => state.login)

//   return useMutation({
//     mutationFn: (code: string) =>
//        authApi.googleAuth(code).then(res => res.data),
//     onSuccess: (data) => {
//       // Update Zustand store
//       loginStore(data.user)
      
//       // Save token if provided
//       if (data.token) {
//         localStorage.setItem('auth_token', data.token)
//       }
      
//       // Invalidate user profile query
//       queryClient.invalidateQueries({ queryKey: authKeys.profile() })
      
//       return data
//     },
//     onError: (error) => {
//       console.error('Google authentication failed:', error)
//       console.error('Error details:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         url: error.config?.url
//       })
//       throw error
//     }
//   })
// }


// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, authApi } from '../api'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect } from 'react'

// Auth keys for query cache
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
  userProfile: (userId?: string) => [...authKeys.all, 'user-profile', userId] as const,
}

// Types for the response
export interface CurrentUserResponse {
  user: {
    full_name: string
    email: string
    id: string
    is_verified: boolean
    role: 'institution' | 'student' | 'general' | 'admin'
    campustalk_access_token: string
    token_type: string
  }
  profile_picture: string | null
  institution_profile?: {
    id: string
    institution_name: string
    institution_email: string
  }
  student_profile?: {
    id: string
    institution_name: string
    institution_id: string
    department: string
    educational_level: string
    faculty: string
    matric_number: string
  }
}

const getAuthPayload = (data: any) => {
  if (data?.data && typeof data.data === 'object') {
    return data.data
  }

  return data || {}
}

const getAuthUser = (data: any) => {
  const payload = getAuthPayload(data)

  if (payload?.user && typeof payload.user === 'object') {
    return payload.user
  }

  return payload
}

const getPrimaryAuthToken = (data: any) => {
  const payload = getAuthPayload(data)
  const user = getAuthUser(data)

  return (
    data?.token ||
    data?.access_token ||
    payload?.token ||
    payload?.access_token ||
    user?.token ||
    user?.access_token ||
    null
  )
}

const getCampusTalkAuthToken = (data: any) => {
  const payload = getAuthPayload(data)
  const user = getAuthUser(data)

  return (
    data?.campustalk_access_token ||
    payload?.campustalk_access_token ||
    user?.campustalk_access_token ||
    null
  )
}

const getNormalizedAppUserType = (
  rawRole: string | undefined,
  fallbackUserType?: string,
  currentUserData?: CurrentUserResponse | any
) => {
  if (['institution', 'student', 'general'].includes(String(rawRole))) {
    return rawRole as 'institution' | 'student' | 'general'
  }

  if (currentUserData?.institution_profile) {
    return 'institution'
  }

  if (currentUserData?.student_profile) {
    return 'student'
  }

  if (['institution', 'student', 'general'].includes(String(fallbackUserType))) {
    return fallbackUserType as 'institution' | 'student' | 'general'
  }

  return 'general'
}

// Authentication hooks
export const useLogin = () => {
  const queryClient = useQueryClient()
  const loginStore = useAuthStore(state => state.login)
  const updateUser = useAuthStore(state => state.updateUser)

  return useMutation({
    mutationFn: (credentials: { email: string; password: string; userType?: string }) => 
      authApi.login(credentials).then(res => res.data),
    onSuccess: async (data, variables) => {
      const responseUser = getAuthUser(data)
      let campustalkToken = getCampusTalkAuthToken(data)
      const normalizedUserType =
        responseUser?.userType ||
        (['student', 'institution', 'general'].includes(responseUser?.role)
          ? responseUser.role
          : undefined) ||
        variables.userType ||
        'general'

      const userData = {
        ...responseUser,
        backend_role: responseUser?.role,
        userType: normalizedUserType,
        role: normalizedUserType,
        isAuthenticated: true,
        ...(campustalkToken
          ? { campustalk_access_token: campustalkToken }
          : {}),
      }
      loginStore(userData)
      
      const authToken = getPrimaryAuthToken(data)

      if (authToken) {
        localStorage.setItem('auth_token', authToken)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
      }

      if (!campustalkToken && authToken) {
        try {
          const currentUserResponse = await apiClient.get('/auth/users/me')
          campustalkToken = getCampusTalkAuthToken(currentUserResponse.data)

          if (campustalkToken) {
            updateUser({
              campustalk_access_token: campustalkToken,
              token_type:
                currentUserResponse.data?.user?.token_type ||
                currentUserResponse.data?.token_type,
            })
          }
        } catch (currentUserError) {
          console.warn('Unable to backfill Campus Talk token from current user:', currentUserError)
        }
      }

      if (campustalkToken) {
        localStorage.setItem('campustalk_access_token', campustalkToken)
      } else {
        localStorage.removeItem('campustalk_access_token')
      }
      
      // Invalidate user profile queries
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
    onError: (error: any) => {
      console.error('Login mutation error:', error)
    }
  })
}

export const useRegister = () => {
  const signupStore = useAuthStore(state => state.signup)

  return useMutation({
    mutationFn: (userData: {full_name:string, email: string; password: string; role?: string }) =>
      authApi.register(userData).then(res => res.data),
    onSuccess: (data: any) => {
      const email = data?.data?.email || data?.email || data?.user?.email
      if (email) {
        signupStore(email)
      } else {
        console.warn('Email not found in registration response')
      }
    },
    onError: (error: any) => {
      console.error('Registration error:', error)
      throw error
    }
  })
}

export const useVerifyEmail = () => {
  const verifyEmailStore = useAuthStore(state => state.verifyEmail)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string | { token: string }) => {
      const verificationToken = typeof token === 'string' ? token : token.token
      
      return authApi.verifyEmail(verificationToken).then(res => res.data).catch((error: any) => {
        if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
          const testTokens = ['1234', '0000', '1111', '9999']
          if (testTokens.includes(verificationToken)) {
            return Promise.resolve({
              status: true,
              message: "Email verified successfully",
              data: {
                verified: true,
                token: 'dummy-verified-token-' + Date.now()
              }
            })
          } else {
            return Promise.reject(new Error('Invalid verification code. Try 1234, 0000, 1111, or 9999 for testing.'))
          }
        }
        throw error
      })
    },
    onSuccess: (data: any) => {
      verifyEmailStore()
      
      if (data?.data?.token || data?.token) {
        const token = data?.data?.token || data?.token
        localStorage.setItem('auth_token', token)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
    },
  })
}

export const useLogout = () => {
  const logoutStore = useAuthStore(state => state.logout)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout().then(res => res.data),
    onSuccess: () => {
      logoutStore()
      localStorage.removeItem('auth_token')
      localStorage.removeItem('campustalk_access_token')
      delete apiClient.defaults.headers.common['Authorization']
      queryClient.clear()
      queryClient.removeQueries()
    },
  })
}

// New: Get current user with full profile
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore()
  const hasStoredToken =
    typeof window !== 'undefined' && Boolean(window.localStorage.getItem('auth_token'))
  
  return useQuery<CurrentUserResponse>({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const response = await apiClient.get('/auth/users/me');
      return response.data
    },
    enabled: isAuthenticated || hasStoredToken,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

// Legacy: Get basic profile (for backward compatibility)
export const useProfile = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authApi.getProfile().then(res => res.data),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

// Hook to sync current user with Zustand store
export const useCurrentUserWithSync = () => {
  const { setUser, user } = useAuthStore()
  const query = useCurrentUser()

  useEffect(() => {
    if (query.data && query.isSuccess) {
      const normalizedUserType = getNormalizedAppUserType(
        query.data.user.role,
        user?.userType || user?.role,
        query.data
      )

      const userData = {
        id: query.data.user.id,
        email: query.data.user.email,
        name: query.data.user.full_name,
        full_name: query.data.user.full_name,
        role: normalizedUserType,
        userType: normalizedUserType,
        backend_role: query.data.user.role,
        is_verified: query.data.user.is_verified,
        isAuthenticated: true,
        profile_picture: query.data.profile_picture,
        institution_profile: query.data.institution_profile,
        student_profile: query.data.student_profile,
        campustalk_access_token: query.data.user.campustalk_access_token,
        token_type: query.data.user.token_type
      }
      
      // Only update if data has changed
      if (JSON.stringify(user) !== JSON.stringify(userData)) {
        setUser(userData)
      }
      
      // Update API client token if available
      if (query.data.user.campustalk_access_token) {
        localStorage.setItem('campustalk_access_token', query.data.user.campustalk_access_token)
      }
    }
  }, [query.data, query.isSuccess, setUser, user])

  return query
}

// Hook to check if user has completed their profile
export const useProfileStatus = () => {
  const { user } = useAuthStore()
  const { data: currentUser, isLoading, isError } = useCurrentUser()

  return {
    isLoading,
    isError,
    hasProfile: user?.role === 'institution' 
      ? !!currentUser?.institution_profile
      : user?.role === 'student'
      ? !!currentUser?.student_profile
      : false,
    profileData: user?.role === 'institution'
      ? currentUser?.institution_profile
      : currentUser?.student_profile,
    currentUserData: currentUser
  }
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const updateUser = useAuthStore(state => state.updateUser)
  const currentUser = useAuthStore(state => state.user)
  const currentUserType = useAuthStore(state => state.userType)

  return useMutation({
    mutationFn: (profileData: any) =>
      authApi.updateProfile(profileData).then(res => res.data),
    onSuccess: (response) => {
      const updatedUser = response?.data || response
      const normalizedUserType =
        updatedUser?.userType ||
        (['institution', 'student', 'general'].includes(updatedUser?.role)
          ? updatedUser.role
          : undefined) ||
        currentUserType ||
        currentUser?.userType ||
        'general'
      const normalizedRole =
        (['institution', 'student', 'general'].includes(updatedUser?.role)
          ? updatedUser.role
          : undefined) ||
        currentUser?.role ||
        normalizedUserType

      if (updatedUser) {
        updateUser({
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.full_name || updatedUser.name,
          full_name: updatedUser.full_name || updatedUser.name,
          role: normalizedRole,
          userType: normalizedUserType,
          is_verified: updatedUser.is_verified,
          profile_picture: updatedUser.profile_picture,
          profilePicture: updatedUser.profile_picture,
          updated_at: updatedUser.updated_at,
        })

        queryClient.setQueryData(authKeys.profile(), (previousData: any) => ({
          ...(previousData || {}),
          ...updatedUser,
        }))

        queryClient.setQueryData(
          authKeys.currentUser(),
          (previousData: CurrentUserResponse | undefined) => {
            if (!previousData) {
              return previousData
            }

            return {
              ...previousData,
              user: {
                ...previousData.user,
                id: updatedUser.id || previousData.user.id,
                full_name:
                  updatedUser.full_name ||
                  updatedUser.name ||
                  previousData.user.full_name,
                email: updatedUser.email || previousData.user.email,
                role: normalizedRole || previousData.user.role,
                is_verified:
                  updatedUser.is_verified ?? previousData.user.is_verified,
              },
              profile_picture:
                updatedUser.profile_picture ?? previousData.profile_picture,
            }
          }
        )
      }
    },
    onError: (error) => {
      console.error('Profile update failed:', error)
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) =>
      authApi.forgotPassword(email).then(res => res.data),
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword).then(res => res.data),
  })
}

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => 
      authApi.resendVerification(data).then(res => res.data)
  })
}

export const useGoogleAuth = () => {
  const queryClient = useQueryClient()
  const loginStore = useAuthStore(state => state.login)

  return useMutation({
    mutationFn: (code: string) =>
       authApi.googleAuth(code).then(res => res.data),
    onSuccess: (data) => {
      loginStore(data.user)
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      }
      
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
      
      return data
    },
    onError: (error) => {
      console.error('Google authentication failed:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      })
      throw error
    }
  })
}

// Hook to check authentication status on app load
export const useAuthInitializer = () => {
  const { user, isAuthenticated, setUser } = useAuthStore()
  const { data: currentUser, isLoading, isError } = useCurrentUser()

  useEffect(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem('auth_token')
    if (token && !isAuthenticated) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])

  useEffect(() => {
    if (currentUser && !isLoading && !isError) {
      const normalizedUserType = getNormalizedAppUserType(
        currentUser.user.role,
        user?.userType || user?.role,
        currentUser
      )

      const userData = {
        id: currentUser.user.id,
        email: currentUser.user.email,
        name: currentUser.user.full_name,
        full_name: currentUser.user.full_name,
        role: normalizedUserType,
        userType: normalizedUserType,
        backend_role: currentUser.user.role,
        is_verified: currentUser.user.is_verified,
        isAuthenticated: true,
        profile_picture: currentUser.profile_picture,
        institution_profile: currentUser.institution_profile,
        student_profile: currentUser.student_profile,
        campustalk_access_token: currentUser.user.campustalk_access_token,
        token_type: currentUser.user.token_type
      }
      
      setUser(userData)

      if (currentUser.user.campustalk_access_token) {
        localStorage.setItem('campustalk_access_token', currentUser.user.campustalk_access_token)
      }
    }
  }, [currentUser, isLoading, isError, setUser])

  return { isLoading, isAuthenticated: !!user }
}
