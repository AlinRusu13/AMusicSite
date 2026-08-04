import { create } from 'zustand'
import { useAuthStore } from './useAuthStore'
import { saveUserData } from '../services/userData'
import { useToastStore } from './useToastStore'

export const useProfileStore = create((set, get) => ({
  bio: '',
  bannerId: 'ember',
  avatarColor: '#C9542C',
  avatarEmoji: '🎧',
  showcaseMixtapeIds: [],
  isLoaded: false,

  loadProfile: (data) => {
    if (!data) {
      set({ isLoaded: true })
      return
    }
    set({
      bio: data.bio || '',
      bannerId: data.bannerId || 'ember',
      avatarColor: data.avatarColor || '#C9542C',
      avatarEmoji: data.avatarEmoji || '🎧',
      showcaseMixtapeIds: data.showcaseMixtapeIds || [],
      isLoaded: true,
    })
  },

  updateProfile: (fields) => set(fields),

  toggleShowcase: (mixtapeId) =>
    set((s) => {
      const isIn = s.showcaseMixtapeIds.includes(mixtapeId)
      if (isIn) return { showcaseMixtapeIds: s.showcaseMixtapeIds.filter((id) => id !== mixtapeId) }
      if (s.showcaseMixtapeIds.length >= 3) {
        useToastStore.getState().addToast('Showcase holds up to 3 mixtapes')
        return {}
      }
      return { showcaseMixtapeIds: [...s.showcaseMixtapeIds, mixtapeId] }
    }),

  saveProfile: async () => {
    const user = useAuthStore.getState().user
    if (!user) return
    const { bio, bannerId, avatarColor, avatarEmoji, showcaseMixtapeIds } = get()
    await saveUserData(user.uid, { bio, bannerId, avatarColor, avatarEmoji, showcaseMixtapeIds })
    useToastStore.getState().addToast('Profile saved')
  },
}))