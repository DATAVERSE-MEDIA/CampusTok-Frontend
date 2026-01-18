import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export const useAppStore = create(
  persist(
    (set, get) => ({
      selectedSchool: null,
      schools: [],

      setSelectedSchool: (school) => set({ selectedSchool: school }),

      // Initialize from auth store's defaultInstitution if no school selected
      initializeFromAuth: () => {
        const { defaultInstitution } = useAuthStore.getState();
        if (!get().selectedSchool && defaultInstitution) {
          set({ selectedSchool: defaultInstitution });
        }
      },

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

      // Reset app state (for logout)
      reset: () =>
        set({
          selectedSchool: null,
          searchQuery: "",
          notifications: [],
          messages: [],
        }),
    }),
    {
      name: "campustok-app-storage",
      partialize: (state) => ({
        selectedSchool: state.selectedSchool,
      }),
    },
  ),
);
