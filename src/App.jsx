import { useState, useEffect } from 'react'
import { tracks as staticTracks } from './data/tracks'
import TrackList from './components/TrackList'
import PlayerBar from './components/PlayerBar'
import Turntable from './components/Turntable'
import RecordCrate from './components/RecordCrate'
import PowerSwitch from './components/PowerSwitch'
import UploadButton from './components/UploadButton'
import SearchBar from './components/SearchBar'
import QueuePanel from './components/QueuePanel'
import NowPlayingView from './components/NowPlayingView'
import ToastContainer from './components/ToastContainer'
import BootSequence from './components/BootSequence'
import MixtapeMaker from './components/MixtapeMaker'
import MixtapeIcon from './components/MixtapeIcon'
import { usePlayerStore } from './store/usePlayerStore'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useJamendoSearch } from './hooks/useJamendoSearch'
import { useJamendoDiscover } from './hooks/useJamendoDiscover'
import { Plus, Heart } from 'lucide-react'

function Bolt({ className }) {
  return <span className={`absolute w-1.5 h-1.5 rounded-full bg-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${className}`} />
}

function App() {
  useKeyboardShortcuts()

  const [isBooting, setIsBooting] = useState(true)
  const [uploadedTracks, setUploadedTracks] = useState([])

  const { tracks: discoverTracks, isLoading: discoverLoading, error: discoverError } = useJamendoDiscover()

  const [searchTerm, setSearchTerm] = useState('')
  const { results: jamendoResults, isLoading: searchLoading, error: searchError } = useJamendoSearch(searchTerm)

  const allTracks = [...staticTracks, ...uploadedTracks, ...discoverTracks]

  const setLibrary = usePlayerStore((s) => s.setLibrary)
  const playTrack = usePlayerStore((s) => s.playTrack)
  const togglePlay = usePlayerStore((s) => s.togglePlay)
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const playlists = usePlayerStore((s) => s.playlists)
  const likedTrackIds = usePlayerStore((s) => s.likedTrackIds)
  const recentlyPlayed = usePlayerStore((s) => s.recentlyPlayed)

  useEffect(() => {
    setLibrary(allTracks)
  }, [uploadedTracks.length, discoverTracks.length])

  const [isOn, setIsOn] = useState(true)
  const [powerAnim, setPowerAnim] = useState(null)

  const [activePlaylistId, setActivePlaylistId] = useState(null)
  const [showLiked, setShowLiked] = useState(false)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false)
  const [isMixtapeMakerOpen, setIsMixtapeMakerOpen] = useState(false)

  function togglePower() {
    if (isOn) {
      if (usePlayerStore.getState().isPlaying) usePlayerStore.getState().togglePlay()
      setPowerAnim('off')
      setTimeout(() => setIsOn(false), 350)
    } else {
      setIsOn(true)
      setPowerAnim('on')
      setTimeout(() => setPowerAnim(null), 500)
    }
  }

  function goHome() {
    setShowLiked(false)
    setActivePlaylistId(null)
    setSearchTerm('')
  }

  function handleTurntableToggle() {
    if (!currentTrack) return
    togglePlay()
  }

  const localSearchResults = searchTerm
    ? [...staticTracks, ...uploadedTracks].filter((t) =>
        [t.title, t.artist, t.album].some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : []

  const activePlaylist = playlists.find((p) => p.id === activePlaylistId)
  const activePlaylistTracks = activePlaylist ? allTracks.filter((t) => activePlaylist.trackIds.includes(t.id)) : []
  const likedSongsList = allTracks.filter((t) => likedTrackIds.includes(t.id))

  if (isBooting) {
    return <BootSequence onDone={() => setIsBooting(false)} />
  }

  return (
    <div className="h-screen flex flex-col bg-void text-paper font-body relative">
      <div className="grain-overlay" />
      <div className="scanline-overlay" />
      <div className="dust-overlay" />

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="relative w-64 metal-panel flex flex-col p-5 gap-6 border-r border-black/50 overflow-y-auto">
          <Bolt className="top-2 left-2" />
          <Bolt className="top-2 right-2" />
          <Bolt className="bottom-2 left-2" />
          <Bolt className="bottom-2 right-2" />

          <div className="-rotate-1">
            <h1 className="font-display font-bold text-2xl tracking-tight">REELS</h1>
            <p className="font-lcd text-phosphor text-lg tracking-widest [text-shadow:0_0_6px_rgba(255,59,59,0.6)]">// NOW SPINNING</p>
          </div>

          <PowerSwitch isOn={isOn} onToggle={togglePower} />

          <div className="flex flex-col gap-2.5">
            <button
              onClick={goHome}
              className={`tape-label -rotate-1 bg-panel-raised/60 text-left text-sm transition-colors ${
                !showLiked && !activePlaylistId && !searchTerm ? 'text-phosphor' : 'text-taupe hover:text-paper'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => { setShowLiked(true); setActivePlaylistId(null); setSearchTerm('') }}
              className={`tape-label rotate-1 bg-panel-raised/60 flex items-center gap-2 text-left text-sm transition-colors ${
                showLiked ? 'text-phosphor' : 'text-taupe hover:text-paper'
              }`}
            >
              <Heart size={13} fill={showLiked ? 'currentColor' : 'none'} />
              Liked Songs
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-lcd text-taupe text-sm tracking-widest">MIXTAPES</p>
              <button onClick={() => setIsMixtapeMakerOpen(true)} className="press-active text-taupe hover:text-phosphor">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {playlists.length === 0 && <p className="text-xs text-taupe">No mixtapes yet.</p>}
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setActivePlaylistId(p.id); setSearchTerm(''); setShowLiked(false) }}
                  className={`press-active flex items-center gap-2 text-left rounded-md p-1.5 transition-colors ${
                    activePlaylistId === p.id ? 'bg-panel-raised' : 'hover:bg-white/5'
                  }`}
                >
                  <MixtapeIcon trackCount={p.trackIds.length} size={40} />
                  <span className={`text-sm truncate ${activePlaylistId === p.id ? 'text-phosphor' : 'text-taupe'}`}>
                    {p.name}
                  </span>
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
            <div className="absolute inset-0 z-40 bg-void flex items-center justify-center">
              <p className="font-lcd text-taupe text-2xl tracking-[0.3em] opacity-40">// POWER OFF</p>
            </div>
          )}
          {powerAnim === 'off' && <div className="absolute inset-0 z-40 bg-void origin-center animate-crt-collapse" />}
          {powerAnim === 'on' && <div className="absolute inset-0 z-40 bg-phosphor animate-power-flash pointer-events-none" />}

          <SearchBar
            value={searchTerm}
            onChange={(v) => { setSearchTerm(v); setActivePlaylistId(null); setShowLiked(false) }}
          />

          {searchTerm ? (
            <>
              <h3 className="font-display font-bold text-xl mb-4">Results for "{searchTerm}"</h3>

              {searchError && (
                <p className="font-lcd text-red tracking-wide mb-4">
                  // JAMENDO SEARCH FAILED — CHECK YOUR CLIENT_ID IN jamendo.js
                </p>
              )}

              {localSearchResults.length > 0 && (
                <>
                  <p className="text-taupe text-sm mb-2">Your library</p>
                  <TrackList tracks={localSearchResults} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
                  <div className="h-6" />
                </>
              )}

              <p className="text-taupe text-sm mb-2">
                From Jamendo {searchLoading ? '(searching...)' : ''}
              </p>
              {jamendoResults.length === 0 && !searchLoading ? (
                <p className="font-lcd text-taupe tracking-wide">// NO MATCHES FOUND</p>
              ) : (
                <TrackList tracks={jamendoResults} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
              )}
            </>
          ) : showLiked ? (
            <>
              <h3 className="font-display font-bold text-xl mb-4">Liked Songs</h3>
              {likedSongsList.length === 0
                ? <p className="font-lcd text-taupe tracking-wide">// NO LIKED TRACKS YET</p>
                : <TrackList tracks={likedSongsList} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />}
            </>
          ) : activePlaylist ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <MixtapeIcon trackCount={activePlaylist.trackIds.length} size={64} />
                <h3 className="font-display font-bold text-xl">{activePlaylist.name}</h3>
              </div>
              {activePlaylistTracks.length === 0
                ? <p className="font-lcd text-taupe tracking-wide">// EMPTY — RECORD ONE VIA THE MIXTAPE MAKER</p>
                : <TrackList tracks={activePlaylistTracks} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />}
            </>
          ) : (
            <>
              <Turntable track={currentTrack} isPlaying={isPlaying} onTogglePlay={handleTurntableToggle} />

              {recentlyPlayed.length > 0 && (
                <>
                  <h3 className="font-display font-bold text-xl mb-4">Recently Played</h3>
                  <TrackList tracks={recentlyPlayed} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
                  <div className="h-8" />
                </>
              )}

              {playlists.length > 0 && (
                <>
                  <h3 className="font-display font-bold text-xl mb-4">Mixtape Shelf</h3>
                  <div className="flex flex-wrap gap-4 mb-10">
                    {playlists.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setActivePlaylistId(p.id)}
                        className="press-active flex flex-col items-center gap-2 metal-panel rounded-lg p-3 hover:-translate-y-1 transition-transform"
                      >
                        <MixtapeIcon trackCount={p.trackIds.length} size={72} />
                        <span className="text-xs text-taupe truncate max-w-[80px]">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <h3 className="font-display font-bold text-xl mb-4">Discover — Real Tracks</h3>
              {discoverError && (
                <p className="font-lcd text-red tracking-wide mb-4">
                  // COULDN'T LOAD JAMENDO — CHECK YOUR CLIENT_ID IN src/services/jamendo.js
                </p>
              )}
              {discoverLoading ? (
                <p className="font-lcd text-taupe tracking-wide mb-6">// TUNING IN...</p>
              ) : (
                <>
                  <RecordCrate tracks={discoverTracks} onPlay={playTrack} />
                </>
              )}

              {uploadedTracks.length > 0 && (
                <>
                  <h3 className="font-display font-bold text-xl mb-4">Your Library</h3>
                  <TrackList tracks={uploadedTracks} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
                  <div className="h-8" />
                </>
              )}

              <h3 className="font-display font-bold text-xl mb-4">Demo Tracks</h3>
              <TrackList tracks={staticTracks} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
            </>
          )}
        </main>

        <QueuePanel isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      </div>

      <PlayerBar onExpand={() => setIsNowPlayingOpen(true)} onToggleQueue={() => setIsQueueOpen((v) => !v)} />
      <NowPlayingView isOpen={isNowPlayingOpen} onClose={() => setIsNowPlayingOpen(false)} />
      <MixtapeMaker isOpen={isMixtapeMakerOpen} onClose={() => setIsMixtapeMakerOpen(false)} />
      <ToastContainer />
    </div>
  )
}

export default App