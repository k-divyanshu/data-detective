import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './home/HomePage'
import { ClaudeRoutes } from './tracks/claude/ClaudeRoutes'
import { DataEngineeringRoutes } from './tracks/data-engineering/DataEngineeringRoutes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/data-engineering/*" element={<DataEngineeringRoutes />} />
      <Route path="/claude/*" element={<ClaudeRoutes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
