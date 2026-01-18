import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      userType: null, // 'student' | 'institution' | 'general'
      isAuthenticated: false,
      email: null,
      emailVerified: false,
      profileSelected: false,
      defaultInstitution: null, // The institution selected during signup

      login: (userData) => set({
        user: userData,
        userType: userData?.userType || userData?.role || 'general',
        isAuthenticated: !userData?.isGuest,
        email: userData?.email || null,
        defaultInstitution: userData?.defaultInstitution || get().defaultInstitution
      }),

      signup: (email) => set({
        email,
        emailVerified: false
      }),

      verifyEmail: () => set({
        emailVerified: true
      }),

      selectProfile: (userType, institution = null) => set({
        userType,
        profileSelected: true,
        defaultInstitution: institution || get().defaultInstitution
      }),

      setDefaultInstitution: (institution) => set({
        defaultInstitution: institution
      }),

      logout: () => set({
        user: null,
        userType: null,
        isAuthenticated: false,
        email: null,
        emailVerified: false,
        profileSelected: false,
        defaultInstitution: null
      }),
    }),
    {
      name: 'campustok-auth-storage',
      partialize: (state) => ({
        user: state.user,
        userType: state.userType,
        isAuthenticated: state.isAuthenticated,
        defaultInstitution: state.defaultInstitution
      })
    }
  )
)
