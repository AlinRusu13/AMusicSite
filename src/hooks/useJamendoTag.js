import { useState, useEffect } from 'react'
import { getJamendoTracksByTag } from '../services/jamendo'

export function useJamendoTag(tag) {
  const [tracks, setTracks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tag) {
      setTracks([])
      return
    }
    setIsLoading(true)
    setError(null)
    getJamendoTracksByTag(tag.toLowerCase(), 20)
      .then(setTracks)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [tag])

  return { tracks, isLoading, error }
}