import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useStore } from './store/useStore.js'
import ErrorBoundary from './shared/ErrorBoundary.jsx'
import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth.jsx'
import Home from './pages/Home.jsx'
import Page from './pages/Page.jsx'
import Meetings from './pages/Meetings.jsx'
import Inbox from './pages/Inbox.jsx'
import AI from './pages/AI.jsx'
import Settings from './pages/Settings.jsx'
import Marketplace from './pages/Marketplace.jsx'
import Trash from './pages/Trash.jsx'

function RequireAuth({ children }) {
  const user = useStore(s => s.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/page/:pageId" element={<RequireAuth><Page /></RequireAuth>} />
        <Route path="/meetings" element={<RequireAuth><Meetings /></RequireAuth>} />
        <Route path="/ai" element={<RequireAuth><AI /></RequireAuth>} />
        <Route path="/inbox" element={<RequireAuth><Inbox /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        <Route path="/marketplace" element={<RequireAuth><Marketplace /></RequireAuth>} />
        <Route path="/trash" element={<RequireAuth><Trash /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}
