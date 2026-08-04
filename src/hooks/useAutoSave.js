import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import { useAuthStore } from '../store/useAuthStore'
import { saveUserData } from '../services/userData'

export function useAutoSave() {
  const user = useAuthStore((s) => s.user)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!user) return
    const unsubscribe = usePlayerStore.subscribe((state) => {
      clearTimeout(timeoutRef.current)
      // Debounced — waits for a pause in activity so we're not writing on every keystroke/click
      timeoutRef.current = setTimeout(() => {
        saveUserData(user.uid, {
          playlists: state.playlists,
          likedTrackIds: state.likedTrackIds,
          playCounts: state.playCounts,
          youtubeTracks: state.youtubeTracks,
        })
      }, 1500)
    })
    return () => {
      unsubscribe()
      clearTimeout(timeoutRef.current)
    }
  }, [user])
}