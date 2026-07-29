import { Play, Pause } from 'lucide-react'

function Bolt({ className }) {
  return (
    <span
      className={`absolute w-1.5 h-1.5 rounded-full bg-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${className}`}
    />
  )
}

function Turntable({ track, isPlaying, onTogglePlay }) {
  return (
    <div className="relative metal-panel-raised rounded-2xl p-8 mb-10 flex items-center gap-10 border border-black/40 overflow-hidden">
      <Bolt className="top-3 left-3" />
      <Bolt className="top-3 right-3" />
      <Bolt className="bottom-3 left-3" />
      <Bolt className="bottom-3 right-3" />

      {/* Platter */}
      <div className="relative w-56 h-56 flex-shrink-0">
        {/* Plinth well */}
        <div className="absolute -inset-3 rounded-full bg-black/50 shadow-[inset_0_6px_20px_rgba(0,0,0,0.7)]" />

        {/* Vinyl disc */}
        <div
          className={`absolute inset-0 rounded-full vinyl-groove-large border border-black/60 ${
            track && isPlaying ? 'vinyl-spin' : ''
          }`}
        >
          {/* Label / album art in center */}
          <div className="absolute inset-0 m-auto w-24 h-24 rounded-full overflow-hidden border-2 border-black/60">
            {track ? (
              <img src={track.cover} alt={track.album} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-panel flex items-center justify-center">
                <span className="font-lcd text-taupe text-xs tracking-widest">NO DISC</span>
              </div>
            )}
          </div>
          {/* Spindle hole */}
          <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-void" />
        </div>

        {/* Tonearm pivot */}
        <div className="absolute -top-2 -right-6 w-5 h-5 rounded-full bg-panel border border-black/60 z-20 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />

        {/* Tonearm */}
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

      {/* Track info + controls */}
      <div className="flex flex-col gap-3 min-w-0">
        <span className="font-lcd text-phosphor text-sm tracking-[0.2em] [text-shadow:0_0_6px_rgba(255,59,59,0.6)]">
          {track ? (isPlaying ? 'NOW SPINNING' : 'ON THE PLATTER') : 'TURNTABLE EMPTY'}
        </span>
        <h2 className="font-display font-bold text-3xl leading-tight truncate">
          {track ? track.title : 'Drop a record'}
        </h2>
        <p className="text-taupe truncate">
          {track ? `${track.artist} — ${track.album}` : 'Pick any track below to load it here'}
        </p>

        {track && (
          <button
            onClick={onTogglePlay}
            className="mt-2 w-fit flex items-center gap-2 bg-phosphor text-void font-medium px-5 py-2 rounded-full hover:scale-105 transition-transform shadow-[0_0_16px_rgba(255,59,59,0.4)]"
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Turntable