import { create } from 'zustand'
import { useToastStore } from './useToastStore'
import { useYouTubeStore } from './useYouTubeStore'

// If sound issues ever come back, flip this to false — it guarantees
// audio playback by fully skipping the Web Audio analysis graph (EQ bars will stay flat).
const ENABLE_AUDIO_ANALYSIS = false

const audio = typeof Audio !== 'undefined' ? new Audio() : null
if (audio) {
  audio.volume = 0.8
}

let audioContext = null
let analyser = null
let sourceNode = null
let gainNode = null
let fadeInterval = null

function ensureAudioGraph() {
  if (!audio || audioContext || !ENABLE_AUDIO_ANALYSIS) return
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    sourceNode = audioContext.createMediaElementSource(audio)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 64
    gainNode = audioContext.createGain()
    gainNode.gain.value = 1

    sourceNode.connect(analyser)
    analyser.connect(gainNode)
    gainNode.connect(audioContext.destination)
  } catch (e) {
    console.warn('Web Audio graph failed, disabling analysis (sound still plays normally):', e)
    audioContext = null
    analyser = null
  }
}

async function resumeContextIfNeeded() {
  if (audioContext && audioContext.state === 'suspended') {
    try {
      await audioContext.resume()
    } catch (e) {
      console.warn('AudioContext resume failed:', e)
    }
  }
}

export function getAnalyser() {
  return analyser
}

function fade(from, to, durationMs, onDone) {
  clearInterval(fadeInterval)
  const steps = 12
  const stepTime = durationMs / steps
  let i = 0
  fadeInterval = setInterval(() => {
  const { currentTrack, isPlaying } = usePlayerStore.getState()
  if (currentTrack?.isYouTube && isPlaying) {
    const yt = useYouTubeStore.getState()
    usePlayerStore.setState({
      currentTime: yt.getCurrentTime(),
      duration: yt.getDuration(),
    })
  }
}, 500)
}

export const usePlayerStore = create((set, get) => ({
  library: [],
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  queue: [],
  playlists: [],
  likedTrackIds: [],
  shuffle: false,
  repeatMode: 'off',
  recentlyPlayed: [],
  youtubeTracks: [],
  playCounts: {},

  setLibrary: (library) => set({ library }),

  playTrack: async (track) => {
    const { currentTrack, volume } = get()

    if (currentTrack?.id === track.id) {
      get().togglePlay()
      return
    }

    // Stop whichever engine was previously active
    if (currentTrack?.isYouTube) {
      useYouTubeStore.getState().pause()
    } else if (audio) {
      audio.pause()
    }

    if (track.isYouTube) {
      if (!track.youtubeId) {
        console.error('YouTube track missing video ID:', track)
        return
      }
      useYouTubeStore.getState().loadAndPlay(track.youtubeId)
      set((s) => ({
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        recentlyPlayed: [track, ...s.recentlyPlayed.filter((t) => t.id !== track.id)].slice(0, 12),
        playCounts: { ...s.playCounts, [track.id]: (s.playCounts[track.id] || 0) + 1 },
      }))
      return
    }

    if (!audio) return
    if (!track.src) {
      console.error('Track has no playable audio source:', track)
      useToastStore.getState().addToast(`No audio source for "${track.title}"`)
      return
    }

    ensureAudioGraph()
    await resumeContextIfNeeded()

    audio.src = track.src
    audio.volume = volume
    audio.play().catch((err) => {
      console.error('Playback failed for track:', track.title, track.src, err)
      useToastStore.getState().addToast(`Couldn't play "${track.title}" — see console`)
      set({ isPlaying: false })
    })
    set((s) => ({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      recentlyPlayed: [track, ...s.recentlyPlayed.filter((t) => t.id !== track.id)].slice(0, 12),
      playCounts: { ...s.playCounts, [track.id]: (s.playCounts[track.id] || 0) + 1 },
    }))
  },

togglePlay: async () => {
    const { currentTrack, isPlaying } = get()
    if (!currentTrack) return

    if (currentTrack.isYouTube) {
      if (isPlaying) useYouTubeStore.getState().pause()
      else useYouTubeStore.getState().play()
      set({ isPlaying: !isPlaying })
      return
    }

    if (!audio) return
    await resumeContextIfNeeded()
    if (isPlaying) {
      audio.pause()
      set({ isPlaying: false })
    } else {
      audio.play().catch((err) => console.error('Resume playback failed:', err))
      set({ isPlaying: true })
    }
  },

  addYoutubeTrack: (track) => set((s) => ({ youtubeTracks: [...s.youtubeTracks, track] })),

  loadPersistedState: (data) =>
    set({
      playlists: data.playlists || [],
      likedTrackIds: data.likedTrackIds || [],
      playCounts: data.playCounts || {},
      youtubeTracks: data.youtubeTracks || [],
    }),

  seek: (time) => {
    const { currentTrack } = get()
    if (currentTrack?.isYouTube) {
      useYouTubeStore.getState().seekTo(time)
      set({ currentTime: time })
      return
    }
    if (!audio) return
    audio.currentTime = time
    set({ currentTime: time })
  },

  changeVolume: (v) => {
    if (!audio) return
    audio.volume = v
    set({ volume: v })
  },

  next: () => {
    const { queue, currentTrack, library, shuffle, repeatMode } = get()
    if (repeatMode === 'one') {
      if (audio) { audio.currentTime = 0; audio.play() }
      return
    }
    if (queue.length > 0) {
      const [nextTrack, ...rest] = queue
      set({ queue: rest })
      get().playTrack(nextTrack)
      return
    }
    if (!currentTrack || library.length === 0) return
    if (shuffle) {
      const options = library.filter((t) => t.id !== currentTrack.id)
      const pick = options[Math.floor(Math.random() * options.length)] || currentTrack
      get().playTrack(pick)
      return
    }
    const idx = library.findIndex((t) => t.id === currentTrack.id)
    const isLast = idx === library.length - 1
    if (isLast && repeatMode !== 'all') {
      if (audio) audio.pause()
      set({ isPlaying: false })
      return
    }
    get().playTrack(library[(idx + 1) % library.length])
  },

  prev: () => {
    const { currentTrack, library } = get()
    if (!currentTrack || library.length === 0) return
    const idx = library.findIndex((t) => t.id === currentTrack.id)
    get().playTrack(library[(idx - 1 + library.length) % library.length])
  },

  addToQueue: (track) => {
    set((s) => ({ queue: [...s.queue, track] }))
    useToastStore.getState().addToast(`Added "${track.title}" to queue`)
  },
  removeFromQueue: (index) => set((s) => ({ queue: s.queue.filter((_, i) => i !== index) })),
  moveInQueue: (index, direction) =>
    set((s) => {
      const q = [...s.queue]
      const target = index + direction
      if (target < 0 || target >= q.length) return {}
      ;[q[index], q[target]] = [q[target], q[index]]
      return { queue: q }
    }),
  reorderQueue: (fromIndex, toIndex) =>
    set((s) => {
      const q = [...s.queue]
      const [moved] = q.splice(fromIndex, 1)
      q.splice(toIndex, 0, moved)
      return { queue: q }
    }),

  createPlaylist: (name) => {
    set((s) => ({ playlists: [...s.playlists, { id: crypto.randomUUID(), name, trackIds: [] }] }))
    useToastStore.getState().addToast(`Created playlist "${name}"`)
  },
  createMixtape: (name, trackIds) => {
    const id = crypto.randomUUID()
    set((s) => ({ playlists: [...s.playlists, { id, name, trackIds }] }))
    useToastStore.getState().addToast(`Mixtape "${name}" saved`)
    return id
  },
  addTrackToPlaylist: (playlistId, trackId) => {
    const playlist = get().playlists.find((p) => p.id === playlistId)
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId && !p.trackIds.includes(trackId) ? { ...p, trackIds: [...p.trackIds, trackId] } : p
      ),
    }))
    if (playlist) useToastStore.getState().addToast(`Added to "${playlist.name}"`)
  },
  removeTrackFromPlaylist: (playlistId, trackId) =>
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p
      ),
    })),

  toggleLike: (trackId) => {
    const wasLiked = get().likedTrackIds.includes(trackId)
    set((s) => ({
      likedTrackIds: wasLiked ? s.likedTrackIds.filter((id) => id !== trackId) : [...s.likedTrackIds, trackId],
    }))
    useToastStore.getState().addToast(wasLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs')
  },

  toggleShuffle: () => {
    set((s) => ({ shuffle: !s.shuffle }))
    useToastStore.getState().addToast(get().shuffle ? 'Shuffle on' : 'Shuffle off')
  },
  cycleRepeat: () => {
    set((s) => ({ repeatMode: s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off' }))
    useToastStore.getState().addToast(`Repeat: ${get().repeatMode}`)
  },
}))

if (audio) {
  audio.addEventListener('timeupdate', () => usePlayerStore.setState({ currentTime: audio.currentTime }))
  audio.addEventListener('loadedmetadata', () => usePlayerStore.setState({ duration: audio.duration }))
  audio.addEventListener('ended', () => usePlayerStore.getState().next())
  audio.addEventListener('error', () => {
    const err = audio.error
    console.error('Audio element error:', err?.code, err?.message, 'src:', audio.src)
  })
}