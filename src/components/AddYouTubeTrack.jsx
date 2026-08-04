import { useState } from 'react'
import { Video } from 'lucide-react'
import { extractYouTubeId, fetchYouTubeMeta } from '../services/youtube'
import { useToastStore } from '../store/useToastStore'
import { usePlayerStore } from '../store/usePlayerStore'

function AddYouTubeTrack() {
  const onAdd = usePlayerStore((s) => s.addYoutubeTrack)
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const videoId = extractYouTubeId(url)
    if (!videoId) {
      useToastStore.getState().addToast('Could not read a YouTube link from that')
      return
    }

    setIsLoading(true)
    try {
      const meta = await fetchYouTubeMeta(videoId)
      const track = {
        id: `yt-${videoId}`,
        title: meta.title,
        artist: meta.author,
        album: 'YouTube',
        duration: 0,
        cover: meta.thumbnail,
        isYouTube: true,
        youtubeId: videoId,
      }
      onAdd(track)
      useToastStore.getState().addToast(`Added "${meta.title}"`)
      setUrl('')
    } catch (err) {
      console.error('YouTube meta fetch failed:', err)
      useToastStore.getState().addToast('Could not load that video')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <label className="font-lcd text-taupe text-xs tracking-widest flex items-center gap-1.5">
        <Video size={13} />
        ADD FROM YOUTUBE
      </label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a YouTube link..."
        className="metal-panel-raised rounded-md px-2.5 py-1.5 text-xs placeholder:text-taupe/60 focus:outline-none focus:ring-1 focus:ring-phosphor/50"
      />
      <button
        type="submit"
        disabled={!url.trim() || isLoading}
        className="press-active text-xs font-lcd tracking-widest text-taupe hover:text-phosphor border border-white/10 hover:border-phosphor/50 rounded px-2 py-1.5 disabled:opacity-30"
      >
        {isLoading ? 'LOADING...' : 'LOAD VIDEO'}
      </button>
    </form>
  )
}

export default AddYouTubeTrack