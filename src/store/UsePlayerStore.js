import { create } from 'zustand'
import { useToastStore } from './useToastStore'

const audio = typeof Audio !== 'undefined' ? new Audio() : null
if (audio) audio.volume = 0.8

let audioContext = null
let analyser = null
let sourceNode = null
let fadeInterval = null

function ensureAudioGraph() {
  if (!audio || audioContext) return
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    sourceNode = audioContext.createMediaElementSource(audio)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 64
    sourceNode.connect(analyser)
    analyser.connect(audioContext.destination)
  } catch (e) {
    console.warn('Web Audio analysis unavailable, EQ will stay flat:', e)
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
    i++
    const t = i / steps
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * t))
    if (i >= steps) {
      clearInterval(fadeInterval)
      if (onDone) onDone()
    }
  }, stepTime)
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
  playCounts: {},

  setLibrary: (library) => set({ library }),

  playTrack: (track) => {
    const { currentTrack, volume } = get()
    if (!audio) return

    ensureAudioGraph()
    if (audioContext && audioContext.state === 'suspended') audioContext.resume()

    if (currentTrack?.id === track.id) {
      get().togglePlay()
      return
    }

    const startPlayback = () => {
      audio.src = track.src
      audio.volume = 0
      audio.play()
      fade(0, volume, 250)
      set((s) => ({
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        recentlyPlayed: [track, ...s.recentlyPlayed.filter((t) => t.id !== track.id)].slice(0, 12),
        playCounts: { ...s.playCounts, [track.id]: (s.playCounts[track.id] || 0) + 1 },
      }))
    }

    if (currentTrack && !audio.paused) {
      fade(audio.volume, 0, 200, startPlayback)
    } else {
      startPlayback()
    }
  },

  togglePlay: () => {
    const { currentTrack, isPlaying, volume } = get()
    if (!audio || !currentTrack) return
    if (audioContext && audioContext.state === 'suspended') audioContext.resume()
    if (isPlaying) {
      fade(audio.volume, 0, 150, () => audio.pause())
      set({ isPlaying: false })
    } else {
      audio.volume = 0
      audio.play()
      fade(0, volume, 150)
      set({ isPlaying: true })
    }
  },

  seek: (time) => {
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
}