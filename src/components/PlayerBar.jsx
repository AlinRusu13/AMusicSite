import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, ListMusic, Shuffle, Repeat, Repeat1, Maximize2 } from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import EqualizerBars from './EqualizerBars'

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function VolumeIcon({ volume }) {
  if (volume === 0) return <VolumeX size={15} />
  if (volume < 0.5) return <Volume1 size={15} />
  return <Volume2 size={15} />
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
      <div className="h-20 metal-panel-raised border-t border-black/60 flex items-center justify-center">
        <p className="font-lcd text-taupe text-lg tracking-wide">// SELECT A TRACK TO BEGIN</p>
      </div>
    )
  }

  const progressPct = duration ? (currentTime / duration) * 100 : 0
  const volumePct = volume * 100

  return (
    <div className="relative h-20 overflow-hidden">
      {/* Single slow-breathing red ember glow, no rainbow */}
      {isPlaying && (
        <div
          className="ember-glow absolute -top-14 left-1/2 -translate-x-1/2 w-72 h-32 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,59,59,0.55), transparent 70%)' }}
        />
      )}

      {/* Thin red ember line along the top edge, one color, slow breathing */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-phosphor z-10 ${isPlaying ? 'ember-strip' : ''}`}
        style={{ opacity: isPlaying ? undefined : 0.15, boxShadow: isPlaying ? '0 0 8px rgba(255,59,59,0.7)' : 'none' }}
      />

      <div className="relative metal-panel-raised h-full grid grid-cols-[280px_1fr_220px] items-center gap-5 px-5 border-t border-black/60">
        {/* LEFT: track identity */}
        <button onClick={onExpand} className="press-active flex items-center gap-3 min-w-0 text-left group">
          <div className="relative flex-shrink-0">
            <img
              src={currentTrack.cover}
              alt=""
              className="w-12 h-12 rounded-md object-cover border border-black/50 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-panel-raised ${
                isPlaying ? 'bg-phosphor shadow-[0_0_6px_rgba(255,59,59,0.8)]' : 'bg-taupe'
              }`}
            />
          </div>
          <div className="min-w-0">
            <p className="font-lcd text-phosphor text-lg leading-tight truncate [text-shadow:0_0_6px_rgba(255,59,59,0.5)]">
              {currentTrack.title}
            </p>
            <p className="text-xs text-taupe truncate">{currentTrack.artist}</p>
          </div>
          <Maximize2
            size={13}
            className="text-taupe opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1"
          />
        </button>

        {/* CENTER: transport + seek */}
        <div className="flex flex-col items-center gap-1 min-w-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleShuffle} className={`press-active ${shuffle ? 'text-phosphor' : 'text-taupe hover:text-paper'}`}>
              <Shuffle size={15} />
            </button>
            <button onClick={prev} className="press-active text-taupe hover:text-paper transition-colors">
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className="press-active w-9 h-9 rounded-full bg-phosphor text-void flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_14px_rgba(255,59,59,0.55)]"
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={next} className="press-active text-taupe hover:text-paper transition-colors">
              <SkipForward size={18} fill="currentColor" />
            </button>
            <button onClick={cycleRepeat} className={`press-active ${repeatMode !== 'off' ? 'text-phosphor' : 'text-taupe hover:text-paper'}`}>
              {repeatMode === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full max-w-md font-lcd text-xs text-taupe">
            <span className="w-8 text-right flex-shrink-0">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-phosphor rounded-full transition-[width]"
                style={{ width: `${progressPct}%`, boxShadow: '0 0 6px rgba(255,59,59,0.7)' }}
              />
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="w-8 flex-shrink-0">{formatTime(duration)}</span>
          </div>
        </div>

        {/* RIGHT: single meter + queue + fixed volume slider */}
        <div className="flex items-center justify-end gap-3 min-w-0">
          <EqualizerBars isPlaying={isPlaying} barCount={7} />

          <button onClick={onToggleQueue} className="press-active text-taupe hover:text-paper transition-colors flex-shrink-0">
            <ListMusic size={17} />
          </button>

          <div className="flex items-center gap-1.5 flex-shrink-0 w-24">
            <VolumeIcon volume={volume} />
            <div className="relative flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-phosphor rounded-full transition-[width]"
                style={{ width: `${volumePct}%` }}
              />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerBar