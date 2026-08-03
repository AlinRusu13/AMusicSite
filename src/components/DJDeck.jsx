import { Play, Pause } from 'lucide-react'
import { useDeckStore } from '../store/useDeckStore'

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function Bolt({ className }) {
  return <span className={`absolute w-1.5 h-1.5 rounded-full bg-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${className}`} />
}

function DJDeck({ label }) {
  const deckState = useDeckStore((s) => s.decks[label])
  const togglePlay = useDeckStore((s) => s.togglePlay)
  const seek = useDeckStore((s) => s.seek)
  const setPitch = useDeckStore((s) => s.setPitch)
  const setFilter = useDeckStore((s) => s.setFilter)

  const { track, isPlaying, currentTime, duration, pitch, filterValue } = deckState

  function handleDrop(e) {
    e.preventDefault()
    try {
      const dropped = JSON.parse(e.dataTransfer.getData('application/json'))
      if (dropped?.id) useDeckStore.getState().loadTrack(label, dropped)
    } catch (err) {
      // ignore malformed drops
    }
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="relative metal-panel-raised rounded-2xl p-6 border border-black/40 flex flex-col gap-4"
    >
      <Bolt className="top-3 left-3" />
      <Bolt className="top-3 right-3" />
      <Bolt className="bottom-3 left-3" />
      <Bolt className="bottom-3 right-3" />

      <div className="flex items-center justify-between">
        <span className="font-lcd text-phosphor text-xl tracking-[0.2em] [text-shadow:0_0_6px_rgba(255,59,59,0.6)]">
          DECK {label}
        </span>
        {track && <span className="text-xs text-taupe">{Math.round((1 + pitch / 100) * 100)}% speed</span>}
      </div>

      <div className="relative w-full aspect-square max-w-[180px] mx-auto">
        <div className={`absolute inset-0 rounded-full vinyl-groove-large border border-black/60 ${isPlaying ? 'vinyl-spin' : ''}`}>
          <div className="absolute inset-0 m-auto w-16 h-16 rounded-full overflow-hidden border-2 border-black/60">
            {track ? (
              <img src={track.cover} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-panel flex items-center justify-center">
                <span className="font-lcd text-taupe text-[10px] tracking-wide">EMPTY</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center min-h-[36px]">
        {track ? (
          <>
            <p className="font-medium text-sm truncate">{track.title}</p>
            <p className="text-xs text-taupe truncate">{track.artist}</p>
          </>
        ) : (
          <p className="font-lcd text-taupe text-sm tracking-wide">// DRAG A TRACK HERE</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => togglePlay(label)}
          disabled={!track}
          className="press-active w-9 h-9 rounded-full bg-phosphor text-void flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_10px_rgba(255,59,59,0.5)] disabled:opacity-30 disabled:pointer-events-none flex-shrink-0"
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seek(label, Number(e.target.value))}
          disabled={!track}
          className="flex-1 h-1 accent-phosphor cursor-pointer disabled:opacity-30"
        />
      </div>
      <div className="flex justify-between font-lcd text-xs text-taupe -mt-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-lcd text-xs text-taupe tracking-widest">TEMPO {pitch > 0 ? '+' : ''}{pitch}%</label>
        <input
          type="range"
          min={-8}
          max={8}
          step={0.1}
          value={pitch}
          onChange={(e) => setPitch(label, Number(e.target.value))}
          className="w-full h-1 accent-phosphor cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-lcd text-xs text-taupe tracking-widest">FILTER</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={filterValue}
          onChange={(e) => setFilter(label, Number(e.target.value))}
          className="w-full h-1 accent-phosphor cursor-pointer"
        />
      </div>
    </div>
  )
}

export default DJDeck