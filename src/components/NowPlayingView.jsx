import { Play, Pause, SkipBack, SkipForward, ChevronDown } from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import EqualizerBars from './EqualizerBars'

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function NowPlayingView({ isOpen, onClose }) {
  const { currentTrack, isPlaying, currentTime, duration, togglePlay, seek, next, prev } = usePlayerStore()

  if (!isOpen || !currentTrack) return null

  return (
    <div className="fixed inset-0 z-40 bg-void flex flex-col">
      <div className="grain-overlay" />
      <div className="scanline-overlay" />

      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-50 text-taupe hover:text-paper flex items-center gap-2 font-lcd tracking-widest text-lg"
      >
        <ChevronDown size={20} />
        MINIMIZE
      </button>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8 relative z-10">
        <img
          src={currentTrack.cover}
          alt=""
          className="w-72 h-72 rounded-2xl object-cover border-2 border-black/50 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        />

        <div className="text-center">
          <h2 className="font-display font-bold text-3xl mb-1">{currentTrack.title}</h2>
          <p className="text-taupe">{currentTrack.artist} — {currentTrack.album}</p>
        </div>

        <EqualizerBars isPlaying={isPlaying} barCount={16} />

        <div className="flex flex-col w-full max-w-lg gap-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1 accent-phosphor cursor-pointer"
          />
          <div className="flex justify-between font-lcd text-taupe text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={prev} className="text-taupe hover:text-paper">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-phosphor text-void flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_24px_rgba(255,59,59,0.5)]"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={next} className="text-taupe hover:text-paper">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NowPlayingView