import { useState, useEffect } from 'react'
import { tracks as staticTracks } from './data/tracks'
import TrackList from './components/TrackList'
import PlayerBar from './components/PlayerBar'
import MasterBar from './components/MasterBar'
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
import DJBooth from './components/DJBooth'
import MixHistory from './components/MixHistory'
import GenreChips from './components/GenreChips'
import MadeForYou from './components/MadeForYou'
import HomeHeader from './components/HomeHeader'
import SleepTimer from './components/SleepTimer'
import AddYouTubeTrack from './components/AddYouTubeTrack'
import YouTubePlayerMount from './components/YouTubePlayerMount'
import AuthScreen from './components/AuthScreen'
import ProfilePage from './components/ProfilePage'
import { usePlayerStore } from './store/usePlayerStore'
import { useDeckStore } from './store/useDeckStore'
import { useAuthStore } from './store/useAuthStore'
import { useProfileStore } from './store/useProfileStore'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useJamendoSearch } from './hooks/useJamendoSearch'
import { useJamendoDiscover } from './hooks/useJamendoDiscover'
import { useJamendoTag } from './hooks/useJamendoTag'
import { useAutoSave } from './hooks/useAutoSave'
import { loadUserData } from './services/userData'
import { Plus, Heart, Disc3, Sliders, LogOut, Menu, X } from 'lucide-react'

function Bolt({ className }) {
  return <span className={`absolute w-1.5 h-1.5 rounded-full bg-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${className}`} />
}

function App() {
  useKeyboardShortcuts()
  useAutoSave()

  const user = useAuthStore((s) => s.user)
  const isAuthLoading = useAuthStore((s) => s.isLoading)
  const logout = useAuthStore((s) => s.logout)
  const initAuth = useAuthStore((s) => s.init)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  const loadPersistedState = usePlayerStore((s) => s.loadPersistedState)
  const loadProfile = useProfileStore((s) => s.loadProfile)
  useEffect(() => {
    if (!user) return
    loadUserData(user.uid).then((data) => {
      if (data) loadPersistedState(data)
      loadProfile(data)
    })
  }, [user, loadPersistedState, loadProfile])

  const [isBooting, setIsBooting] = useState(true)
  const [uploadedTracks, setUploadedTracks] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { tracks: discoverTracks, isLoading: discoverLoading, error: discoverError } = useJamendoDiscover()

  const [searchTerm, setSearchTerm] = useState('')
  const { results: jamendoResults, isLoading: searchLoading, error: searchError } = useJamendoSearch(searchTerm)

  const youtubeTracks = usePlayerStore((s) => s.youtubeTracks)
  const allTracks = [...staticTracks, ...uploadedTracks, ...discoverTracks, ...youtubeTracks]

  const [isProfileOpen, setIsProfileOpen] = useState(false)

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
  }, [uploadedTracks.length, discoverTracks.length, youtubeTracks.length])

  const [isOn, setIsOn] = useState(true)
  const [powerAnim, setPowerAnim] = useState(null)
  const [appMode, setAppMode] = useState('listen')

  const [activePlaylistId, setActivePlaylistId] = useState(null)
  const [showLiked, setShowLiked] = useState(false)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false)
  const [isMixtapeMakerOpen, setIsMixtapeMakerOpen] = useState(false)

  const [activeGenre, setActiveGenre] = useState(null)
  const { tracks: genreTracks, isLoading: genreLoading } = useJamendoTag(activeGenre)

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

  function switchMode(mode) {
    if (mode === appMode) return
    if (appMode === 'listen' && usePlayerStore.getState().isPlaying) {
      usePlayerStore.getState().togglePlay()
    }
    if (appMode === 'mix') {
      const decks = useDeckStore.getState().decks
      if (decks.A.isPlaying) useDeckStore.getState().togglePlay('A')
      if (decks.B.isPlaying) useDeckStore.getState().togglePlay('B')
    }
    setAppMode(mode)
    setIsSidebarOpen(false)
  }

  function goHome() {
    setShowLiked(false)
    setActivePlaylistId(null)
    setSearchTerm('')
    setIsSidebarOpen(false)
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

  if (isAuthLoading) {
    return <div className="h-screen bg-void" />
  }

  if (!user) {
    return <AuthScreen />
  }

  if (isBooting) {
    return <BootSequence onDone={() => setIsBooting(false)} />
  }

  return (
    <div className="h-screen flex flex-col bg-void text-paper font-body relative">
      <div className="grain-overlay" />
      <div className="scanline-overlay" />
      <div className="dust-overlay" />

      <div className="flex flex-1 overflow-hidden relative">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 w-10 h-10 rounded-full metal-panel-raised border border-black/40 flex items-center justify-center"
        >
          <Menu size={18} />
        </button>

        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-void/80 z-30"
          />
        )}

        <aside
          className={`fixed md:relative inset-y-0 left-0 z-40 w-64 metal-panel flex flex-col p-5 gap-6 border-r border-black/50 overflow-y-auto transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden self-end text-taupe hover:text-paper"
          >
            <X size={20} />
          </button>

          <Bolt className="top-2 left-2" />
          <Bolt className="top-2 right-2" />
          <Bolt className="bottom-2 left-2" />
          <Bolt className="bottom-2 right-2" />

          <div className="-rotate-1 flex items-start justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl tracking-tight">REELS</h1>
              <p className="font-lcd text-phosphor text-lg tracking-widest [text-shadow:0_0_6px_rgba(255,59,59,0.6)]">// NOW SPINNING</p>
            </div>
          </div>

          <button
            onClick={() => { setIsProfileOpen(true); setIsSidebarOpen(false) }}
            className="press-active flex items-center justify-between metal-panel-raised rounded-md px-3 py-2 border border-black/40 text-left"
          >
            <span className="text-sm truncate">{user.displayName || 'You'}</span>
            <span
              onClick={(e) => { e.stopPropagation(); logout() }}
              className="text-taupe hover:text-red flex-shrink-0"
              title="Log out"
            >
              <LogOut size={14} />
            </span>
          </button>

          <PowerSwitch isOn={isOn} onToggle={togglePower} />

          <div className="metal-panel-raised rounded-lg p-1 flex gap-1 border border-black/40">
            <button
              onClick={() => switchMode('listen')}
              className={`press-active flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-lcd tracking-widest transition-colors ${
                appMode === 'listen' ? 'bg-phosphor text-void' : 'text-taupe hover:text-paper'
              }`}
            >
              <Disc3 size={13} />
              LISTEN
            </button>
            <button
              onClick={() => switchMode('mix')}
              className={`press-active flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-lcd tracking-widest transition-colors ${
                appMode === 'mix' ? 'bg-phosphor text-void' : 'text-taupe hover:text-paper'
              }`}
            >
              <Sliders size={13} />
              MIX
            </button>
          </div>

          {appMode === 'listen' && (
            <>
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
                  onClick={() => { setShowLiked(true); setActivePlaylistId(null); setSearchTerm(''); setIsSidebarOpen(false) }}
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
                      onClick={() => { setActivePlaylistId(p.id); setSearchTerm(''); setShowLiked(false); setIsSidebarOpen(false) }}
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
            </>
          )}

          {appMode === 'mix' && (
            <div className="flex-1 flex items-center justify-center">
              <p className="font-lcd text-taupe text-sm text-center tracking-wide leading-relaxed">
                // DRAG ANY TRACK<br />ONTO A DECK<br />TO START MIXING
              </p>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3">
            <SleepTimer />
            <AddYouTubeTrack />
            <UploadButton onFilesAdded={setUploadedTracks} />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-8 relative">
          {!isOn && (
            <div className="absolute inset-0 z-40 bg-void flex items-center justify-center">
              <p className="font-lcd text-taupe text-2xl tracking-[0.3em] opacity-40">// POWER OFF</p>
            </div>
          )}
          {powerAnim === 'off' && <div className="absolute inset-0 z-40 bg-void origin-center animate-crt-collapse" />}
          {powerAnim === 'on' && <div className="absolute inset-0 z-40 bg-phosphor animate-power-flash pointer-events-none" />}

          {appMode === 'mix' ? (
            <>
              <div className="mb-6">
                <p className="font-lcd text-phosphor text-sm tracking-[0.2em] mb-1 [text-shadow:0_0_6px_rgba(255,59,59,0.6)]">
                  // MIX MODE
                </p>
                <h2 className="font-display font-bold text-3xl">The Booth</h2>
              </div>
              <DJBooth />
              <h3 className="font-display font-bold text-xl mb-4">Track Library</h3>
              <TrackList tracks={allTracks} onTrackSelect={() => {}} currentTrackId={null} />
              <div className="h-8" />
              <MixHistory />
            </>
          ) : (
            <>
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
                  <p className="text-taupe text-sm mb-2">From Jamendo {searchLoading ? '(searching...)' : ''}</p>
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

                  <HomeHeader trackCount={allTracks.length} />

                  <GenreChips activeGenre={activeGenre} onSelect={setActiveGenre} />

                  {activeGenre ? (
                    <div className="section-block">
                      <h3 className="font-display font-bold text-xl mb-4">{activeGenre} Tracks</h3>
                      {genreLoading ? (
                        <p className="font-lcd text-taupe tracking-wide">// TUNING IN...</p>
                      ) : genreTracks.length === 0 ? (
                        <p className="font-lcd text-taupe tracking-wide">// NOTHING FOUND FOR THIS GENRE YET</p>
                      ) : (
                        <TrackList tracks={genreTracks} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
                      )}
                    </div>
                  ) : (
                    <>
                      <MadeForYou allTracks={allTracks} />

                      {recentlyPlayed.length > 0 && (
                        <div className="section-block">
                          <h3 className="font-display font-bold text-xl mb-4">Recently Played</h3>
                          <TrackList tracks={recentlyPlayed} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
                        </div>
                      )}

                      {playlists.length > 0 && (
                        <div className="section-block">
                          <h3 className="font-display font-bold text-xl mb-4">Mixtape Shelf</h3>
                          <div className="flex flex-wrap gap-4">
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
                        </div>
                      )}

                      <div className="section-block">
                        <h3 className="font-display font-bold text-xl mb-4">Discover — Real Tracks</h3>
                        {discoverError && (
                          <p className="font-lcd text-red tracking-wide mb-4">
                            // COULDN'T LOAD JAMENDO — CHECK YOUR CLIENT_ID IN src/services/jamendo.js
                          </p>
                        )}
                        {discoverLoading ? (
                          <p className="font-lcd text-taupe tracking-wide">// TUNING IN...</p>
                        ) : (
                          <RecordCrate tracks={discoverTracks} onPlay={playTrack} />
                        )}
                      </div>

                      {uploadedTracks.length > 0 && (
                        <div className="section-block">
                          <h3 className="font-display font-bold text-xl mb-4">Your Library</h3>
                          <TrackList tracks={uploadedTracks} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
                        </div>
                      )}

                      {youtubeTracks.length > 0 && (
                        <div className="section-block">
                          <h3 className="font-display font-bold text-xl mb-4">From YouTube</h3>
                          <TrackList tracks={youtubeTracks} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
                        </div>
                      )}

                      <div className="section-block">
                        <h3 className="font-display font-bold text-xl mb-4">Demo Tracks</h3>
                        <TrackList tracks={staticTracks} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </main>

        <QueuePanel isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      </div>

      <div className="flex-shrink-0">
        {appMode === 'mix' ? (
          <MasterBar />
        ) : (
          <PlayerBar onExpand={() => setIsNowPlayingOpen(true)} onToggleQueue={() => setIsQueueOpen((v) => !v)} />
        )}
      </div>

      <NowPlayingView isOpen={isNowPlayingOpen} onClose={() => setIsNowPlayingOpen(false)} />
      <MixtapeMaker isOpen={isMixtapeMakerOpen} onClose={() => setIsMixtapeMakerOpen(false)} />
      <ProfilePage isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <YouTubePlayerMount />
      <ToastContainer />
    </div>
  )
}

export default App