import { create } from "zustand";

export const useAppStore = create((set) => ({
  selectedSchool: null,
  contentSchool: null,
  schools: [],

  setSelectedSchool: (school) => set({ selectedSchool: school }),
  clearSelectedSchool: () => set({ selectedSchool: null }),
  setContentSchool: (school) => set({ contentSchool: school }),
  clearContentSchool: () => set({ contentSchool: null }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),

  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setSchools: (schools) => set({ schools }),

  // Used to force-refresh feeds (e.g. after creating a post)
  feedRefreshToken: 0,
  bumpFeedRefreshToken: () =>
    set((state) => ({ feedRefreshToken: state.feedRefreshToken + 1 })),

  // Keep track of the most recently created post so
  // dashboards can keep it visible even if the API
  // returns stale/older data after navigation.
  lastCreatedPost: null,
  setLastCreatedPost: (post) => set({ lastCreatedPost: post }),
}));
