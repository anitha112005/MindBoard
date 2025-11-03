import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false, error:null } }
  static getDerivedStateFromError(error){ return { hasError:true, error } }
  componentDidCatch(error, info){
    // Log only; DO NOT setState here.
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary:', error, info)
  }
  render(){
    if (this.state.hasError){
      const reset = () => { try{ localStorage.removeItem('mindboard_store') }catch{}; location.reload() }
      return (
        <div style={{padding:'1.25rem'}}>
          <h2>Something went wrong.</h2>
          <pre style={{whiteSpace:'pre-wrap',background:'var(--surface)',border:'1px solid var(--border)',padding:'.75rem',borderRadius:8,color:'var(--muted)'}}>
            {String(this.state.error)}
          </pre>
          <div style={{marginTop:'1rem',display:'flex',gap:8}}>
            <button onClick={()=>location.reload()}>Reload</button>
            <button className="ghost" onClick={reset}>Reset local data</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary