const GENRES = ['Chill', 'Electronic', 'Rock', 'Jazz', 'Lofi', 'Ambient', 'Pop', 'Acoustic']

function GenreChips({ activeGenre, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(activeGenre === genre ? null : genre)}
          className={`press-active px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            activeGenre === genre
              ? 'bg-phosphor text-void border-phosphor'
              : 'border-white/15 text-taupe hover:text-paper hover:border-white/30'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}

export default GenreChips