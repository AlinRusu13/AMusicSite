import { useState, useRef, useEffect, useCallback } from 'react'

export function usePlayer(tracks) {
  const audioRef = useRef(new Audio())
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)

  // Wire up audio element event listeners once
  useEffect(() => {
    const audio = audioRef.current
    audio.volume = volume

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => next()

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack])

  const playTrack = useCallback((track) => {
    const audio = audioRef.current
    if (currentTrack?.id === track.id) {
      // same track clicked again -> just toggle
      togglePlay()
      return
    }
    audio.src = track.src
    audio.play()
    setCurrentTrack(track)
    setIsPlaying(true)
  }, [currentTrack])

  function togglePlay() {
    const audio = audioRef.current
    if (!currentTrack) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  function seek(time) {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  function changeVolume(v) {
    audioRef.current.volume = v
    setVolume(v)
  }

  function next() {
    if (!currentTrack) return
    const idx = tracks.findIndex((t) => t.id === currentTrack.id)
    const nextTrack = tracks[(idx + 1) % tracks.length]
    playTrack(nextTrack)
  }

  function prev() {
    if (!currentTrack) return
    const idx = tracks.findIndex((t) => t.id === currentTrack.id)
    const prevTrack = tracks[(idx - 1 + tracks.length) % tracks.length]
    playTrack(prevTrack)
  }

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    playTrack,
    togglePlay,
    seek,
    changeVolume,
    next,
    prev,
  }
}