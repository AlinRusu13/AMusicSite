import { useEffect } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'

export function useKeyboardShortcuts() {
  useEffect(() => {
    function handleKeyDown(e) {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      const { togglePlay, next, prev, seek, currentTime } = usePlayerStore.getState()

      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.code === 'ArrowRight' && e.shiftKey) {
        next()
      } else if (e.code === 'ArrowLeft' && e.shiftKey) {
        prev()
      } else if (e.code === 'ArrowRight') {
        seek(currentTime + 5)
      } else if (e.code === 'ArrowLeft') {
        seek(Math.max(0, currentTime - 5))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}