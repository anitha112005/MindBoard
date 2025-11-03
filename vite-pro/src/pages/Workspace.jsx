import { useNavigate } from 'react-router-dom'
import Sidebar from '../shared/Sidebar.jsx'
import { useStore } from '../store/useStore.js'

export default function Workspace() {
  const navigate = useNavigate()
  const addPage = useStore(s => s.addPage)

  return (
    <div className="layout">
      <Sidebar />
      <main style={{padding:'1.2rem'}}>
        <div className="container">
          <h1 style={{marginTop:0}}>Workspace</h1>
          <p className="note">Create pages and databases. Everything saves locally and can sync via the optional realtime server.</p>

          <div className="row" style={{marginTop:'1rem'}}>
            <button onClick={() => navigate('/page/' + addPage())}>New Page</button>
            <button className="ghost" onClick={() => navigate('/page/welcome')}>Open Demo</button>
          </div>

          <section style={{marginTop:'2rem'}} className="grid" >
            <div className="card" style={{padding:'1rem'}}>
              <h3 style={{marginTop:0}}>Quick Start</h3>
              <ol>
                <li>Open a page and type “/” for blocks.</li>
                <li>Use H1/H2/H3, lists, to-dos, quotes, callouts, dividers, code.</li>
                <li>Add a “Database” block for Table or Kanban views.</li>
              </ol>
            </div>
            <div className="card" style={{padding:'1rem'}}>
              <h3 style={{marginTop:0}}>Tips</h3>
              <ul>
                <li>Cmd/Ctrl + B/I/U for bold/italic/underline.</li>
                <li>Offline by default using localStorage.</li>
                <li>Enable realtime: run the server and open the same page in two tabs.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}