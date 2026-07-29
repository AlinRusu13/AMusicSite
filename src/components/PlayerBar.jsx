import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, ListMusic, Shuffle, Repeat, Repeat1 } from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import EqualizerBars from './EqualizerBars'

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function PlayerBar({ onExpand, onToggleQueue }) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeatMode,
    togglePlay,
    seek,
    changeVolume,
    next,
    prev,
    toggleShuffle,
    cycleRepeat,
  } = usePlayerStore()

  if (!currentTrack) {
    return (
      <div className="relative h-20 metal-panel-raised border-t border-black/60 flex items-center px-5">
        <p className="font-lcd text-taupe text-lg tracking-wide">// SELECT A TRACK</p>
      </div>
    )
  }

  return (
    <div className="relative h-20 metal-panel-raised border-t border-black/60 flex items-center gap-6 px-5">
      <button onClick={onExpand} className="flex items-center gap-3 w-56 flex-shrink-0 text-left group">
        <img src={currentTrack.cover} alt="" className="w-12 h-12 rounded object-cover border border-black/40" />
        <div className="flex flex-col min-w-0">
          <span className="font-lcd text-phosphor text-lg leading-none truncate [text-shadow:0_0_6px_rgba(255,59,59,0.5)]">
            {currentTrack.title}
          </span>
          <span className="text-xs text-taupe truncate">{currentTrack.artist}</span>
        </div>
        <Maximize2 size={14} className="text-taupe opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0" />
      </button>

      <div className="flex flex-col flex-1 gap-1.5 max-w-xl">
        <div className="flex items-center justify-center gap-4">
          <button onClick={toggleShuffle} className={shuffle ? 'text-phosphor' : 'text-taupe hover:text-paper'}>
            <Shuffle size={16} />
          </button>
          <button onClick={prev} className="text-taupe hover:text-paper transition-colors">
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-phosphor text-void flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_10px_rgba(255,59,59,0.5)]"
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={next} className="text-taupe hover:text-paper transition-colors">
            <SkipForward size={18} fill="currentColor" />
          </button>
          <button onClick={cycleRepeat} className={repeatMode !== 'off' ? 'text-phosphor' : 'text-taupe hover:text-paper'}>
            {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>

        <div className="flex items-center gap-2 font-lcd text-sm text-taupe">
          <span className="w-9 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 h-1 accent-phosphor cursor-pointer"
          />
          <span className="w-9">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <EqualizerBars isPlaying={isPlaying} barCount={9} />
        <button onClick={onToggleQueue} className="text-taupe hover:text-paper transition-colors">
          <ListMusic size={18} />
        </button>
        <div className="flex items-center gap-1.5">
          <Volume2 size={16} className="text-taupe" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="w-16 h-1 accent-phosphor cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

export default PlayerBar