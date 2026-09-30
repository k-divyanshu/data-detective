import { Navigate, Route, Routes } from 'react-router-dom'
import { TrackLayout, type NavItem } from '../../shared/components/TrackLayout'
import { DashboardPage } from './pages/DashboardPage'
import { MockExamPage } from './pages/MockExamPage'
import { NotesPage } from './pages/NotesPage'
import { PracticePage } from './pages/PracticePage'
import { ProgressPage } from './pages/ProgressPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { TipsPage } from './pages/TipsPage'
import { ClaudeProgressProvider } from './state/ClaudeProgressProvider'

const nav: NavItem[] = [
  { to: '/claude', label: 'Dashboard', end: true },
  { to: '/claude/resources', label: 'Resources' },
  { to: '/claude/practice', label: 'Practice' },
  { to: '/claude/mock-exam', label: 'Mock Exam' },
  { to: '/claude/tips', label: 'Tips' },
  { to: '/claude/notes', label: 'Notes' },
  { to: '/claude/progress', label: 'Progress' },
]

// Mounted at /claude/*. Everything here is separate from the Data Engineering track.
export function ClaudeRoutes() {
  return (
    <ClaudeProgressProvider>
      <Routes>
        <Route element={<TrackLayout trackId="claude" trackLabel="Claude Developer" nav={nav} />}>
          <Route index element={<DashboardPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="mock-exam" element={<MockExamPage />} />
          <Route path="tips" element={<TipsPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="*" element={<Navigate to="/claude" replace />} />
        </Route>
      </Routes>
    </ClaudeProgressProvider>
  )
}
