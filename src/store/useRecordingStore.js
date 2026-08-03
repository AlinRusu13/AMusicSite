import { create } from 'zustand'
import { getRecordingStream } from './useDeckStore'
import { useToastStore } from './useToastStore'

let mediaRecorder = null
let chunks = []

export const useRecordingStore = create((set, get) => ({
  isRecording: false,
  recordings: [],
  elapsedSeconds: 0,

  startRecording: () => {
    const stream = getRecordingStream()
    if (!stream) {
      useToastStore.getState().addToast('No audio yet — load a track first')
      return
    }

    chunks = []
    try {
      mediaRecorder = new MediaRecorder(stream)
    } catch (err) {
      console.error('MediaRecorder unsupported or failed to start:', err)
      useToastStore.getState().addToast('Recording not supported in this browser')
      return
    }

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      const timestamp = new Date()
      const recording = {
        id: crypto.randomUUID(),
        name: `Mix — ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        url,
        createdAt: timestamp,
      }
      set((s) => ({ recordings: [recording, ...s.recordings] }))
      useToastStore.getState().addToast('Mix saved — ready to play or download')
    }

    mediaRecorder.start()
    set({ isRecording: true, elapsedSeconds: 0 })
    useToastStore.getState().addToast('Recording started')

    const interval = setInterval(() => {
      if (!get().isRecording) {
        clearInterval(interval)
        return
      }
      set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 }))
    }, 1000)
  },

  stopRecording: () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    set({ isRecording: false })
  },

  deleteRecording: (id) =>
    set((s) => ({ recordings: s.recordings.filter((r) => r.id !== id) })),
}))