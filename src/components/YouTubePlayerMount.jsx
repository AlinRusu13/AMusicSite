import { useEffect, useRef } from 'react'
import { useYouTubeStore } from '../store/useYouTubeStore'
import { usePlayerStore } from '../store/usePlayerStore'

function YouTubePlayerMount() {
  const initPlayer = useYouTubeStore((s) => s.initPlayer)
  const initialized = useRef(false)
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    initPlayer('yt-player-el')
  }, [initPlayer])

  const isYouTubeActive = currentTrack?.isYouTube

  return (
    <div
      className={`fixed bottom-24 right-4 z-30 w-56 aspect-video rounded-lg overflow-hidden border border-black/50 shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all ${
        isYouTubeActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div id="yt-player-el" className="w-full h-full" />
    </div>
  )
}

export default YouTubePlayerMount