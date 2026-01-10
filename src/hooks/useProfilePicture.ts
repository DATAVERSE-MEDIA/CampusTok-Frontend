// // hooks/useProfilePicture.ts
// import { useState } from 'react'
// import { useAuthStore } from '../store/useAuthStore'
// import { useQueryClient } from '@tanstack/react-query'
// import { authKeys } from './useAuth'

// export const useProfilePicture = () => {
//   const [isUploading, setIsUploading] = useState(false)
//   const [error, setError] = useState(null)
//   const [success, setSuccess] = useState(false)
//   const { updateUser } = useAuthStore()
//   const queryClient = useQueryClient()

//   const uploadProfilePicture = async (file) => {
//     setIsUploading(true)
//     setError(null)
//     setSuccess(false)

//     try {
//       const formData = new FormData()
//       formData.append('profile_picture', file)

//       // Get auth token
//       const token = localStorage.getItem('auth_token')
      
//       const response = await fetch('/api/v1/auth/profile/picture', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.message || `Upload failed with status ${response.status}`)
//       }

//       const data = await response.json()
      
//       // Update auth store
//       if (data.user) {
//         updateUser({ profilePicture: data.user.profile_picture })
//       }

//       // Invalidate profile query to refetch
//       queryClient.invalidateQueries({ queryKey: authKeys.profile() })
      
//       setSuccess(true)
//       return data

//     } catch (err) {
//       setError(err.message || 'Failed to upload profile picture')
//       throw err
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const removeProfilePicture = async () => {
//     setIsUploading(true)
//     setError(null)
//     setSuccess(false)

//     try {
//       const token = localStorage.getItem('auth_token')
      
//       const response = await fetch('/api/v1/auth/profile/picture', {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.message || `Failed to remove picture with status ${response.status}`)
//       }

//       const data = await response.json()
      
//       // Update auth store
//       if (data.user) {
//         updateUser({ profilePicture: null })
//       }

//       // Invalidate profile query to refetch
//       queryClient.invalidateQueries({ queryKey: authKeys.profile() })
      
//       setSuccess(true)
//       return data

//     } catch (err) {
//       setError(err.message || 'Failed to remove profile picture')
//       throw err
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const resetState = () => {
//     setError(null)
//     setSuccess(false)
//   }

//   return {
//     uploadProfilePicture,
//     removeProfilePicture,
//     isUploading,
//     error,
//     success,
//     resetState,
//   }
// }


// hooks/useProfilePicture.ts
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'
import { authKeys } from './useAuth'

export const useProfilePicture = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const { updateUser } = useAuthStore()
  const queryClient = useQueryClient()

  const uploadProfilePicture = async (file: File) => {
    setIsUploading(true)
    setError(null)
    setSuccess(false)
    setProgress(0)

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB max
        throw new Error('Image size must be less than 10MB')
      }

      const formData = new FormData()
      formData.append('profile_picture', file)

      // Get auth token
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.')
      }

      const response = await fetch('/api/v1/auth/profile/picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      // Simulate progress for better UX
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const data = await response.json()

      clearInterval(interval)
      setProgress(100)

      if (!response.ok) {
        throw new Error(data.message || `Upload failed with status ${response.status}`)
      }

      // Update auth store
      if (data.user) {
        updateUser({ 
          profilePicture: data.user.profile_picture,
          ...data.user 
        })
      }

      // Invalidate profile query to refetch
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
      
      setSuccess(true)
      return data

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload profile picture')
      throw err
    } finally {
      setIsUploading(false)
      // Reset progress after delay
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const removeProfilePicture = async () => {
    setIsUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('/api/v1/auth/profile/picture', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to remove picture with status ${response.status}`)
      }

      // Update auth store
      if (data.user) {
        updateUser({ profilePicture: null })
      }

      // Invalidate profile query to refetch
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
      
      setSuccess(true)
      return data

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove profile picture')
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const resetState = () => {
    setError(null)
    setSuccess(false)
    setProgress(0)
  }

  return {
    uploadProfilePicture,
    removeProfilePicture,
    isUploading,
    error,
    success,
    progress,
    resetState,
  }
}