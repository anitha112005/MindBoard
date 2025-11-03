import { io } from 'socket.io-client'

let socket
export function getSocket() {
  if (import.meta.env.VITE_ENABLE_SOCKET !== '1') return null
  if (socket) return socket
  // Use same-origin by default; override via VITE_SOCKET_URL if needed
  const url = import.meta.env.VITE_SOCKET_URL || undefined
  socket = io(url, {
    path: '/socket.io',
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5
  })
  return socket
}