import { useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { useDominantColor } from '../hooks/useDominantColor'
import { usePlayerStore } from '../store/usePlayerStore'

function Bolt({ className }) {
  return (
    <span
      className={`absolute w-1.5 h-1.5 rounded-full bg-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${className}`}
    />
  )
}

function Turntable({ track, isPlaying, onTogglePlay }) {
  const glowColor = useDominantColor(track?.cover)
  const playCounts = usePlayerStore((s) => s.playCounts)
  const playTrack = usePlayerStore((s) => s.playTrack)
  const [isDragOver, setIsDragOver] = useState(false)

  const plays = track ? playCounts[track.id] || 0 : 0
  const wear = Math.min(1, plays / 15) // maxes out visually after ~15 plays

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    try {
      const dropped = JSON.parse(e.dataTransfer.getData('application/json'))
      if (dropped?.id) playTrack(dropped)
    } catch (err) {
      // ignore malformed drops
    }
  }

  return (
    <div className="relative mb-10">
      <div
        className="absolute -inset-10 opacity-60 blur-3xl transition-all duration-1000 rounded-2xl pointer-events-none z-0"
        style={{ background: `radial-gradient(circle at 25% 50%, rgba(${glowColor},0.6), transparent 70%)` }}
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative z-10 metal-panel-raised rounded-2xl p-8 flex items-center gap-10 border transition-colors ${
          isDragOver ? 'border-phosphor/70' : 'border-black/40'
        }`}
      >
        <Bolt className="top-3 left-3" />
        <Bolt className="top-3 right-3" />
        <Bolt className="bottom-3 left-3" />
        <Bolt className="bottom-3 right-3" />

        {isDragOver && (
          <div className="absolute inset-3 rounded-xl border-2 border-dashed border-phosphor/60 flex items-center justify-center z-20 bg-void/40">
            <span className="font-lcd text-phosphor text-xl tracking-widest">// DROP TO LOAD</span>
          </div>
        )}

        <div className="relative w-56 h-56 flex-shrink-0">
          <div className="absolute -inset-3 rounded-full bg-black/50 shadow-[inset_0_6px_20px_rgba(0,0,0,0.7)]" />

          <div
            className={`absolute inset-0 rounded-full vinyl-groove-large border border-black/60 ${
              track && isPlaying ? 'vinyl-spin' : ''
            }`}
          >
            {/* Wear scratches — opacity scales with play count */}
            {track && wear > 0 && (
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: wear * 0.5 }}>
                <line x1="20%" y1="15%" x2="78%" y2="85%" stroke="#fff" strokeWidth="0.5" />
                <line x1="70%" y1="10%" x2="30%" y2="90%" stroke="#fff" strokeWidth="0.5" />
                <line x1="10%" y1="55%" x2="90%" y2="45%" stroke="#fff" strokeWidth="0.5" />
                <line x1="35%" y1="8%" x2="60%" y2="92%" stroke="#fff" strokeWidth="0.3" />
              </svg>
            )}

            <div className="absolute inset-0 m-auto w-24 h-24 rounded-full overflow-hidden border-2 border-black/60">
              {track ? (
                <img src={track.cover} alt={track.album} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-panel flex items-center justify-center">
                  <span className="font-lcd text-taupe text-xs tracking-widest">NO DISC</span>
                </div>
              )}
            </div>
            <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-void" />
          </div>

          <div className="absolute -top-2 -right-6 w-5 h-5 rounded-full bg-panel border border-black/60 z-20 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />

          <button
            onClick={onTogglePlay}
            disabled={!track}
            aria-label="Toggle play"
            className="absolute -top-1 -right-4 w-36 h-3 z-10 origin-[95%_50%] transition-transform duration-700 ease-out disabled:cursor-not-allowed"
            style={{ transform: track && isPlaying ? 'rotate(22deg)' : 'rotate(-18deg)' }}
          >
            <span className="absolute inset-y-0 left-0 right-3 bg-gradient-to-r from-taupe to-panel rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-phosphor shadow-[0_0_6px_rgba(255,59,59,0.6)]" />
          </button>
        </div>

        <div className="flex flex-col gap-3 min-w-0">
          <span className="font-lcd text-phosphor text-sm tracking-[0.2em] [text-shadow:0_0_6px_rgba(255,59,59,0.6)]">
            {track ? (isPlaying ? 'NOW SPINNING' : 'ON THE PLATTER') : 'TURNTABLE EMPTY — DRAG A TRACK HERE'}
          </span>
          <h2 className="font-display font-bold text-3xl leading-tight truncate">
            {track ? track.title : 'Drop a record'}
          </h2>
          <p className="text-taupe truncate">
            {track ? `${track.artist} — ${track.album}${plays > 1 ? ` · played ${plays}×` : ''}` : 'Drag any track onto the platter, or pick one below'}
          </p>

          {track && (
            <button
              onClick={onTogglePlay}
              className="press-active mt-2 w-fit flex items-center gap-2 bg-phosphor text-void font-medium px-5 py-2 rounded-full hover:scale-105 transition-transform shadow-[0_0_16px_rgba(255,59,59,0.4)]"
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Turntable