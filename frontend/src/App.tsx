import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ChallengeDetailPage } from './pages/ChallengeDetailPage'
import { ChallengesPage } from './pages/ChallengesPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProgressPage } from './pages/ProgressPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="challenges/:challengeId" element={<ChallengeDetailPage />} />
        <Route path="progress" element={<ProgressPage />} />
      </Route>
    </Routes>
  )
}

export default App
