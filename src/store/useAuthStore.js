import { create } from 'zustand'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../services/firebase'
import { useToastStore } from './useToastStore'

// Firebase requires an email format internally — we quietly turn
// "username" into "username@reels.local" so the person only ever sees/types a username.
function toFakeEmail(username) {
  return `${username.toLowerCase().trim().replace(/\s+/g, '_')}@reels.local`
}

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  authError: null,

  init: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, isLoading: false })
    })
  },

  signup: async (username, password) => {
    set({ authError: null })
    if (!username.trim() || password.length < 6) {
      set({ authError: 'Username required, password must be 6+ characters' })
      return false
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, toFakeEmail(username), password)
      await updateProfile(cred.user, { displayName: username.trim() })
      useToastStore.getState().addToast(`Welcome, ${username}`)
      return true
    } catch (err) {
      const message = err.code === 'auth/email-already-in-use' ? 'That username is taken' : 'Signup failed'
      set({ authError: message })
      return false
    }
  },

  login: async (username, password) => {
    set({ authError: null })
    try {
      await signInWithEmailAndPassword(auth, toFakeEmail(username), password)
      useToastStore.getState().addToast(`Welcome back, ${username}`)
      return true
    } catch (err) {
      set({ authError: 'Incorrect username or password' })
      return false
    }
  },

  logout: async () => {
    await signOut(auth)
    useToastStore.getState().addToast('Signed out')
  },
}))