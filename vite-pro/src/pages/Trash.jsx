import Sidebar from '../shared/Sidebar.jsx'
export default function Trash(){
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content placeholder">
        <h1>Trash</h1>
        <p>Recently deleted items will show up here.</p>
      </main>
    </div>
  )
}