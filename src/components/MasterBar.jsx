import { useEffect, useRef } from 'react'
import { Volume2 } from 'lucide-react'
import { useDeckStore, getMasterAnalyser } from '../store/useDeckStore'
import RecordButton from './RecordButton'

function DeckSummary({ label, align = 'left' }) {
  const deckState = useDeckStore((s) => s.decks[label])
  const { track, isPlaying } = deckState

  return (
    <div className={`flex items-center gap-2 w-48 min-w-0 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <span
        className={`font-lcd text-lg flex-shrink-0 ${isPlaying ? 'text-phosphor [text-shadow:0_0_6px_rgba(255,59,59,0.6)]' : 'text-taupe'}`}
      >
        {label}
      </span>
      <div className="min-w-0">
        {track ? (
          <>
            <p className="text-sm font-medium truncate">{track.title}</p>
            <p className="text-xs text-taupe truncate">{track.artist}</p>
          </>
        ) : (
          <p className="font-lcd text-taupe text-sm tracking-wide">// EMPTY</p>
        )}
      </div>
    </div>
  )
}

function VUNeedle({ channelOffset }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const smoothedRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = 70
    const height = 42
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    function draw() {
      ctx.clearRect(0, 0, width, height)
      const cx = width / 2
      const cy = height - 4
      const radius = height - 8

      ctx.beginPath()
      ctx.arc(cx, cy, radius, Math.PI, Math.PI * 2)
      ctx.strokeStyle = 'rgba(122,117,108,0.35)'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, radius, Math.PI * 1.7, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,59,59,0.5)'
      ctx.lineWidth = 2
      ctx.stroke()

      let level = 0
      const analyser = getMasterAnalyser()
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteTimeDomainData(data)
        // Compute a rough RMS-style level from waveform data, offset per channel for a lively L/R feel
        let sum = 0
        const offset = channelOffset
        for (let i = offset; i < data.length; i += 2) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }
        level = Math.sqrt(sum / (data.length / 2)) * 3.2
      }

      smoothedRef.current += (level - smoothedRef.current) * 0.3
      const clamped = Math.max(0, Math.min(1, smoothedRef.current))
      const angle = Math.PI + clamped * Math.PI

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(angle) * (radius - 3), cy + Math.sin(angle) * (radius - 3))
      ctx.strokeStyle = '#FF3B3B'
      ctx.lineWidth = 1.5
      ctx.shadowColor = 'rgba(255,59,59,0.7)'
      ctx.shadowBlur = 4
      ctx.stroke()
      ctx.shadowBlur = 0

      ctx.beginPath()
      ctx.arc(cx, cy, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#E8E4DC'
      ctx.fill()

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [channelOffset])

  return <canvas ref={canvasRef} style={{ width: 70, height: 42 }} />
}

function MasterBar() {
  const masterVolume = useDeckStore((s) => s.masterVolume)
  const setMasterVolume = useDeckStore((s) => s.setMasterVolume)
  const crossfader = useDeckStore((s) => s.crossfader)

  return (
    <div className="relative h-20 metal-panel-raised border-t border-black/60 flex items-center gap-6 px-5">
      <DeckSummary label="A" />

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex flex-col items-center gap-0.5">
          <VUNeedle channelOffset={0} />
          <span className="font-lcd text-[10px] text-taupe tracking-widest">L</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <VUNeedle channelOffset={1} />
          <span className="font-lcd text-[10px] text-taupe tracking-widest">R</span>
        </div>
      </div>

<div className="flex-1 flex flex-col items-center gap-1.5 max-w-xs mx-auto">
  <RecordButton />
  <div className="w-full h-1.5 rounded-full bg-panel overflow-hidden relative">
    <div
      className="absolute inset-y-0 left-0 bg-phosphor rounded-full transition-all"
      style={{ width: `${(1 - Math.abs(crossfader - 0.5) * 2) * 100}%`, opacity: 0.7 }}
    />
  </div>
</div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Volume2 size={16} className="text-taupe" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={masterVolume}
          onChange={(e) => setMasterVolume(Number(e.target.value))}
          className="w-20 h-1 accent-phosphor cursor-pointer"
        />
      </div>

      <DeckSummary label="B" align="right" />
    </div>
  )
}

export default MasterBar