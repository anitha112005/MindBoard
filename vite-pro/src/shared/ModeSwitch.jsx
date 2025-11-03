import { useStore } from '../store/useStore.js'

export default function ModeSwitch({ label = 'Light Mode' }) {
  const theme = useStore(s => s.theme)
  const toggle = useStore(s => s.toggleTheme)
  const isLight = theme === 'light'
  return (
    <div className="mode-toggle" role="group" aria-label="Theme">
      {label && <span className="mode-label">{label}</span>}
      <button
        role="switch"
        aria-checked={isLight}
        className="switch"
        data-checked={isLight ? 'true' : 'false'}
        onClick={toggle}
        title={isLight ? 'Switch to dark' : 'Switch to light'}
      >
        <span className="thumb">{isLight ? '🌙' : '☀️'}</span>
      </button>
    </div>
  )
}