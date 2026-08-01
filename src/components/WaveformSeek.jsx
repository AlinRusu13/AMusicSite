import { useRef, useEffect, useMemo } from 'react'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function WaveformSeek({ trackId, currentTime, duration, onSeek }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // Generate a stable pseudo-waveform per track so it doesn't reshuffle every render
  const bars = useMemo(() => {
    const seed = trackId ? [...String(trackId)].reduce((a, c) => a + c.charCodeAt(0), 0) : 1
    const rand = seededRandom(seed || 1)
    return Array.from({ length: 80 }, () => 0.25 + rand() * 0.75)
  }, [trackId])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const dpr = window.devicePixelRatio || 1
    const width = container.clientWidth
    const height = container.clientHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    const progress = duration ? currentTime / duration : 0
    const barWidth = width / bars.length

    bars.forEach((amp, i) => {
      const barHeight = amp * height
      const x = i * barWidth
      const y = (height - barHeight) / 2
      const isPast = i / bars.length <= progress
      ctx.fillStyle = isPast ? '#FF3B3B' : 'rgba(122,117,108,0.35)'
      ctx.fillRect(x, y, barWidth * 0.6, barHeight)
    })
  }, [bars, currentTime, duration])

  function handleClick(e) {
    const rect = containerRef.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    onSeek(Math.max(0, Math.min(1, ratio)) * (duration || 0))
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="relative w-full h-8 cursor-pointer"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

export default WaveformSeek