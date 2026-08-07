import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

function AmbientBackground() {
  const bars = Array.from({ length: 24 })
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Slow rotating glow */}
      <div className="slow-rotate absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px]">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px] opacity-40"
          style={{ background: 'radial-gradient(circle, #FF3B3B, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-[100px] opacity-25"
          style={{ background: 'radial-gradient(circle, #C9542C, transparent 70%)' }}
        />
      </div>

      {/* Floating ambient EQ bars along the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end justify-center gap-2 px-8">
        {bars.map((_, i) => (
          <span
            key={i}
            className="float-bar w-2 rounded-t-sm bg-phosphor"
            style={{
              animationDuration: `${2.5 + (i % 5) * 0.4}s`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function AuthScreen() {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const login = useAuthStore((s) => s.login)
  const signup = useAuthStore((s) => s.signup)
  const authError = useAuthStore((s) => s.authError)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    if (mode === 'login') await login(username, password)
    else await signup(username, password)
    setIsSubmitting(false)
  }

  return (
    <div className="h-screen bg-void text-paper font-body flex items-center justify-center relative overflow-hidden px-4">
      <AmbientBackground />
      <div className="grain-overlay" />
      <div className="scanline-overlay" />

      <div className="card-rise relative metal-panel-raised rounded-2xl p-8 w-full max-w-sm border border-black/40 shadow-[0_24px_70px_rgba(0,0,0,0.7)] z-10">
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-full bg-phosphor/10 border border-phosphor/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(255,59,59,0.25)]">
            <span className="text-2xl">🎧</span>
          </div>
          <h1 className="font-display font-bold text-3xl tracking-tight mb-1">REELS</h1>
          <p className="font-lcd text-phosphor text-sm tracking-widest [text-shadow:0_0_6px_rgba(255,59,59,0.6)]">
            // {mode === 'login' ? 'WELCOME BACK' : 'CREATE YOUR TAPE DECK'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-lcd text-taupe text-xs tracking-widest">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="metal-panel rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-phosphor/50 transition-shadow"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-lcd text-taupe text-xs tracking-widest">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="metal-panel rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-phosphor/50 transition-shadow"
            />
          </div>

          {authError && (
            <p className="text-red text-xs font-lcd tracking-wide bg-red/10 border border-red/30 rounded px-2 py-1.5">
              // {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="press-active mt-2 bg-phosphor text-void font-medium py-2.5 rounded-full hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,59,59,0.45)] disabled:opacity-50"
          >
            {isSubmitting ? '...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="press-active w-full text-center text-taupe hover:text-paper text-sm mt-5"
        >
          {mode === 'login' ? "New here? Create an account" : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  )
}

export default AuthScreen