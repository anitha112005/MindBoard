import { useEffect, useRef, useState } from 'react'

export default function useTypewriter(phrases = [], opts = {}) {
  const typeSpeed = opts.typeSpeed ?? 40
  const eraseSpeed = opts.eraseSpeed ?? 28
  const hold = opts.hold ?? 1500
  const pause = opts.pause ?? 300
  const loop = opts.loop ?? true

  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const del = useRef(false)

  useEffect(() => {
    if (!phrases.length) return
    const full = phrases[i % phrases.length]

    const tick = () => {
      if (!del.current) {
        const next = full.slice(0, text.length + 1)
        setText(next)
        if (next === full) {
          del.current = true
          return setTimeout(tick, hold)
        }
        return setTimeout(tick, typeSpeed)
      } else {
        const next = full.slice(0, Math.max(0, text.length - 1))
        setText(next)
        if (next.length === 0) {
          del.current = false
          setI(prev => (loop ? (prev + 1) % phrases.length : Math.min(prev + 1, phrases.length - 1)))
          return setTimeout(tick, pause)
        }
        return setTimeout(tick, eraseSpeed)
      }
    }

    const id = setTimeout(tick, typeSpeed)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, phrases.join('|')])

  return text
}