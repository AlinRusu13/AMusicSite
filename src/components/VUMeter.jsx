import { useEffect, useRef } from 'react'
import { getAnalyser } from '../store/usePlayerStore'

function VUMeter({ isPlaying, width = 90, height = 52 }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const smoothedRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    function draw() {
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height - 4
      const radius = height - 10

      ctx.beginPath()
      ctx.arc(cx, cy, radius, Math.PI, Math.PI * 2)
      ctx.strokeStyle = 'rgba(122,117,108,0.35)'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, radius, Math.PI * 1.72, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,59,59,0.5)'
      ctx.lineWidth = 2
      ctx.stroke()

      let level = 0
      const analyser = getAnalyser()
      if (analyser && isPlaying) {
        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((a, b) => a + b, 0) / data.length
        level = avg / 255
      }

      smoothedRef.current += (level - smoothedRef.current) * 0.25
      const angle = Math.PI + smoothedRef.current * Math.PI

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(angle) * (radius - 4), cy + Math.sin(angle) * (radius - 4))
      ctx.strokeStyle = '#FF3B3B'
      ctx.lineWidth = 1.5
      ctx.shadowColor = 'rgba(255,59,59,0.7)'
      ctx.shadowBlur = 4
      ctx.stroke()
      ctx.shadowBlur = 0

      ctx.beginPath()
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = '#E8E4DC'
      ctx.fill()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, width, height])

  return <canvas ref={canvasRef} style={{ width, height }} />
}

export default VUMeter