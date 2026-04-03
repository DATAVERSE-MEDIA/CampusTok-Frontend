import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      userType: null, // 'student' or 'institution' or 'general'
      isAuthenticated: false,
      email: null,
      emailVerified: false,
      profileSelected: false,

      login: (userData) =>
        set({
          user: userData,
          userType: userData?.userType || userData?.role || 'general',
          isAuthenticated: true,
          email: userData?.email || null,
        }),

      setUser: (userData) =>
        set({
          user: userData,
          userType: userData?.userType || userData?.role || 'general',
          isAuthenticated: !!userData,
          email: userData?.email || null,
        }),

      updateUser: (partialUserData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUserData } : partialUserData,
          userType:
            partialUserData?.userType ||
            partialUserData?.role ||
            state.userType ||
            'general',
          isAuthenticated: true,
          email: partialUserData?.email || state.email || null,
        })),

      signup: (email) =>
        set({
          email,
          emailVerified: false,
        }),

      verifyEmail: () =>
        set({
          emailVerified: true,
        }),
      selectProfile: (userType) =>
        set({
          userType,
          profileSelected: true,
        }),

      logout: () =>
        set({
          user: null,
          userType: null,
          isAuthenticated: false,
          email: null,
          emailVerified: false,
          profileSelected: false,
        }),
    }),
    {
      name: 'campustok-auth',
      partialize: (state) => ({
        user: state.user,
        userType: state.userType,
        isAuthenticated: state.isAuthenticated,
        email: state.email,
        emailVerified: state.emailVerified,
        profileSelected: state.profileSelected,
      }),
    }
  )
)
