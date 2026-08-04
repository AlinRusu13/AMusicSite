import { useState } from 'react'
import { Moon, X } from 'lucide-react'
import { useSleepTimerStore } from '../store/useSleepTimerStore'

const PRESETS = [15, 30, 45, 60]

function formatRemaining(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function SleepTimer() {
  const remainingSeconds = useSleepTimerStore((s) => s.remainingSeconds)
  const startTimer = useSleepTimerStore((s) => s.startTimer)
  const cancelTimer = useSleepTimerStore((s) => s.cancelTimer)
  const [isOpen, setIsOpen] = useState(false)

  const isActive = remainingSeconds !== null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`press-active w-full flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-lcd tracking-widest border transition-colors ${
          isActive ? 'border-phosphor text-phosphor bg-phosphor/10' : 'border-white/10 text-taupe hover:text-paper hover:border-white/30'
        }`}
      >
        <Moon size={13} />
        {isActive ? formatRemaining(remainingSeconds) : 'SLEEP TIMER'}
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 metal-panel-raised rounded-lg border border-black/50 p-3 flex flex-col gap-2 z-20">
          {isActive ? (
            <button
              onClick={() => { cancelTimer(); setIsOpen(false) }}
              className="press-active flex items-center justify-center gap-1.5 text-xs font-lcd tracking-widest text-red hover:text-paper py-1.5"
            >
              <X size={13} />
              CANCEL TIMER
            </button>
          ) : (
            PRESETS.map((mins) => (
              <button
                key={mins}
                onClick={() => { startTimer(mins); setIsOpen(false) }}
                className="press-active text-left text-sm text-taupe hover:text-phosphor py-1"
              >
                {mins} minutes
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default SleepTimer