import { useRef, useState } from 'react'
import { Play, Pause, Download, Trash2 } from 'lucide-react'
import { useRecordingStore } from '../store/useRecordingStore'

function RecordingItem({ recording }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const deleteRecording = useRecordingStore((s) => s.deleteRecording)

  function togglePlay() {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="flex items-center gap-3 bg-panel rounded-md p-3">
      <audio ref={audioRef} src={recording.url} onEnded={() => setIsPlaying(false)} className="hidden" />
      <button
        onClick={togglePlay}
        className="press-active w-9 h-9 rounded-full bg-phosphor text-void flex items-center justify-center flex-shrink-0"
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{recording.name}</p>
      </div>
      <a
        href={recording.url}
        download={`${recording.name}.webm`}
        className="press-active text-taupe hover:text-phosphor flex-shrink-0"
        title="Download"
      >
        <Download size={16} />
      </a>
      <button
        onClick={() => deleteRecording(recording.id)}
        className="press-active text-taupe hover:text-red flex-shrink-0"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  
  )
}

function MixHistory() {
  const recordings = useRecordingStore((s) => s.recordings)

  if (recordings.length === 0) return null

  return (
    <div className="mb-10">
      <h3 className="font-display font-bold text-xl mb-4">Your Mixes</h3>
      <div className="flex flex-col gap-2">
        {recordings.map((r) => (
          <RecordingItem key={r.id} recording={r} />
        ))}
      </div>
    </div>
  )
}

export default MixHistory