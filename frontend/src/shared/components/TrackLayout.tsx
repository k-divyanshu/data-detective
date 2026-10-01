import { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

export interface NavItem {
  to: string
  label: string
  end?: boolean
}

interface TrackLayoutProps {
  trackId: 'data-engineering' | 'claude'
  trackLabel: string // always visible, so the user knows which track they are in
  nav: NavItem[]
}

// The frame around every page of a track: header, track badge, navigation and Switch Track.
export function TrackLayout({ trackId, trackLabel, nav }: TrackLayoutProps) {
  // The attribute switches the accent colours (see index.css).
  useEffect(() => {
    document.documentElement.dataset.track = trackId
    return () => {
      delete document.documentElement.dataset.track
    }
  }, [trackId])

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">◆</span>
            Data Detective
          </Link>
          <span className="track-pill" aria-label={`Current track: ${trackLabel}`}>
            {trackLabel}
          </span>
          <nav className="nav" aria-label="Main">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/" className="button button-ghost">Switch Track</Link>
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
