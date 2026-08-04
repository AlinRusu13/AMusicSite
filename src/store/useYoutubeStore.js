import { create } from 'zustand'

let player = null
let apiReadyPromise = null

function loadYouTubeAPI() {
  if (apiReadyPromise) return apiReadyPromise
  apiReadyPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve()
      return
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => resolve()
  })
  return apiReadyPromise
}

export const useYouTubeStore = create((set, get) => ({
  isReady: false,
  currentVideoId: null,
  pendingVideoId: null,

  initPlayer: async (elementId) => {
    await loadYouTubeAPI()
    player = new window.YT.Player(elementId, {
      height: '100%',
      width: '100%',
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onReady: () => {
          set({ isReady: true })
          // If a track tried to load before the player was ready, play it now
          const { pendingVideoId } = get()
          if (pendingVideoId) {
            player.loadVideoById(pendingVideoId)
            set({ currentVideoId: pendingVideoId, pendingVideoId: null })
          }
        },
        onError: (e) => {
          console.error('YouTube player error, code:', e.data)
        },
      },
    })
  },

  loadAndPlay: (videoId) => {
    if (!player || !get().isReady) {
      // Not ready yet — remember it, onReady will pick it up automatically
      console.warn('YouTube player not ready yet, queuing video:', videoId)
      set({ pendingVideoId: videoId })
      return
    }
    player.loadVideoById(videoId)
    set({ currentVideoId: videoId })
  },

  play: () => player?.playVideo(),
  pause: () => player?.pauseVideo(),
  seekTo: (seconds) => player?.seekTo(seconds, true),
  getCurrentTime: () => player?.getCurrentTime?.() || 0,
  getDuration: () => player?.getDuration?.() || 0,
}))