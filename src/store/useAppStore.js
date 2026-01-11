import { create } from 'zustand'

export const useAppStore = create((set) => ({
  selectedSchool: null,
  schools: [],
  
  setSelectedSchool: (school) => set({ selectedSchool: school }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification]
  })),
  
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  setSchools: (schools)=> set({schools}),
}))

