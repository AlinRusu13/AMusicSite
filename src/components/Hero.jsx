
import { Play } from 'lucide-react'

function Hero({ track, onPlay }) {
  if (!track) return null

  return (
    <div className="relative h-64 rounded-lg overflow-hidden mb-10 border border-black/40">
      <img
        src={track.cover}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-[1px] brightness-[0.4]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-transparent" />

      <div className="relative h-full flex items-end p-8 gap-6">
        <img
          src={track.cover}
          alt={track.album}
          className="w-32 h-32 rounded object-cover border-2 border-black/50 shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex-shrink-0"
        />
        <div className="flex flex-col gap-2 pb-1">
          <span className="font-lcd text-phosphor text-sm tracking-[0.2em] [text-shadow:0_0_6px_rgba(107,255,143,0.6)]">
            FEATURED SPIN
          </span>
          <h2 className="font-display font-bold text-4xl leading-none">{track.title}</h2>
          <p className="text-taupe">{track.artist} — {track.album}</p>
          <button
            onClick={() => onPlay(track)}
            className="mt-3 w-fit flex items-center gap-2 bg-phosphor text-void font-medium px-5 py-2 rounded-full hover:scale-105 transition-transform shadow-[0_0_16px_rgba(107,255,143,0.4)]"
          >
            <Play size={16} fill="currentColor" />
            Play now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero