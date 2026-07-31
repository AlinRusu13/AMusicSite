import { Plus, Heart } from 'lucide-react'
import { usePlayerStore } from '../store/usePlayerStore'

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function TrackList({ tracks, onTrackSelect, currentTrackId }) {
  const addToQueue = usePlayerStore((s) => s.addToQueue)
  const addTrackToPlaylist = usePlayerStore((s) => s.addTrackToPlaylist)
  const playlists = usePlayerStore((s) => s.playlists)
  const likedTrackIds = usePlayerStore((s) => s.likedTrackIds)
  const toggleLike = usePlayerStore((s) => s.toggleLike)

  function handleMenuChange(e, track) {
    const value = e.target.value
    if (value === 'queue') addToQueue(track)
    else if (value) addTrackToPlaylist(value, track.id)
    e.target.value = ''
  }

  function handleDragStart(e, track) {
    e.dataTransfer.setData('application/json', JSON.stringify(track))
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[24px_1fr_1fr_56px_32px_32px] gap-4 px-4 py-2 text-taupe uppercase tracking-widest border-b border-white/10 mb-2 font-lcd text-sm">
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span className="text-right">Time</span>
        <span></span>
        <span></span>
      </div>

      {tracks.map((track, index) => {
        const isActive = track.id === currentTrackId
        const isLiked = likedTrackIds.includes(track.id)

        return (
          <div
            key={track.id}
            draggable
            onDragStart={(e) => handleDragStart(e, track)}
            className={`grid grid-cols-[24px_1fr_1fr_56px_32px_32px] gap-4 px-4 py-2 rounded-md items-center transition-colors group cursor-grab active:cursor-grabbing ${
              isActive ? 'bg-panel' : 'hover:bg-white/5'
            }`}
          >
            <button onClick={() => onTrackSelect(track)} className="contents text-left">
              <span
                className={`font-lcd text-lg ${
                  isActive ? 'text-phosphor [text-shadow:0_0_6px_rgba(255,59,59,0.6)]' : 'text-taupe'
                }`}
              >
                {isActive ? '▶' : index + 1}
              </span>

              <span className="flex items-center gap-3 min-w-0">
                <img
                  src={track.cover}
                  alt={track.album}
                  className="w-10 h-10 rounded object-cover flex-shrink-0 border border-black/40"
                />
                <span className="flex flex-col min-w-0">
                  <span className={`font-medium truncate ${isActive ? 'text-phosphor' : 'text-paper'}`}>
                    {track.title}
                  </span>
                  <span className="text-sm text-taupe truncate">{track.artist}</span>
                </span>
              </span>

              <span className="text-sm text-taupe truncate self-center">{track.album}</span>
              <span className="text-sm text-taupe text-right">{formatDuration(track.duration)}</span>
            </button>

            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <select
                onChange={(e) => handleMenuChange(e, track)}
                defaultValue=""
                className="absolute inset-0 opacity-0 cursor-pointer w-6 h-6"
              >
                <option value="" disabled>+</option>
                <option value="queue">Add to Queue</option>
                {playlists.map((p) => (
                  <option key={p.id} value={p.id}>Add to {p.name}</option>
                ))}
              </select>
              <Plus size={16} className="text-taupe pointer-events-none" />
            </div>

            <button onClick={() => toggleLike(track.id)} className="press-active flex items-center justify-center">
              <Heart
                size={16}
                className={isLiked ? 'text-phosphor' : 'text-taupe hover:text-paper'}
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default TrackList