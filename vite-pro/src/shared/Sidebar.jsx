import { useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore.js'

function Icon({ children }) { return <span style={{marginRight:8}} aria-hidden>{children}</span> }

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // selectors (stable)
  const pages = useStore(s => s.pages)
  const addPage = useStore(s => s.addPage)
  const renamePage = useStore(s => s.renamePage)
  const user = useStore(s => s.user)
  const logout = useStore(s => s.logout)

  const [editingId, setEditingId] = useState(null)
  const sorted = useMemo(() => pages.slice().reverse(), [pages])

  const searchRef = useRef(null)
  const onAdd = () => {
    const id = addPage('')
    navigate('/page/' + id)
    setEditingId(id)
  }

  return (
    <aside className="sidebar">
      {/* Workspace head */}
      <div className="sb-head">
        <button className="brand" onClick={() => navigate('/home')} title="Home">
          <div className="avatar">{user?.email?.[0]?.toUpperCase() || 'M'}</div>
          <strong>Mindboard</strong>
        </button>
        <button className="ghost small" onClick={logout}>Log out</button>
      </div>

      {/* Search */}
      <div className="sb-group">
        <div className="sb-search">
          <input ref={searchRef} type="search" placeholder="Search" aria-label="Search" />
        </div>
      </div>

      {/* Primary nav */}
      <nav className="sb-group sb-nav">
        <NavLink to="/home" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
          <Icon>🏠</Icon> Home
        </NavLink>
        <NavLink to="/meetings" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
          <Icon>🗓️</Icon> Meetings <span className="badge-new">New</span>
        </NavLink>
        <NavLink to="/ai" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
          <Icon>🤖</Icon> MindBoard AI <span className="badge-new">New</span>
        </NavLink>
        <NavLink to="/inbox" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
          <Icon>📥</Icon> Inbox
        </NavLink>
        <div className="hr" />
      </nav>

      {/* Private pages */}
      <div className="sb-group">
        <div className="sb-section-head">
          <span>Private</span>
          <button className="ghost small" onClick={onAdd}>+ New page</button>
        </div>
        <ul className="page-tree">
          {sorted.map(p => {
            const isActive = pathname.startsWith('/page/' + p.id)
            return (
              <li key={p.id} className={'page-item' + (isActive ? ' active' : '')}>
                {editingId === p.id ? (
                  <input
                    autoFocus
                    className="rename-input"
                    defaultValue={p.title || ''}
                    placeholder="Untitled"
                    onBlur={(e) => { renamePage(p.id, e.target.value.trim()); setEditingId(null) }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur()
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                  />
                ) : (
                  <button className="linklike" onDoubleClick={() => setEditingId(p.id)} onClick={() => navigate('/page/' + p.id)}>
                    <Icon>📄</Icon>{p.title || 'Untitled'}
                  </button>
                )}
              </li>
            )
          })}
          {!sorted.length && <li className="muted">No pages yet</li>}
        </ul>
      </div>

      {/* Shared and Utilities */}
      <div className="sb-group">
        <div className="sb-section-head"><span>Shared</span></div>
        <NavLink to="/share" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
          <Icon>➕</Icon> Start collaborating
        </NavLink>
        <div className="hr" />
        <NavLink to="/settings" className={({isActive}) => 'nav-item smallrow' + (isActive ? ' active' : '')}>
          <Icon>⚙️</Icon> Settings
        </NavLink>
        <NavLink to="/marketplace" className={({isActive}) => 'nav-item smallrow' + (isActive ? ' active' : '')}>
          <Icon>🛍️</Icon> Marketplace
        </NavLink>
        <NavLink to="/trash" className={({isActive}) => 'nav-item smallrow' + (isActive ? ' active' : '')}>
          <Icon>🗑️</Icon> Trash
        </NavLink>
      </div>

      <div className="sb-footer">
        <span className="muted">© {new Date().getFullYear()}</span>
      </div>
    </aside>
  )
}