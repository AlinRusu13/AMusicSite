import { useRef } from 'react'
import { Upload } from 'lucide-react'

function UploadButton({ onFilesAdded }) {
  const inputRef = useRef(null)

  function handleChange(e) {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    files.forEach((file) => {
      const url = URL.createObjectURL(file)
      const tempAudio = new Audio(url)

      const track = {
        id: `local-${crypto.randomUUID()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Your Library',
        album: 'Loaded Tapes',
        duration: 0,
        cover: 'https://picsum.photos/seed/localtape/300/300',
        src: url,
        isLocal: true,
      }

      tempAudio.addEventListener('loadedmetadata', () => {
        onFilesAdded((prev) =>
          prev.map((t) => (t.id === track.id ? { ...t, duration: tempAudio.duration } : t))
        )
      })

      onFilesAdded((prev) => [...prev, track])
    })

    e.target.value = '' // allow re-uploading the same file later
  }

  return (
    <>
      <button
        onClick={() => inputRef.current.click()}
        className="flex items-center gap-2 text-sm font-lcd tracking-widest text-taupe hover:text-phosphor transition-colors border border-white/10 hover:border-phosphor/50 rounded px-3 py-2"
      >
        <Upload size={14} />
        LOAD TAPE
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />
    </>
  )
}

export default UploadButton