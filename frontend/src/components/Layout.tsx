import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

type Theme = 'dark' | 'light'

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // localStorage can be unavailable (private mode); fall back to default.
  }
  return 'dark'
}

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/challenges', label: 'Challenges', end: false },
  { to: '/progress', label: 'Progress', end: false },
]

export function Layout() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // ignore
    }
  }, [theme])

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">◆</span>
            Data Detective
          </NavLink>
          <nav className="nav" aria-label="Main">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
