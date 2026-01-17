import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  userType: null, // 'student' or 'institution' or 'general'
  isAuthenticated: false,
  email: null,
  emailVerified: false,
  profileSelected: false,
  
  login: (userData) => set({ 
    user: userData, 
    userType: userData?.userType || userData?.role || 'general',
    isAuthenticated: true,//!userData?.isGuest, // Guests are not fully authenticated
    email: userData?.email || null
  }),
  
  signup: (email) => set({ 
    email, 
    emailVerified: false 
  }),
  
  verifyEmail: () => set({ 
    emailVerified: true 
  }),
  selectProfile: (userType) => set({ 
    userType, 
    profileSelected: true 
  }),
  
  logout: () => set({ 
    user: null, 
    userType: null, 
    isAuthenticated: false, 
    email: null, 
    emailVerified: false, 
    profileSelected: false 
  }),
}))

