import Sidebar from '../shared/Sidebar.jsx'
export default function Settings(){
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content placeholder">
        <h1>Settings</h1>
        <p>Theme, account, and workspace preferences.</p>
      </main>
    </div>
  )
}