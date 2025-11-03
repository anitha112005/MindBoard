import Sidebar from '../shared/Sidebar.jsx'
export default function Inbox(){
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content placeholder">
        <h1>Inbox</h1>
        <p>Your mentions and notifications will appear here.</p>
      </main>
    </div>
  )
}