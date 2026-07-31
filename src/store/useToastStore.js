import { create } from 'zustand'

export const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (message) => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, message }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 2500)
  },
}))