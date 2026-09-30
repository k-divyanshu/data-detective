import { Navigate, Route, Routes } from 'react-router-dom'
import { TrackLayout, type NavItem } from '../../shared/components/TrackLayout'
import { ProgressProvider } from './progress/ProgressProvider'
import { ChallengeDetailPage } from './pages/ChallengeDetailPage'
import { ChallengesPage } from './pages/ChallengesPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProgressPage } from './pages/ProgressPage'

const nav: NavItem[] = [
  { to: '/data-engineering', label: 'Dashboard', end: true },
  { to: '/data-engineering/challenges', label: 'Challenges' },
  { to: '/data-engineering/progress', label: 'Progress' },
]

// Mounted at /data-engineering/*. Progress state only exists inside this track.
export function DataEngineeringRoutes() {
  return (
    <ProgressProvider>
      <Routes>
        <Route element={<TrackLayout trackId="data-engineering" trackLabel="Data Engineering" nav={nav} />}>
          <Route index element={<DashboardPage />} />
          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="challenges/:challengeId" element={<ChallengeDetailPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="*" element={<Navigate to="/data-engineering" replace />} />
        </Route>
      </Routes>
    </ProgressProvider>
  )
}
