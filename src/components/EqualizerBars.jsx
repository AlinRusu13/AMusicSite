import { useEffect, useRef } from 'react'
import { getAnalyser } from '../store/usePlayerStore'

function EqualizerBars({ isPlaying = false, barCount = 9 }) {
  const barRefs = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    function animate() {
      const analyser = getAnalyser()
      if (analyser && isPlaying) {
        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)
        const step = Math.max(1, Math.floor(data.length / barCount))
        barRefs.current.forEach((bar, i) => {
          if (!bar) return
          const value = data[i * step] || 0
          const height = Math.max(4, (value / 255) * 32)
          bar.style.height = `${height}px`
        })
      } else {
        barRefs.current.forEach((bar) => {
          if (bar) bar.style.height = '4px'
        })
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, barCount])

  return (
    <div className="flex items-end gap-[3px] h-8">
      {Array.from({ length: barCount }).map((_, i) => (
        <span
          key={i}
          ref={(el) => (barRefs.current[i] = el)}
          className="w-[3px] rounded-sm"
          style={{
            height: '4px',
            background: 'linear-gradient(to top, #7A1F1F, #E8483B 55%, #FF3B3B)',
          }}
        />
      ))}
    </div>
  )
}

export default EqualizerBars