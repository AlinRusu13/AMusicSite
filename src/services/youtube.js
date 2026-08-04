export function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  // Also accept a bare 11-character video ID typed directly
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim()
  return null
}

export async function fetchYouTubeMeta(videoId) {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  const res = await fetch(oembedUrl)
  if (!res.ok) throw new Error('Video not found or unavailable')
  const data = await res.json()
  return {
    title: data.title,
    author: data.author_name,
    thumbnail: data.thumbnail_url,
  }
}