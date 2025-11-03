import { useEffect } from 'react'
import { useStore } from '../store/useStore.js'

const IconMoon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M21 12.4A8.5 8.5 0 1 1 11.6 3a7.1 7.1 0 0 0 9.4 9.4Z"/>
  </svg>
)
const IconSun = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="4.6" fill="currentColor"/>
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2.5v3.2M12 18.3v3.2M2.5 12h3.2M18.3 12h3.2"/>
      <path d="M5 5l2.2 2.2M16.8 16.8L19 19M5 19l2.2-2.2M16.8 7.2L19 5"/>
    </g>
  </svg>
)

export default function ThemeToggle({ size = 32 }) {
  const theme = useStore(s => s.theme)
  const toggleTheme = useStore(s => s.toggleTheme)

  // Apply the class to <html> whenever theme changes
  useEffect(() => {
    const el = document.documentElement
    el.classList.remove('theme-light', 'theme-dark')
    el.classList.add('theme-' + (theme || 'light'))
    try { localStorage.setItem('mindboard_theme', theme || 'light') } catch {}
  }, [theme])

  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      className="ghost"
      onClick={toggleTheme}
      style={{display:'inline-flex',alignItems:'center',gap:8}}
      title="Toggle theme"
    >
      {isDark ? <IconSun /> : <IconMoon />}
      <span style={{fontSize:12}}>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  )
}