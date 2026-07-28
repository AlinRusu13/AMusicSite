function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function TrackList({ tracks, onTrackSelect, currentTrackId }) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[24px_1fr_1fr_56px] gap-4 px-4 py-2 text-taupe uppercase tracking-widest border-b border-white/10 mb-2 font-lcd text-sm">
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span className="text-right">Time</span>
      </div>

      {tracks.map((track, index) => {
        const isActive = track.id === currentTrackId
        return (
          <button
            key={track.id}
            onClick={() => onTrackSelect(track)}
            className={`grid grid-cols-[24px_1fr_1fr_56px] gap-4 px-4 py-2 rounded-md items-center text-left transition-colors group ${
              isActive ? 'bg-panel' : 'hover:bg-white/5'
            }`}
          >
            <span
              className={`font-lcd text-lg ${
                isActive ? 'text-phosphor [text-shadow:0_0_6px_rgba(107,255,143,0.6)]' : 'text-taupe'
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
        )
      })}
    </div>
  )
}

export default TrackList