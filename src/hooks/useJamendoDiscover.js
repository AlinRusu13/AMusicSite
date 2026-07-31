import { useState, useEffect } from 'react'
import { getPopularJamendoTracks } from '../services/jamendo'

export function useJamendoDiscover() {
  const [tracks, setTracks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPopularJamendoTracks(24)
      .then(setTracks)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { tracks, isLoading, error }
}