import { useState } from 'react'
import { X, GripVertical } from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'

function QueuePanel({ isOpen, onClose }) {
  const queue = usePlayerStore((s) => s.queue)
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue)
  const reorderQueue = usePlayerStore((s) => s.reorderQueue)

  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  if (!isOpen) return null

  function handleDrop(dropIndex) {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      setOverIndex(null)
      return
    }
    reorderQueue(dragIndex, dropIndex)
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 metal-panel border-l border-black/50 z-30 flex flex-col p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg">Up Next</h3>
        <button onClick={onClose} className="text-taupe hover:text-paper">
          <X size={18} />
        </button>
      </div>

      {queue.length === 0 ? (
        <p className="font-lcd text-taupe text-lg tracking-wide">// QUEUE EMPTY</p>
      ) : (
        <div className="flex flex-col gap-2">
          {queue.map((track, i) => (
            <div
              key={`${track.id}-${i}`}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => { e.preventDefault(); setOverIndex(i) }}
              onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
              onDrop={() => handleDrop(i)}
              className={`flex items-center gap-2 bg-panel-raised rounded-md p-2 transition-all cursor-grab active:cursor-grabbing ${
                dragIndex === i ? 'opacity-40' : ''
              } ${overIndex === i && dragIndex !== null && dragIndex !== i ? 'ring-1 ring-phosphor' : ''}`}
            >
              <GripVertical size={14} className="text-taupe flex-shrink-0" />
              <img src={track.cover} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.title}</p>
                <p className="text-xs text-taupe truncate">{track.artist}</p>
              </div>
              <button onClick={() => removeFromQueue(i)} className="text-taupe hover:text-red flex-shrink-0">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QueuePanel