import { useEffect, useState } from 'react'

function BootSequence({ onDone }) {
  const [phase, setPhase] = useState('dark') // dark -> flicker -> static -> done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('flicker'), 200)
    const t2 = setTimeout(() => setPhase('static'), 700)
    const t3 = setTimeout(() => setPhase('done'), 1100)
    const t4 = setTimeout(() => onDone(), 1400)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onDone])

  if (phase === 'done') return null

  return (
    <div className="fixed inset-0 z-[100] bg-void flex items-center justify-center">
      {phase === 'static' && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      )}
      {(phase === 'flicker' || phase === 'static') && (
        <span className="font-lcd text-phosphor text-6xl tracking-[0.3em] animate-boot-flicker [text-shadow:0_0_20px_rgba(255,59,59,0.8)]">
          REELS
        </span>
      )}
    </div>
  )
}

export default BootSequence