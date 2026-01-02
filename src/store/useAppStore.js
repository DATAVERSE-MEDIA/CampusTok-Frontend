import { create } from 'zustand'

export const useAppStore = create((set) => ({
  selectedSchool: null,
  schools: [
    { id: 1, name: 'University of Lagos', code: 'UNILAG', address: 'University Road Lagos Mainland Akoka, Yaba, Lagos' },
    { id: 2, name: 'Harvard University', code: 'HARV', address: 'Cambridge, Massachusetts, USA' },
    { id: 3, name: 'MIT', code: 'MIT', address: 'Cambridge, Massachusetts, USA' },
    { id: 4, name: 'Stanford University', code: 'STAN', address: 'Stanford, California, USA' },
    { id: 5, name: 'UC Berkeley', code: 'UCB', address: 'Berkeley, California, USA' },
    { id: 6, name: 'Yale University', code: 'YALE', address: 'New Haven, Connecticut, USA' },
  ],
  
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
}))

