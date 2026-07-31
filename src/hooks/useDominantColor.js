import { useEffect, useState } from 'react'

export function useDominantColor(imageUrl) {
  const [color, setColor] = useState('124,20,20')

  useEffect(() => {
    if (!imageUrl) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, 32, 32)
        const { data } = ctx.getImageData(0, 0, 32, 32)

        let r = 0, g = 0, b = 0, count = 0
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          count++
        }
        r = Math.floor(r / count)
        g = Math.floor(g / count)
        b = Math.floor(b / count)
        setColor(`${r},${g},${b}`)
} catch (e) {
        console.warn('Canvas read blocked (CORS):', e)
      }
    }
  }, [imageUrl])

  return color
}