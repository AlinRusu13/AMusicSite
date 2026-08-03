import { usePlayerStore } from '../store/usePlayerStore'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 5) return 'Late night spin'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function HomeHeader({ trackCount }) {
  const likedTrackIds = usePlayerStore((s) => s.likedTrackIds)
  const playlists = usePlayerStore((s) => s.playlists)
  const playCounts = usePlayerStore((s) => s.playCounts)

  const totalPlays = Object.values(playCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="mb-8">
      <h2 className="font-display font-bold text-3xl mb-2">{getGreeting()}</h2>
      <div className="flex items-center gap-4 font-lcd text-taupe text-sm tracking-wide">
        <span>{trackCount} tracks in reach</span>
        <span className="w-1 h-1 rounded-full bg-taupe" />
        <span>{likedTrackIds.length} liked</span>
        <span className="w-1 h-1 rounded-full bg-taupe" />
        <span>{playlists.length} mixtapes</span>
        {totalPlays > 0 && (
          <>
            <span className="w-1 h-1 rounded-full bg-taupe" />
            <span>{totalPlays} spins this session</span>
          </>
        )}
      </div>
    </div>
  )
}

export default HomeHeader