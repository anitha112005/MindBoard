import { useNavigate, useLocation } from 'react-router-dom'
import ModeSwitch from './ModeSwitch.jsx'

export default function TopRight() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Hide on landing to avoid double header; landing has its own nav + switch
  if (pathname === '/') return null

  return (
    <div className="top-right">
      <button className="brand-dot" title="Go to Landing" onClick={() => navigate('/')}>M</button>
      <ModeSwitch />
      <button className="btn-outline" onClick={() => alert('Upgrade flow coming soon')}>Upgrade To Pro</button>
    </div>
  )
}