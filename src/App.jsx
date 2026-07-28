import { useState } from 'react'
import { tracks } from './data/tracks'
import TrackList from './components/TrackList'
import PlayerBar from './components/PlayerBar'
import Hero from './components/Hero'
import RecordCrate from './components/RecordCrate'
import PowerSwitch from './components/PowerSwitch'
import { usePlayer } from './hooks/usePlayer'

function Bolt({ className }) {
  return (
    <span
      className={`absolute w-1.5 h-1.5 rounded-full bg-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${className}`}
    />
  )
}

function App() {
  const player = usePlayer(tracks)
  const [isOn, setIsOn] = useState(true)
  const featuredTrack = tracks[0]

  function togglePower() {
    if (isOn && player.isPlaying) {
      player.togglePlay() // pause when powering off
    }
    setIsOn(!isOn)
  }

  return (
    <div className="h-screen flex flex-col bg-void text-paper font-body relative">
      <div className="grain-overlay" />
      <div className="scanline-overlay" />

      <div className="flex flex-1 overflow-hidden">
        <aside className="relative w-64 metal-panel flex flex-col p-5 gap-6 border-r border-black/50">
          <Bolt className="top-2 left-2" />
          <Bolt className="top-2 right-2" />
          <Bolt className="bottom-2 left-2" />
          <Bolt className="bottom-2 right-2" />

          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl tracking-tight">REELS</h1>
              <p className="font-lcd text-phosphor text-lg tracking-widest [text-shadow:0_0_6px_rgba(107,255,143,0.6)]">
                // NOW SPINNING
              </p>
            </div>
          </div>

          <PowerSwitch isOn={isOn} onToggle={togglePower} />

          <nav className="flex flex-col gap-1 text-sm">
            {['Home', 'Search', 'Your Library'].map((label) => (
              <a
                key={label}
                href="#"
                className="flex items-center gap-2 text-taupe hover:text-paper transition-colors py-1.5 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-taupe group-hover:bg-cyan group-hover:shadow-[0_0_6px_rgba(34,211,238,0.8)] transition-all" />
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 relative">
          {!isOn && (
            <div className="absolute inset-0 z-40 bg-void/90 flex items-center justify-center">
              <p className="font-lcd text-taupe text-2xl tracking-[0.3em]">// POWER OFF</p>
            </div>
          )}
          <Hero track={featuredTrack} onPlay={player.playTrack} />
          <RecordCrate tracks={tracks} onPlay={player.playTrack} />

          <h3 className="font-display font-bold text-xl mb-4">All Tracks</h3>
          <TrackList
            tracks={tracks}
            onTrackSelect={player.playTrack}
            currentTrackId={player.currentTrack?.id}
          />
        </main>
      </div>

      <PlayerBar player={player} />
    </div>
  )
}

export default App