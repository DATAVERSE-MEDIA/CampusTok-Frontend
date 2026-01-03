// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, authApi } from '../api'
import {mockAuthApi} from '../api/mockApi'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect } from 'react'

// Auth keys for query cache
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
}

// Authentication hooks
export const useLogin = () => {
  const queryClient = useQueryClient()
  const loginStore = useAuthStore(state => state.login)

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authApi.login(credentials).then(res => res.data),
    onSuccess: (data) => {
      // Update Zustand store
      loginStore(data.user)
      
      // Save token (adjust for React Native)
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
      }
      
      // Invalidate user profile query
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
  })
}

export const useRegister = () => {
  const signupStore = useAuthStore(state => state.signup)

  return useMutation({
    mutationFn: (userData: {full_name:string, email: string; password: string; role?: string }) =>
       authApi.register(userData).then(res => res.data),//mockAuthApi.register(userData).then(res => res.data.data),
    onSuccess: (data) => {
      signupStore(data.email)
    },
  })
}

export const useVerifyEmail = () => {
  const verifyEmailStore = useAuthStore(state => state.verifyEmail)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) =>
      authApi.verifyEmail(token).then(res => res.data),
    onSuccess: () => {
      verifyEmailStore()
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
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
      queryClient.clear() // Clear all queries on logout
    },
  })
}

export const useProfile = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authApi.getProfile().then(res => res.data),
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

// Custom hook to sync profile with Zustand
export const useProfileWithSync = () => {
  const { user, setUser } = useAuthStore()
  const query = useProfile()

  useEffect(() => {
    if (query.data && query.isSuccess && !user) {
      setUser(query.data)
    }
  }, [query.data, query.isSuccess, user, setUser])

  return query
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profileData: any) =>
      authApi.updateProfile(profileData).then(res => res.data),
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(authKeys.profile(), data)
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