import { create } from 'zustand'
import { usePlayerStore } from './usePlayerStore'
import { useToastStore } from './useToastStore'

let intervalId = null

export const useSleepTimerStore = create((set, get) => ({
  remainingSeconds: null,
  totalSeconds: null,

  startTimer: (minutes) => {
    clearInterval(intervalId)
    const totalSeconds = minutes * 60
    set({ remainingSeconds: totalSeconds, totalSeconds })
    useToastStore.getState().addToast(`Sleep timer set — ${minutes} min`)

    intervalId = setInterval(() => {
      const { remainingSeconds } = get()
      if (remainingSeconds <= 1) {
        clearInterval(intervalId)
        const player = usePlayerStore.getState()
        if (player.isPlaying) player.togglePlay()
        set({ remainingSeconds: null, totalSeconds: null })
        useToastStore.getState().addToast('Sleep timer ended — playback paused')
        return
      }
      set({ remainingSeconds: remainingSeconds - 1 })
    }, 1000)
  },

  cancelTimer: () => {
    clearInterval(intervalId)
    set({ remainingSeconds: null, totalSeconds: null })
    useToastStore.getState().addToast('Sleep timer cancelled')
  },
}))