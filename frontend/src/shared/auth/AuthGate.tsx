import { useState, type FormEvent, type ReactNode } from 'react'
import { readStored, writeStored } from '../storage'
import { SESSION_KEY, credentialsMatch } from './credentials'

// Wraps the whole app: nothing renders until the fixed username and password are entered.
// "Signed in" is remembered in localStorage, so a reload keeps you in.
export function AuthGate({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(() => readStored(SESSION_KEY, false, (v): v is boolean => typeof v === 'boolean'))
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
    <div className="login-wrap">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h1>Data Detective</h1>
        <p className="muted">Sign in to continue</p>
        <div className="field">
          <label htmlFor="login-username">Username</label>
          <input id="login-username" autoComplete="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="button" type="submit">Sign in</button>
      </form>
    </div>
  )
}
