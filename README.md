# REELS 🎧

A full-featured music web app built from scratch — part streaming player, part DJ mixing booth, with real user accounts and a Steam-style profile page.

**Live site:** https://a-music-site-jjca.vercel.app/

## What it does

REELS runs in two modes:

- **Listen Mode** — a Spotify-style listening experience with a hi-fi-hardware aesthetic: a spinning turntable, a record crate, playlists ("mixtapes"), liked songs, genre browsing, personalized recommendations, a sleep timer, and search across a real music catalog.
- **Mix Mode** — a two-deck DJ booth with a crossfader, tempo/pitch control, filter sweeps, and live mix recording you can play back or download.

Music comes from three sources:
- Your own uploaded MP3s (played locally, nothing uploaded anywhere)
- [Jamendo](https://www.jamendo.com/)'s free/royalty-free catalog, via their public API
- YouTube videos, via YouTube's official embeddable player

## Features

- 🔐 Real user accounts (Firebase Auth) — your library, likes, and mixtapes are yours and saved to the cloud
- 🎵 Playback engine with real-time audio-reactive EQ visuals (Web Audio API)
- 📼 Mixtape maker — drag tracks onto a virtual cassette to build playlists
- ❤️ Liked songs, recently played, and "Made For You" recommendations based on real listening habits
- 🎚️ DJ mode — dual decks, crossfader, tempo/pitch, filter, and mix recording
- 🔍 Live search across your library + Jamendo's catalog
- 📺 YouTube track support via official embed
- ⏰ Sleep timer
- 👤 Full profile page — custom banner, avatar, bio, and a "Showcase" for featured mixtapes
- 🎨 A distinct visual identity — vintage hi-fi/tape-deck theme, not a generic dashboard

## Tech stack

- **React 19** + **Vite**
- **Tailwind CSS v4**
- **Zustand** for state management
- **Firebase** (Authentication + Firestore) for accounts and data persistence
- **Web Audio API** for real-time audio analysis and DJ mixing
- **Jamendo API** for royalty-free music
- **YouTube IFrame Player API** for embedded video playback

## Running locally

```bash
npm install
npm run dev
```

You'll need your own API keys:
1. A [Jamendo](https://devportal.jamendo.com/) Client ID, pasted into `src/services/jamendo.js`
2. A [Firebase](https://console.firebase.google.com/) project with Authentication (Email/Password) and Firestore enabled, config pasted into `src/services/firebase.js`

## Deployment

Deployed on [Vercel](https://vercel.com), auto-deploying from the `main` branch.

## Known limitations

- Uploaded MP3s are session-only (browser blob URLs) — they don't persist across page refreshes
- Real-time EQ visuals only work for same-origin/CORS-enabled audio sources

---

Built as a first project, learning React, state management, audio APIs, and deployment along the way.
