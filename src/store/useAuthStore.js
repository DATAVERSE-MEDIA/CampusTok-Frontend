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
    isAuthenticated: true 
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

