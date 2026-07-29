import { create } from 'zustand'

const audio = typeof Audio !== 'undefined' ? new Audio() : null
if (audio) audio.volume = 0.8

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
  repeatMode: 'off', // 'off' | 'all' | 'one'
  recentlyPlayed: [],

  setLibrary: (library) => set({ library }),

  playTrack: (track) => {
    const { currentTrack } = get()
    if (!audio) return
    if (currentTrack?.id === track.id) {
      get().togglePlay()
      return
    }
    audio.src = track.src
    audio.play()
    set((s) => ({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      recentlyPlayed: [track, ...s.recentlyPlayed.filter((t) => t.id !== track.id)].slice(0, 12),
    }))
  },

  togglePlay: () => {
    const { currentTrack, isPlaying } = get()
    if (!audio || !currentTrack) return
    if (isPlaying) {
      audio.pause()
      set({ isPlaying: false })
    } else {
      audio.play()
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

  addToQueue: (track) => set((s) => ({ queue: [...s.queue, track] })),
  removeFromQueue: (index) => set((s) => ({ queue: s.queue.filter((_, i) => i !== index) })),
  moveInQueue: (index, direction) =>
    set((s) => {
      const q = [...s.queue]
      const target = index + direction
      if (target < 0 || target >= q.length) return {}
      ;[q[index], q[target]] = [q[target], q[index]]
      return { queue: q }
    }),

  createPlaylist: (name) =>
    set((s) => ({ playlists: [...s.playlists, { id: crypto.randomUUID(), name, trackIds: [] }] })),
  addTrackToPlaylist: (playlistId, trackId) =>
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId && !p.trackIds.includes(trackId) ? { ...p, trackIds: [...p.trackIds, trackId] } : p
      ),
    })),

  toggleLike: (trackId) =>
    set((s) => ({
      likedTrackIds: s.likedTrackIds.includes(trackId)
        ? s.likedTrackIds.filter((id) => id !== trackId)
        : [...s.likedTrackIds, trackId],
    })),

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  cycleRepeat: () =>
    set((s) => ({
      repeatMode: s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
    })),
}))

if (audio) {
  audio.addEventListener('timeupdate', () => usePlayerStore.setState({ currentTime: audio.currentTime }))
  audio.addEventListener('loadedmetadata', () => usePlayerStore.setState({ duration: audio.duration }))
  audio.addEventListener('ended', () => usePlayerStore.getState().next())
}