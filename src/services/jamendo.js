const CLIENT_ID = 'YOUR_CLIENT_ID_HERE' // <- paste your Jamendo client_id here
const BASE_URL = 'https://api.jamendo.com/v3.0'

function mapJamendoTrack(t) {
  return {
    id: `jamendo-${t.id}`,
    title: t.name,
    artist: t.artist_name,
    album: t.album_name || 'Single',
    duration: t.duration,
    cover: t.album_image || t.image || 'https://picsum.photos/seed/jamendo/300/300',
    src: t.audio,
    isJamendo: true,
  }
}

export async function searchJamendoTracks(query, limit = 20) {
  if (!query.trim()) return []
  const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(
    query
  )}&include=musicinfo&audioformat=mp32`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Jamendo search failed: ${res.status}`)
  const data = await res.json()
  return (data.results || []).map(mapJamendoTrack)
}

export async function getPopularJamendoTracks(limit = 20) {
  const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&order=popularity_total&include=musicinfo&audioformat=mp32`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Jamendo popular fetch failed: ${res.status}`)
  const data = await res.json()
  return (data.results || []).map(mapJamendoTrack)
}

export async function getJamendoTracksByTag(tag, limit = 20) {
  const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&tags=${encodeURIComponent(
    tag
  )}&order=popularity_total&include=musicinfo&audioformat=mp32`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Jamendo tag fetch failed: ${res.status}`)
  const data = await res.json()
  return (data.results || []).map(mapJamendoTrack)
}