import { useState } from 'react'
import ThemeToggle from '../../shared/ThemeToggle.jsx'   // direct import (no re-export)

export default function Sidebar() {
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  const handleUserChange = (user) => setUser(user)
  const handleDarkModeChange = (mode) => setDarkMode(mode)

  return (
    <aside className="sidebar">
      <div className="top">
        <div className="ws">
          <div style={{width:22,height:22,borderRadius:6,background:'#eef2ff',display:'grid',placeItems:'center'}}>M</div>
          <span>{user?.name ? `${user.name}'s Workspace` : 'Mindboard'}</span>
        </div>
        <ThemeToggle size={32} />
      </div>
      <div className="content">
        <div className="user-info">
          <div className="user-name">{user?.name}</div>
          <div className="user-email">{user?.email}</div>
        </div>
        <div className="mode-toggle">
          <div className="mode-label">Light Mode</div>
          <div className="switch">
            <div className="thumb"></div>
          </div>
        </div>
      </div>
    </aside>
  )
}