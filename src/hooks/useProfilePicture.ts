// hooks/useProfilePicture.ts
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'
import { authKeys } from './useAuth'

export const useProfilePicture = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { updateUser } = useAuthStore()
  const queryClient = useQueryClient()

  const uploadProfilePicture = async (file) => {
    setIsUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('profile_picture', file)

      // Get auth token
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch('/api/v1/auth/profile/picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Upload failed with status ${response.status}`)
      }

      const data = await response.json()
      
      // Update auth store
      if (data.user) {
        updateUser({ profilePicture: data.user.profile_picture })
      }

      // Invalidate profile query to refetch
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
      
      setSuccess(true)
      return data

    } catch (err) {
      setError(err.message || 'Failed to upload profile picture')
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const removeProfilePicture = async () => {
    setIsUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch('/api/v1/auth/profile/picture', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to remove picture with status ${response.status}`)
      }

      const data = await response.json()
      
      // Update auth store
      if (data.user) {
        updateUser({ profilePicture: null })
      }

      // Invalidate profile query to refetch
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
      
      setSuccess(true)
      return data

    } catch (err) {
      setError(err.message || 'Failed to remove profile picture')
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const resetState = () => {
    setError(null)
    setSuccess(false)
  }

  return {
    uploadProfilePicture,
    removeProfilePicture,
    isUploading,
    error,
    success,
    resetState,
  }
}