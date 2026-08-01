import { useState, useEffect } from 'react'
import { searchJamendoTracks } from '../services/jamendo'

export function useJamendoSearch(query) {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    const timeout = setTimeout(async () => {
      try {
        const tracks = await searchJamendoTracks(query)
        setResults(tracks)
      } catch (e) {
        setError(e.message)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [query])

  return { results, isLoading, error }
}