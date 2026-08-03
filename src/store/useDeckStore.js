import { create } from 'zustand'

let audioContext = null
let masterGain = null
let masterAnalyser = null
let masterStreamDestination = null

function deck(label) {
  const audio = typeof Audio !== 'undefined' ? new Audio() : null
  return {
    label,
    audio,
    sourceNode: null,
    filterNode: null,
    gainNode: null,
    track: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    pitch: 0,
    filterValue: 1,
  }
}

const deckA = deck('A')
const deckB = deck('B')

function ensureContext() {
  if (audioContext) return
  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  masterGain = audioContext.createGain()
  masterGain.gain.value = 1

  masterAnalyser = audioContext.createAnalyser()
  masterAnalyser.fftSize = 256

  masterStreamDestination = audioContext.createMediaStreamDestination()

  masterGain.connect(masterAnalyser)
  masterAnalyser.connect(audioContext.destination)
  masterGain.connect(masterStreamDestination)

  ;[deckA, deckB].forEach((d) => {
    if (!d.audio) return
    d.sourceNode = audioContext.createMediaElementSource(d.audio)
    d.filterNode = audioContext.createBiquadFilter()
    d.filterNode.type = 'lowpass'
    d.filterNode.frequency.value = 20000
    d.gainNode = audioContext.createGain()
    d.gainNode.gain.value = d.label === 'A' ? 1 : 0

    d.sourceNode.connect(d.filterNode)
    d.filterNode.connect(d.gainNode)
    d.gainNode.connect(masterGain)
  })
}

function applyCrossfade(x) {
  const gainA = Math.cos((x * Math.PI) / 2)
  const gainB = Math.sin((x * Math.PI) / 2)
  if (deckA.gainNode) deckA.gainNode.gain.value = gainA
  if (deckB.gainNode) deckB.gainNode.gain.value = gainB
}

export function getMasterAnalyser() {
  return masterAnalyser
}

export function ensureAudioContext() {
  ensureContext()
}

export function getRecordingStream() {
  ensureContext()
  return masterStreamDestination ? masterStreamDestination.stream : null
}

export const useDeckStore = create((set, get) => ({
  crossfader: 0.5,
  masterVolume: 1,
  decks: {
    A: { track: null, isPlaying: false, currentTime: 0, duration: 0, pitch: 0, filterValue: 1 },
    B: { track: null, isPlaying: false, currentTime: 0, duration: 0, pitch: 0, filterValue: 1 },
  },

  loadTrack: (label, track) => {
    ensureContext()
    const d = label === 'A' ? deckA : deckB
    if (!d.audio || !track?.src) return
    d.audio.src = track.src
    d.audio.playbackRate = 1 + d.pitch / 100
    d.audio.play().catch((err) => console.error(`Deck ${label} playback failed:`, err))
    if (audioContext.state === 'suspended') audioContext.resume()

    set((s) => ({
      decks: { ...s.decks, [label]: { ...s.decks[label], track, isPlaying: true, currentTime: 0 } },
    }))
  },

  togglePlay: (label) => {
    const d = label === 'A' ? deckA : deckB
    const deckState = get().decks[label]
    if (!d.audio || !deckState.track) return
    if (audioContext?.state === 'suspended') audioContext.resume()

    if (deckState.isPlaying) {
      d.audio.pause()
    } else {
      d.audio.play().catch((err) => console.error(`Deck ${label} resume failed:`, err))
    }
    set((s) => ({ decks: { ...s.decks, [label]: { ...s.decks[label], isPlaying: !deckState.isPlaying } } }))
  },

  seek: (label, time) => {
    const d = label === 'A' ? deckA : deckB
    if (!d.audio) return
    d.audio.currentTime = time
    set((s) => ({ decks: { ...s.decks, [label]: { ...s.decks[label], currentTime: time } } }))
  },

  setPitch: (label, pitch) => {
    const d = label === 'A' ? deckA : deckB
    if (d.audio) d.audio.playbackRate = 1 + pitch / 100
    d.pitch = pitch
    set((s) => ({ decks: { ...s.decks, [label]: { ...s.decks[label], pitch } } }))
  },

  setFilter: (label, value) => {
    const d = label === 'A' ? deckA : deckB
    if (d.filterNode) {
      const freq = 200 * Math.pow(100, value)
      d.filterNode.frequency.value = freq
    }
    set((s) => ({ decks: { ...s.decks, [label]: { ...s.decks[label], filterValue: value } } }))
  },

  setCrossfader: (value) => {
    ensureContext()
    applyCrossfade(value)
    set({ crossfader: value })
  },

  setMasterVolume: (value) => {
    ensureContext()
    if (masterGain) masterGain.gain.value = value
    set({ masterVolume: value })
  },
}))

;[deckA, deckB].forEach((d) => {
  if (!d.audio) return
  d.audio.addEventListener('timeupdate', () => {
    useDeckStore.setState((s) => ({
      decks: { ...s.decks, [d.label]: { ...s.decks[d.label], currentTime: d.audio.currentTime } },
    }))
  })
  d.audio.addEventListener('loadedmetadata', () => {
    useDeckStore.setState((s) => ({
      decks: { ...s.decks, [d.label]: { ...s.decks[d.label], duration: d.audio.duration } },
    }))
  })
  d.audio.addEventListener('ended', () => {
    useDeckStore.setState((s) => ({
      decks: { ...s.decks, [d.label]: { ...s.decks[d.label], isPlaying: false } },
    }))
  })
})