import { SESSION_KEY } from '../auth/credentials'
import { writeStored } from '../storage'

export function UserMenu() {
  function signOut() {
    writeStored(SESSION_KEY, false)
    window.location.assign('/')
  }
  return <button type="button" className="button button-ghost" onClick={signOut}>Sign out</button>
}
