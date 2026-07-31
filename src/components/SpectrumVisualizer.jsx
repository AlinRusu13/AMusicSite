import { useEffect, useRef } from 'react'
import { getAnalyser } from '../store/usePlayerStore'

function SpectrumVisualizer({ isPlaying }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      const analyser = getAnalyser()
      const width = canvas.width
      const height = canvas.height
      ctx.clearRect(0, 0, width, height)

      if (analyser && isPlaying) {
        analyser.fftSize = 256
        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)

        const barCount = 64
        const step = Math.floor(data.length / barCount)
        const barWidth = width / barCount

        for (let i = 0; i < barCount; i++) {
          const value = data[i * step] || 0
          const barHeight = (value / 255) * height
          const x = i * barWidth

          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight)
          gradient.addColorStop(0, '#7A1F1F')
          gradient.addColorStop(0.6, '#E8483B')
          gradient.addColorStop(1, '#FF3B3B')
          ctx.fillStyle = gradient
          ctx.fillRect(x + barWidth * 0.15, height - barHeight, barWidth * 0.7, barHeight)
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [isPlaying])

  return <canvas ref={canvasRef} className="w-full h-24" />
}

export default SpectrumVisualizer