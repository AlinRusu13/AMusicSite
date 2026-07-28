import { useState, useEffect } from 'react'
import { tracks as staticTracks } from './data/tracks'
import TrackList from './components/TrackList'
import PlayerBar from './components/PlayerBar'
import Hero from './components/Hero'
import RecordCrate from './components/RecordCrate'
import PowerSwitch from './components/PowerSwitch'
import UploadButton from './components/UploadButton'
import SearchBar from './components/SearchBar'
import QueuePanel from './components/QueuePanel'
import NowPlayingView from './components/NowPlayingView'
import { usePlayerStore } from './store/usePlayerStore'
import { Plus } from 'lucide-react'

function Bolt({ className }) {
  return <span className={`absolute w-1.5 h-1.5 rounded-full bg-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${className}`} />
}

function App() {
  const [uploadedTracks, setUploadedTracks] = useState([])
  const allTracks = [...staticTracks, ...uploadedTracks]

  const setLibrary = usePlayerStore((s) => s.setLibrary)
  const playTrack = usePlayerStore((s) => s.playTrack)
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const playlists = usePlayerStore((s) => s.playlists)
  const createPlaylist = usePlayerStore((s) => s.createPlaylist)

  useEffect(() => {
    setLibrary(allTracks)
  }, [uploadedTracks.length])

  const [isOn, setIsOn] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activePlaylistId, setActivePlaylistId] = useState(null)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false)

  const featuredTrack = staticTracks[0]

  function togglePower() {
    if (isOn && usePlayerStore.getState().isPlaying) usePlayerStore.getState().togglePlay()
    setIsOn(!isOn)
  }

  function handleNewPlaylist() {
    const name = window.prompt('Name your playlist:')
    if (name && name.trim()) createPlaylist(name.trim())
  }

  const searchResults = searchTerm
    ? allTracks.filter((t) => [t.title, t.artist, t.album].some((f) => f.toLowerCase().includes(searchTerm.toLowerCase())))
    : []

  const activePlaylist = playlists.find((p) => p.id === activePlaylistId)
  const activePlaylistTracks = activePlaylist ? allTracks.filter((t) => activePlaylist.trackIds.includes(t.id)) : []

  return (
    <div className="h-screen flex flex-col bg-void text-paper font-body relative">
      <div className="grain-overlay" />
      <div className="scanline-overlay" />

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="relative w-64 metal-panel flex flex-col p-5 gap-6 border-r border-black/50 overflow-y-auto">
          <Bolt className="top-2 left-2" />
          <Bolt className="top-2 right-2" />
          <Bolt className="bottom-2 left-2" />
          <Bolt className="bottom-2 right-2" />

          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight">REELS</h1>
            <p className="font-lcd text-phosphor text-lg tracking-widest [text-shadow:0_0_6px_rgba(255,59,59,0.6)]">// NOW SPINNING</p>
          </div>

          <PowerSwitch isOn={isOn} onToggle={togglePower} />

          <button
            onClick={() => { setActivePlaylistId(null); setSearchTerm('') }}
            className="flex items-center gap-2 text-taupe hover:text-paper transition-colors py-1.5 text-left text-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-taupe" />
            Home
          </button>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-lcd text-taupe text-sm tracking-widest">PLAYLISTS</p>
              <button onClick={handleNewPlaylist} className="text-taupe hover:text-phosphor">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {playlists.length === 0 && <p className="text-xs text-taupe">No playlists yet.</p>}
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setActivePlaylistId(p.id); setSearchTerm('') }}
                  className={`text-left text-sm py-1 truncate transition-colors ${activePlaylistId === p.id ? 'text-phosphor' : 'text-taupe hover:text-paper'}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <UploadButton onFilesAdded={setUploadedTracks} />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 relative">
          {!isOn && (
            <div className="absolute inset-0 z-40 bg-void/90 flex items-center justify-center">
              <p className="font-lcd text-taupe text-2xl tracking-[0.3em]">// POWER OFF</p>
            </div>
          )}

          <SearchBar value={searchTerm} onChange={(v) => { setSearchTerm(v); setActivePlaylistId(null) }} />

          {searchTerm ? (
            <>
              <h3 className="font-display font-bold text-xl mb-4">Results for "{searchTerm}"</h3>
              {searchResults.length === 0
                ? <p className="font-lcd text-taupe tracking-wide">// NO MATCHES FOUND</p>
                : <TrackList tracks={searchResults} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />}
            </>
          ) : activePlaylist ? (
            <>
              <h3 className="font-display font-bold text-xl mb-4">{activePlaylist.name}</h3>
              {activePlaylistTracks.length === 0
                ? <p className="font-lcd text-taupe tracking-wide">// EMPTY — ADD TRACKS USING THE + BUTTON ON ANY TRACK</p>
                : <TrackList tracks={activePlaylistTracks} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />}
            </>
          ) : (
            <>
              <Hero track={featuredTrack} onPlay={playTrack} />
              <RecordCrate tracks={staticTracks} onPlay={playTrack} />
              {uploadedTracks.length > 0 && (
                <>
                  <h3 className="font-display font-bold text-xl mb-4">Your Library</h3>
                  <TrackList tracks={uploadedTracks} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
                  <div className="h-8" />
                </>
              )}
              <h3 className="font-display font-bold text-xl mb-4">All Tracks</h3>
              <TrackList tracks={staticTracks} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
            </>
          )}
        </main>

        <QueuePanel isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      </div>

      <PlayerBar onExpand={() => setIsNowPlayingOpen(true)} onToggleQueue={() => setIsQueueOpen((v) => !v)} />
      <NowPlayingView isOpen={isNowPlayingOpen} onClose={() => setIsNowPlayingOpen(false)} />
    </div>
  )
}

export default App