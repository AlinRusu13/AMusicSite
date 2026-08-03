import { Circle, Square } from 'lucide-react'
import { useRecordingStore } from '../store/useRecordingStore'

function formatElapsed(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function RecordButton() {
  const isRecording = useRecordingStore((s) => s.isRecording)
  const elapsedSeconds = useRecordingStore((s) => s.elapsedSeconds)
  const startRecording = useRecordingStore((s) => s.startRecording)
  const stopRecording = useRecordingStore((s) => s.stopRecording)

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`press-active flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
        isRecording ? 'border-phosphor bg-phosphor/10' : 'border-white/15 hover:border-white/30'
      }`}
    >
      {isRecording ? (
        <Square size={12} className="text-phosphor" fill="currentColor" />
      ) : (
        <Circle size={12} className="text-red" fill="currentColor" />
      )}
      <span className="font-lcd text-sm tracking-widest text-taupe">
        {isRecording ? `REC ${formatElapsed(elapsedSeconds)}` : 'REC'}
      </span>
    </button>
  )
}

export default RecordButton