import Sidebar from '../shared/Sidebar.jsx'
import ThemeToggle from '../shared/ThemeToggle.jsx'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore.js'
import ImageX from '../shared/ImageX.jsx'

function Card({ title, subtitle, onClick, icon }) {
  return (
    <button className="home-card" onClick={onClick}>
      <div className="home-card-icon">{icon}</div>
      <div className="home-card-title">{title}</div>
      <div className="home-card-sub">{subtitle}</div>
    </button>
  )
}

function TemplateCard({ title, subtitle, emoji, img, onCreate }) {
  return (
    <button className="tpl-card" onClick={onCreate} title={`Create ${title}`}>
      <div className="tpl-media ratio-16x9">
        <div className="tpl-emoji">{emoji}</div>
        <ImageX src={img} alt={title} width={960} height={540} />
      </div>
      <div className="tpl-text">
        <div className="tpl-title">{title}</div>
        <div className="tpl-sub">{subtitle}</div>
      </div>
    </button>
  )
}

export default function Home() {
  const navigate = useNavigate()

  // store selectors
  const pages = useStore(s => s.pages)
  const addPage = useStore(s => s.addPage)
  const updateBlocks = useStore(s => s.updateBlocks)
  const user = useStore(s => s.user)
  const renamePage = useStore(s => s.renamePage)

  const [editingId, setEditingId] = useState(null)

  const recent = useMemo(() => {
    const ts = p => p.updatedAt || p.createdAt || 0
    return pages.slice().sort((a, b) => ts(b) - ts(a)).slice(0, 6)
  }, [pages])

  function createBlank() {
    const id = addPage('')
    navigate('/page/' + id)
    setEditingId(id)
  }

  function createNotes() {
    const id = addPage('Notes')
    updateBlocks(id, [
      { type: 'h1', children: [{ text: 'Notes' }] },
      { type: 'paragraph', children: [{ text: 'Type “/” for commands.' }] },
    ])
    navigate('/page/' + id)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content home">
        <div className="home-shell">
          {/* Greeting + actions */}
          <header className="home-top">
            <div>
              <div className="eyebrow">Welcome {user?.email || 'guest@local'}</div>
              <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}</h1>
            </div>
            <div className="row" style={{gap:8}}>
              <button onClick={createBlank}>+ New page</button>
              <ThemeToggle />
            </div>
          </header>

          {/* Quick actions row */}
          <section className="home-quick">
            <Card title="Blank page" subtitle="Start from scratch" onClick={createBlank} icon="📄" />
            <Card title="Notes" subtitle="Headings, bullets, callouts" onClick={createNotes} icon="📝" />
            <Card title="Todo list" subtitle="Simple checklist" onClick={()=>{
              const id = addPage('Tasks')
              updateBlocks(id, [
                { type:'h1', children:[{text:'Tasks'}]},
                { type:'todo', checked:false, children:[{text:'First task'}]},
                { type:'todo', checked:false, children:[{text:'Second task'}]},
              ])
              navigate('/page/'+id)
            }} icon="✅" />
          </section>

          {/* Recent pages grid */}
          <section className="home-recent card">
            <div className="sec-head">
              <h3>Recently visited</h3>
            </div>
            <ul className="recent-grid">
              {recent.map(p => {
                const editing = editingId === p.id
                return (
                  <li key={p.id} className="recent-card">
                    <div className="r-head">
                      <span className="r-icon">{p.icon || '📄'}</span>
                      <span className="r-time">{new Date(p.updatedAt || p.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    {editing ? (
                      <input
                        autoFocus
                        className="rename-input"
                        defaultValue={p.title || ''}
                        placeholder="Untitled"
                        onBlur={(e)=>{ renamePage(p.id, e.target.value.trim()); setEditingId(null) }}
                        onKeyDown={(e)=>{ if(e.key==='Enter') e.currentTarget.blur(); if(e.key==='Escape') setEditingId(null) }}
                      />
                    ) : (
                      <button className="r-title" onClick={()=>navigate('/page/'+p.id)} onDoubleClick={()=>setEditingId(p.id)}>
                        {p.title || 'Untitled'}
                      </button>
                    )}
                    <div className="r-actions">
                      {!editing && <button className="ghost small" onClick={()=>setEditingId(p.id)}>Rename</button>}
                      <button className="btn-outline small" onClick={()=>navigate('/page/'+p.id)}>Open</button>
                    </div>
                  </li>
                )
              })}
              {recent.length === 0 && <li className="empty muted">No pages yet. Create one to get started.</li>}
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}