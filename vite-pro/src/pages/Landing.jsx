import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ThemeToggle from '../shared/ThemeToggle.jsx'
import useTypewriter from '../shared/useTypewriter.js'
import ImageX from '../shared/ImageX.jsx'
import AnimatedImage from '../shared/AnimatedImage.jsx' // if used

export default function Landing() {
  const navigate = useNavigate()
  const typed = useTypewriter([
    'Create a bug tracker with the latest customer feedback',
    'Draft meeting notes and action items for the AI sync',
    'Summarize this page and extract todos',
  ], { typeSpeed: 32, eraseSpeed: 22, hold: 1600 })

  // Simple scroll‑reveal: adds .is-visible when cards enter viewport
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible'))
      },
      { threshold: 0.18 }
    )
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="container" style={{ padding: '1.25rem' }}>
      {/* Top navigation */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Mindboard</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="ghost" onClick={() => navigate('/login?switch=1')}>Log in</button>
          <button onClick={() => navigate('/signup')}>Get started</button>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <section className="hero container">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="hero-grid">
          <div className="hero-copy" data-reveal>
            <h1>Work faster with your AI team.</h1>
            <p>
              A Notion‑style editor for documents, tasks, and knowledge. Type “/” to
              add blocks, drag to reorder, and collaborate in real‑time. Everything
              autosaves locally.
            </p>
            <div className="row">
              <button onClick={() => navigate('/signup')}>Create your workspace</button>
              <button className="btn-outline" onClick={() => navigate('/login')}>Try the editor</button>
            </div>
            <div className="hero-badges">
              <span>⚡ Autosave</span>
              <span>🌗 Dark mode</span>
              <span>🧩 Databases</span>
              <span>⌨️ Shortcuts</span>
            </div>
          </div>

          {/* Faux UI preview */}
          <div className="hero-mock" data-reveal>
            <div className="mock-sidebar">
              <div className="mock-item active">✨ Welcome</div>
              <div className="mock-item">📄 Notes</div>
              <div className="mock-item">✅ Tasks</div>
              <div className="mock-item">📆 Calendar</div>
              <div className="mock-item">📎 Files</div>
            </div>
            <div className="mock-body">
              <div className="mock-toolbar">
                <span className="pill">H1</span>
                <span className="pill">Bold</span>
                <span className="pill">List</span>
                <span className="pill">Todo</span>
                <span className="shine" />
              </div>
              <h2 className="mock-title">Think in pages. Build with blocks.</h2>
              <p className="mock-sub">Type “/” to insert anything — headings, todos, tables, or boards.</p>
              <div className="mock-cards">
                <div className="mock-card float1">🧩 Kanban</div>
                <div className="mock-card float2">📊 Table</div>
                <div className="mock-card float3">✅ Todos</div>
                <div className="mock-card float4">💬 Callout</div>
              </div>
              <div className="mock-gallery">
                <ImageX
                  src="https://images.unsplash.com/photo-1529336953121-a9bf1a881b1f?w=900&q=80&auto=format&fit=crop"
                  alt="gallery 1"
                  width={900}
                  height={600}
                />
                <ImageX
                  src="https://images.unsplash.com/photo-1529676468690-d2dca173f9a1?w=900&q=80&auto=format&fit=crop"
                  alt="gallery 2"
                  width={900}
                  height={600}
                />
                <ImageX
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80&auto=format&fit=crop"
                  alt="gallery 3"
                  width={900}
                  height={600}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="features container">
        {[
          ['Slash commands', 'Type “/” to insert any block — headings, todos, callouts, code, and more.', '🧭'],
          ['Databases', 'Tables, boards, calendars, timelines — all views share the same data.', '📚'],
          ['Relations & rollups', 'Link databases together and summarize related info.', '🔗'],
          ['Offline‑friendly', 'Keep working without internet; sync when you’re back.', '📶'],
          ['Collaboration', 'Comment, mention teammates, and edit in real‑time.', '💬'],
          ['Dark mode', 'Beautiful on both light and dark themes.', '🌗'],
        ].map(([title, desc, icon], i) => (
          <article key={i} className="feature card soft" data-reveal>
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </section>

      {/* Showcase mosaic */}
      <section id="showcase" className="showcase container">
        <div className="panel a card" data-reveal>
          <h4>Company HQ</h4>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop" alt="workspace" />
        </div>
        <div className="panel b card" data-reveal>
          <h4>Roadmap (Board)</h4>
          <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80&auto=format&fit=crop" alt="board" />
        </div>
        <div className="panel c card" data-reveal>
          <h4>Calendar</h4>
          <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80&auto=format&fit=crop" alt="calendar" />
        </div>
      </section>

      {/* CTA / Download */}
      <section id="download" className="cta container card soft" data-reveal>
        <div className="cta-copy">
          <h2>Try Mindboard for free.</h2>
          <p>Download the desktop app or continue on the web. Your notes stay with you.</p>
        </div>
        <div className="cta-actions">
          <a className="btn-outline" href="https://aka.ms/store" target="_blank" rel="noreferrer">Microsoft Store</a>
          <button onClick={() => navigate('/signup')}>Create account</button>
        </div>
      </section>

      <footer className="footer container">
        <div>© {new Date().getFullYear()} Mindboard</div>
        <div className="row">
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
          <a href="#features">Features</a>
        </div>
      </footer>
    </div>
  )
}