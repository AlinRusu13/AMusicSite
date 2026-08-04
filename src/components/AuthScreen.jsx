import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

function AuthScreen() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
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
    <div className="h-screen bg-void text-paper font-body flex items-center justify-center relative">
      <div className="grain-overlay" />
      <div className="scanline-overlay" />

      <div className="relative metal-panel-raised rounded-2xl p-8 w-full max-w-sm border border-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="text-center mb-6">
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
              className="metal-panel rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-phosphor/50"
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
              className="metal-panel rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-phosphor/50"
            />
          </div>

          {authError && <p className="text-red text-xs font-lcd tracking-wide">// {authError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="press-active mt-2 bg-phosphor text-void font-medium py-2 rounded-full hover:scale-[1.02] transition-transform shadow-[0_0_16px_rgba(255,59,59,0.4)] disabled:opacity-50"
          >
            {isSubmitting ? '...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="press-active w-full text-center text-taupe hover:text-paper text-sm mt-4"
        >
          {mode === 'login' ? "New here? Create an account" : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  )
}

export default AuthScreen