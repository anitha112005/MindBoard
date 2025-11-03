import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import ThemeToggle from '../shared/ThemeToggle.jsx'

export default function Auth({ mode = 'login' }) {
  const navigate = useNavigate()
  const { search, state } = useLocation()

  // Selectors (stable)
  const user = useStore(s => s.user)
  const login = useStore(s => s.login)
  const logout = useStore(s => s.logout)

  // If user clicked “Log in” to switch account, support /login?switch=1
  useEffect(() => {
    const params = new URLSearchParams(search)
    if (params.get('switch') === '1' && user) logout()
  }, [search, user, logout])

  // IMPORTANT: do NOT auto-redirect when user exists.
  // Show the form; redirect happens only after a successful submit.

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    login(email || 'guest@local')
    const next = state?.from?.pathname || '/home'
    navigate(next, { replace: true })
  }

  return (
    <div className="container" style={{ maxWidth: 440, padding: '1.25rem' }}>
      <div className="row" style={{justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
        <strong>Mindboard</strong>
        <ThemeToggle />
      </div>
      <h1 style={{marginBottom: '1rem'}}>{mode === 'signup' ? 'Create account' : 'Log in'}</h1>

      {user && (
        <div className="card soft" style={{ margin: '10px 0', padding: 8 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span>Signed in as <strong>{user.email}</strong></span>
            <div className="row" style={{ gap: 6 }}>
              <button className="btn-outline" onClick={() => navigate('/home')}>Continue</button>
              <button className="ghost" onClick={logout}>Switch account</button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="grid" style={{ gap: 10 }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{mode === 'signup' ? 'Sign up' : 'Log in'}</button>
        {mode === 'signup'
          ? <div>Already have an account? <Link to="/login">Log in</Link></div>
          : <div>New here? <Link to="/signup">Create an account</Link></div>}
      </form>
    </div>
  )
}