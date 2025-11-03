import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const URL = 'http://localhost:4000' // optional server

export function useRealtime(pageId) {
  const socketRef = useRef(null)

  useEffect(() => {
    try {
      const s = io(URL, { transports: ['websocket'], autoConnect: true })
      socketRef.current = s
      s.emit('join', { room: `page:${pageId}` })
      return () => { s.disconnect() }
    } catch {
      // server not running; ignore
    }
  }, [pageId])

  function emitUpdate(blocks) {
    if (socketRef.current) socketRef.current.emit('page:update', { room: `page:${pageId}`, blocks })
  }

  function onRemote(cb) {
    if (!socketRef.current) return () => {}
    const handler = ({ blocks }) => cb(blocks)
    socketRef.current.on('page:update', handler)
    return () => socketRef.current?.off('page:update', handler)
  }

  return { emitUpdate, onRemote }
}