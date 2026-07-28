function RecordCrate({ tracks, onPlay }) {
  const albumsMap = {}
  tracks.forEach((t) => {
    if (!albumsMap[t.album]) {
      albumsMap[t.album] = { name: t.album, artist: t.artist, cover: t.cover, firstTrack: t }
    }
  })
  const albums = Object.values(albumsMap)

  return (
    <div className="mb-10">
      <h3 className="font-display font-bold text-xl mb-4">The Crate</h3>
      <div className="crate-wood rounded-lg p-6 overflow-x-auto">
        <div className="flex items-end gap-2 min-w-max px-2">
          {albums.map((album, i) => {
            const tilt = i % 2 === 0 ? '-rotate-2' : 'rotate-1'
            return (
              <div
                key={album.name}
                onClick={() => onPlay(album.firstTrack)}
                className={`group relative cursor-pointer flex-shrink-0 w-36 transition-all duration-300 hover:-translate-y-3 ${tilt} hover:rotate-0`}
              >
                {/* Vinyl disc peeking out above sleeve */}
                <div className="vinyl-disc absolute -top-5 left-1/2 -translate-x-1/2 w-28 h-28 transition-transform duration-300 group-hover:-translate-y-3 z-0" />

                {/* Album sleeve */}
                <div className="relative z-10 rounded-sm overflow-hidden border border-black/50 shadow-[0_6px_16px_rgba(0,0,0,0.5)]">
                  <img src={album.cover} alt={album.name} className="w-36 h-36 object-cover" />
                </div>

                <p className="mt-2 text-xs font-medium truncate">{album.name}</p>
                <p className="text-[11px] text-taupe truncate">{album.artist}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RecordCrate