import { useRef, useCallback, useEffect } from 'react'

function VolumeKnob({ value, onChange, size = 40 }) {
  const draggingRef = useRef(false)
  const lastY = useRef(0)

  const handlePointerDown = useCallback((e) => {
    draggingRef.current = true
    lastY.current = e.clientY
    document.body.style.cursor = 'ns-resize'
  }, [])

  useEffect(() => {
    function handlePointerMove(e) {
      if (!draggingRef.current) return
      const deltaY = lastY.current - e.clientY
      lastY.current = e.clientY
      const newValue = Math.min(1, Math.max(0, value + deltaY * 0.01))
      onChange(newValue)
    }
    function handlePointerUp() {
      draggingRef.current = false
      document.body.style.cursor = ''
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [value, onChange])

  const rotation = -135 + value * 270

  return (
    <div
      onPointerDown={handlePointerDown}
      className="relative rounded-full cursor-ns-resize select-none flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 35% 30%, #3a3632, #18140f 70%)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), 0 3px 6px rgba(0,0,0,0.6)',
      }}
      title="Drag up/down to adjust volume"
    >
      {Array.from({ length: 11 }).map((_, i) => {
        const tickAngle = -135 + (i / 10) * 270
        return (
          <span
            key={i}
            className="absolute w-[1.5px] h-1.5 bg-taupe/50"
            style={{
              top: '2px',
              left: '50%',
              transformOrigin: `50% ${size / 2 - 2}px`,
              transform: `translateX(-50%) rotate(${tickAngle}deg)`,
            }}
          />
        )
      })}
      <span
        className="absolute w-[2px] h-[40%] bg-phosphor rounded-full shadow-[0_0_4px_rgba(255,59,59,0.7)]"
        style={{
          top: '8%',
          left: '50%',
          transformOrigin: `50% ${size * 0.42}px`,
          transform: `translateX(-50%) rotate(${rotation}deg)`,
        }}
      />
    </div>
  )
}

export default VolumeKnob