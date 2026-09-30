import { Link } from 'react-router-dom'
import { ThemeToggle } from '../shared/components/ThemeToggle'

interface TrackChoice {
  id: string
  icon: string
  title: string
  description: string
  bullets: string[]
  to: string
  className: string
}

const tracks: TrackChoice[] = [
  {
    id: 'data-engineering',
    icon: '🛠️',
    title: 'Data Engineering',
    description: 'Learn data engineering by solving real problems.',
    bullets: ['Investigate broken datasets', 'Write SQL in your browser', 'Debug pipeline failures'],
    to: '/data-engineering',
    className: 'track-card-de',
  },
  {
    id: 'claude',
    icon: '🤖',
    title: 'Claude Developer',
    description: 'Prepare for the Claude Certified Developer exam.',
    bullets: ['Curated free resources', 'Practice questions', 'Mock exam and study notes'],
    to: '/claude',
    className: 'track-card-claude',
  },
]

export function HomePage() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <span className="brand">
            <span className="brand-mark" aria-hidden="true">◆</span>
            Data Detective
          </span>
          <span className="nav" />
          <ThemeToggle />
        </div>
      </header>

      <main className="container home">
        <section className="home-hero">
          <h1>Data Detective</h1>
          <p className="home-tagline">Learn. Practice. Build.</p>
          <p className="muted">Choose your learning path</p>
        </section>

        <section className="grid grid-2">
          {tracks.map((track) => (
            <article key={track.id} className={`card track-card ${track.className}`}>
              <span className="track-icon" aria-hidden="true">{track.icon}</span>
              <h2>{track.title}</h2>
              <p>{track.description}</p>
              <ul className="track-bullets muted">
                {track.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <Link className="button" to={track.to}>Start Learning</Link>
            </article>
          ))}
        </section>

        <p className="muted small home-disclaimer">
          Data Detective is an independent learning project. It is not affiliated with or endorsed by
          Anthropic. Progress is stored in your browser only.
        </p>
      </main>
    </div>
  )
}
