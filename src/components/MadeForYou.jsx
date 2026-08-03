import { usePlayerStore } from '../store/usePlayerStore'
import TrackList from './TrackList'

function MadeForYou({ allTracks }) {
  const likedTrackIds = usePlayerStore((s) => s.likedTrackIds)
  const playCounts = usePlayerStore((s) => s.playCounts)
  const playTrack = usePlayerStore((s) => s.playTrack)
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  // Build a simple taste profile from what's actually been liked/played,
  // then surface tracks sharing an artist with your top picks — real personalization,
  // not a static "recommended" list.
  const likedTracks = allTracks.filter((t) => likedTrackIds.includes(t.id))
  const mostPlayedIds = Object.entries(playCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id)
  const mostPlayedTracks = allTracks.filter((t) => mostPlayedIds.includes(t.id))

  const favoriteArtists = new Set([...likedTracks, ...mostPlayedTracks].map((t) => t.artist))

  const recommended = allTracks
    .filter((t) => favoriteArtists.has(t.artist) && !likedTrackIds.includes(t.id) && !mostPlayedIds.includes(t.id))
    .slice(0, 8)

  if (favoriteArtists.size === 0) {
    return (
      <div className="mb-10">
        <h3 className="font-display font-bold text-xl mb-2">Made For You</h3>
        <p className="font-lcd text-taupe tracking-wide">// LIKE OR PLAY A FEW TRACKS TO BUILD YOUR MIX</p>
      </div>
    )
  }

  if (recommended.length === 0) {
    return null
  }

  return (
    <div className="mb-10">
      <h3 className="font-display font-bold text-xl mb-1">Made For You</h3>
      <p className="text-taupe text-sm mb-4">
        Based on {[...favoriteArtists].slice(0, 3).join(', ')}
        {favoriteArtists.size > 3 ? ' and more' : ''}
      </p>
      <TrackList tracks={recommended} onTrackSelect={playTrack} currentTrackId={currentTrack?.id} />
    </div>
  )
}

export default MadeForYou