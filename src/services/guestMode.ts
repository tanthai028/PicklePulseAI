import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GuestState {
  isGuest: boolean
  guestId: string | null
  setGuestMode: (enabled: boolean) => void
}

// Create a guest store with persistence
export const useGuestStore = create<GuestState>()(
  persist(
    (set) => ({
      isGuest: false,
      guestId: null,
      setGuestMode: (enabled) => {
        if (enabled) {
          // Generate a temporary guest ID
          const guestId = `guest_${Math.random().toString(36).substring(2)}`
          set({ isGuest: true, guestId })
        } else {
          set({ isGuest: false, guestId: null })
        }
      },
    }),
    {
      name: 'guest-storage',
    }
  )
)

// Helper functions for guest mode
export const continueAsGuest = () => {
  useGuestStore.getState().setGuestMode(true)
}

export const exitGuestMode = () => {
  useGuestStore.getState().setGuestMode(false)
}

export const isGuestUser = () => {
  return useGuestStore.getState().isGuest
}

export const getGuestId = () => {
  return useGuestStore.getState().guestId
} 