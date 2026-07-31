import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'
import MixtapeIcon from './MixtapeIcon'

function MixtapeMaker({ isOpen, onClose }) {
  const createMixtape = usePlayerStore((s) => s.createMixtape)
  const [name, setName] = useState('')
  const [draftTracks, setDraftTracks] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)

  if (!isOpen) return null

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    try {
      const track = JSON.parse(e.dataTransfer.getData('application/json'))
      if (track?.id && !draftTracks.some((t) => t.id === track.id)) {
        setDraftTracks((prev) => [...prev, track])
      }
    } catch (err) {
      // ignore malformed drops
    }
  }

  function removeDraftTrack(id) {
    setDraftTracks((prev) => prev.filter((t) => t.id !== id))
  }

  function handleClose() {
    setName('')
    setDraftTracks([])
    onClose()
  }

  function handleSave() {
    const finalName = name.trim() || 'Untitled Mixtape'
    createMixtape(finalName, draftTracks.map((t) => t.id))
    setName('')
    setDraftTracks([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[70] bg-void/95 flex items-center justify-center p-8">
      <div className="grain-overlay" />
      <div className="relative w-full max-w-3xl metal-panel-raised rounded-2xl border border-black/50 p-8 flex flex-col gap-6">
        <button onClick={handleClose} className="absolute top-4 right-4 text-taupe hover:text-paper">
          <X size={20} />
        </button>

        <div>
          <p className="font-lcd text-phosphor text-sm tracking-[0.2em] mb-1 [text-shadow:0_0_6px_rgba(255,59,59,0.6)]">
            // NEW MIXTAPE
          </p>
          <h2 className="font-display font-bold text-2xl">Record a mixtape</h2>
        </div>

        <div className="flex items-center gap-6">
          <MixtapeIcon trackCount={draftTracks.length} size={90} />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Side A..."
            className="flex-1 bg-transparent border-b border-white/20 focus:border-phosphor/60 outline-none font-display italic text-xl py-1 placeholder:text-taupe/60"
          />
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`min-h-[180px] max-h-[280px] overflow-y-auto rounded-lg border-2 border-dashed p-4 transition-colors ${
            isDragOver ? 'border-phosphor/70 bg-phosphor/5' : 'border-white/10'
          }`}
        >
          {draftTracks.length === 0 ? (
            <div className="h-full flex items-center justify-center min-h-[140px]">
              <p className="font-lcd text-taupe text-lg tracking-wide">// DRAG TRACKS HERE TO RECORD</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {draftTracks.map((track) => (
                <div key={track.id} className="flex items-center gap-3 bg-panel rounded-md p-2">
                  <img src={track.cover} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-taupe truncate">{track.artist}</p>
                  </div>
                  <button onClick={() => removeDraftTrack(track.id)} className="text-taupe hover:text-red flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-taupe">{draftTracks.length} track{draftTracks.length !== 1 ? 's' : ''} recorded</p>
          <button
            onClick={handleSave}
            disabled={draftTracks.length === 0}
            className="press-active bg-phosphor text-void font-medium px-5 py-2 rounded-full hover:scale-105 transition-transform shadow-[0_0_16px_rgba(255,59,59,0.4)] disabled:opacity-30 disabled:pointer-events-none"
          >
            Save Mixtape
          </button>
        </div>
      </div>
    </div>
  )
}

export default MixtapeMaker