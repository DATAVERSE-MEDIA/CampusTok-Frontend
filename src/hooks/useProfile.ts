// hooks/useProfile.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api'
import { useAuthStore } from '../store/useAuthStore'

// Profile keys for query cache
export const profileKeys = {
  all: ['profiles'] as const,
  institution: () => [...profileKeys.all, 'institution'] as const,
  student: () => [...profileKeys.all, 'student'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  currentUser: (userId?: string) => [...profileKeys.current(), userId] as const,
  byUser: (userId: string) => [...profileKeys.all, 'user', userId] as const,
}

// Institution Profile Types
export interface InstitutionProfileData {
  institution_email: string
  institution_id: string
  institution_name: string
}

export interface StudentProfileData {
  department: string
  educational_level: string
  faculty: string
  institution_id: string
  institution_name: string
  matric_number: string
}

// Response Types
export interface ProfileResponse {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  [key: string]: any
}

// Profile hooks
export const useInstitutionProfile = () => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: profileKeys.currentUser(user?.id),
    queryFn: () => 
      apiClient.get('/auth/profile/institution').then(res => res.data),
    enabled: !!user?.id && user?.role === 'institution',
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useStudentProfile = () => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: profileKeys.currentUser(user?.id),
    queryFn: () => 
      apiClient.get('/auth/profile/student').then(res => res.data),
    enabled: !!user?.id && user?.role === 'student',
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get current user's profile based on role
export const useCurrentProfile = () => {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: profileKeys.currentUser(user?.id),
    queryFn: async () => {
      if (!user?.id) throw new Error('No user logged in')
      
      // Determine which endpoint to call based on user role
      if (user.role === 'institution') {
        return apiClient.get('/auth/profile/institution').then(res => res.data)
      } else if (user.role === 'student') {
        return apiClient.get('/auth/profile/student').then(res => res.data)
      } else {
        // For general users, maybe return basic user info
        return { user }
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  })
}

// Create/Update Institution Profile
export const useCreateInstitutionProfile = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: (profileData: InstitutionProfileData) =>
      apiClient.post('/auth/profile/institution', profileData).then(res => res.data),
    onSuccess: (data) => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: profileKeys.institution() })
      queryClient.invalidateQueries({ queryKey: profileKeys.current() })
      
      // Optimistically update cache
      if (user?.id) {
        queryClient.setQueryData(profileKeys.currentUser(user.id), data)
      }
      
      console.log('Institution profile created successfully:', data)
    },
    onError: (error) => {
      console.error('Error creating institution profile:', error)
    },
  })
}

// Create/Update Student Profile
export const useCreateStudentProfile = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: (profileData: StudentProfileData) =>
      apiClient.post('/auth/profile/student', profileData).then(res => res.data),
    onSuccess: (data) => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: profileKeys.student() })
      queryClient.invalidateQueries({ queryKey: profileKeys.current() })
      
      // Optimistically update cache
      if (user?.id) {
        queryClient.setQueryData(profileKeys.currentUser(user.id), data)
      }
      
      console.log('Student profile created successfully:', data)
    },
    onError: (error) => {
      console.error('Error creating student profile:', error)
    },
  })
}

// Update Institution Profile
export const useUpdateInstitutionProfile = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: (profileData: Partial<InstitutionProfileData>) =>
      apiClient.put('/auth/profile/institution', profileData).then(res => res.data),
    onSuccess: (data) => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: profileKeys.institution() })
      queryClient.invalidateQueries({ queryKey: profileKeys.current() })
      
      // Optimistically update cache
      if (user?.id) {
        queryClient.setQueryData(profileKeys.currentUser(user.id), data)
      }
      
      console.log('Institution profile updated successfully:', data)
    },
    onError: (error) => {
      console.error('Error updating institution profile:', error)
    },
  })
}

// Update Student Profile
export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: (profileData: Partial<StudentProfileData>) =>
      apiClient.put('/auth/profile/student', profileData).then(res => res.data),
    onSuccess: (data) => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: profileKeys.student() })
      queryClient.invalidateQueries({ queryKey: profileKeys.current() })
      
      // Optimistically update cache
      if (user?.id) {
        queryClient.setQueryData(profileKeys.currentUser(user.id), data)
      }
      
      console.log('Student profile updated successfully:', data)
    },
    onError: (error) => {
      console.error('Error updating student profile:', error)
    },
  })
}

// Delete Institution Profile
export const useDeleteInstitutionProfile = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: () =>
      apiClient.delete('/auth/profile/institution').then(res => res.data),
    onSuccess: () => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: profileKeys.institution() })
      queryClient.invalidateQueries({ queryKey: profileKeys.current() })
      
      // Remove from cache
      if (user?.id) {
        queryClient.setQueryData(profileKeys.currentUser(user.id), null)
      }
      
      console.log('Institution profile deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting institution profile:', error)
    },
  })
}

// Delete Student Profile
export const useDeleteStudentProfile = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: () =>
      apiClient.delete('/auth/profile/student').then(res => res.data),
    onSuccess: () => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: profileKeys.student() })
      queryClient.invalidateQueries({ queryKey: profileKeys.current() })
      
      // Remove from cache
      if (user?.id) {
        queryClient.setQueryData(profileKeys.currentUser(user.id), null)
      }
      
      console.log('Student profile deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting student profile:', error)
    },
  })
}

// Combined hook for easy usage
export const useProfileMutations = () => {
  const createInstitutionProfile = useCreateInstitutionProfile()
  const createStudentProfile = useCreateStudentProfile()
  const updateInstitutionProfile = useUpdateInstitutionProfile()
  const updateStudentProfile = useUpdateStudentProfile()
  const deleteInstitutionProfile = useDeleteInstitutionProfile()
  const deleteStudentProfile = useDeleteStudentProfile()

  return {
    createInstitutionProfile,
    createStudentProfile,
    updateInstitutionProfile,
    updateStudentProfile,
    deleteInstitutionProfile,
    deleteStudentProfile,
  }
}

// Check if profile exists for current user
export const useProfileStatus = () => {
  const { user } = useAuthStore()
  const institutionProfile = useInstitutionProfile()
  const studentProfile = useStudentProfile()

  return {
    isLoading: institutionProfile.isLoading || studentProfile.isLoading,
    isError: institutionProfile.isError || studentProfile.isError,
    hasProfile: user?.role === 'institution' 
      ? !!institutionProfile.data 
      : user?.role === 'student' 
        ? !!studentProfile.data 
        : false,
    profileData: user?.role === 'institution' 
      ? institutionProfile.data 
      : studentProfile.data,
  }
}

// Hook for onboarding wizard
export const useCompleteOnboarding = () => {
  const createInstitutionProfile = useCreateInstitutionProfile()
  const createStudentProfile = useCreateStudentProfile()
  const { user } = useAuthStore()

  return {
    createProfile: (profileData: InstitutionProfileData | StudentProfileData) => {
      if (user?.role === 'institution') {
        return createInstitutionProfile.mutate(profileData as InstitutionProfileData)
      } else if (user?.role === 'student') {
        return createStudentProfile.mutate(profileData as StudentProfileData)
      } else {
        throw new Error('Invalid user role for profile creation')
      }
    },
    isLoading: user?.role === 'institution' 
      ? createInstitutionProfile.isPending 
      : createStudentProfile.isPending,
    isSuccess: user?.role === 'institution' 
      ? createInstitutionProfile.isSuccess 
      : createStudentProfile.isSuccess,
    isError: user?.role === 'institution' 
      ? createInstitutionProfile.isError 
      : createStudentProfile.isError,
    error: user?.role === 'institution' 
      ? createInstitutionProfile.error 
      : createStudentProfile.error,
  }
}