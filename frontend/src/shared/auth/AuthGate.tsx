import { useState, type FormEvent, type ReactNode } from 'react'
import { ThemeToggle } from '../components/ThemeToggle'
import { readStored, writeStored } from '../storage'
import { SESSION_KEY, credentialsMatch } from './credentials'

// Wraps the whole app: nothing renders until the fixed username and password are entered.
// "Signed in" is remembered in localStorage, so a reload keeps you in.
export function AuthGate({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(() => readStored(SESSION_KEY, false, (v): v is boolean => typeof v === 'boolean'))
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (credentialsMatch(username, password)) {
      writeStored(SESSION_KEY, true)
      setSignedIn(true)
    } else {
      setError('Wrong username or password.')
    }
  }

  if (signedIn) return children

  return (
    <div className="login-page">
      <div className="login-theme"><ThemeToggle /></div>

      <section className="login-hero" aria-hidden="true">
        <span className="login-logo">◆</span>
        <h1>Data Detective</h1>
        <p className="login-tagline">Learn. Practice. Build.</p>
        <pre className="login-snippet">{`SELECT order_id, COUNT(*) AS copies
FROM orders
GROUP BY order_id
HAVING COUNT(*) > 1;   -- found you.`}</pre>
        <ul className="login-points">
          <li>🛠️ Solve real data-quality puzzles with SQL in your browser</li>
          <li>🤖 Prepare for the Claude Certified Developer exam</li>
        </ul>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="muted">Sign in to start investigating.</p>
          <div className="field">
            <label htmlFor="login-username">Username</label>
            <input id="login-username" autoComplete="username" autoFocus required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <div className="password-row">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="link-button" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="button login-submit" type="submit">Sign in →</button>
        </form>
      </section>
    </div>
  )
}
