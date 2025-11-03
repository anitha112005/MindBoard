import 'dotenv/config'
import http from 'node:http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { Server as IOServer } from 'socket.io'

const PORT = Number(process.env.PORT || 4000)
const ORIGIN = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({ origin: ORIGIN, credentials: true }))

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ ok: true, service: 'mindboard-api', time: new Date().toISOString() })
)

// Example API
app.get('/api/hello', (_req, res) => res.json({ message: 'Hello from API' }))

// Root route
app.get('/', (_req, res) => {
  res.type('text/plain').send('MindBoard API • OK')
})

// Edge/Chrome DevTools discovery probe — return something to avoid 404
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.type('application/json').send(JSON.stringify({
    name: 'MindBoard',
    description: 'DevTools discovery probe response',
    version: 1
  }))
})

// Create HTTP + Socket.IO
const server = http.createServer(app)
const io = new IOServer(server, { cors: { origin: ORIGIN } })

io.on('connection', socket => {
  console.log('socket connected:', socket.id)
  socket.on('ping', () => socket.emit('pong'))
  socket.on('disconnect', () => console.log('socket disconnected:', socket.id))
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on http://localhost:${PORT}`)
  console.log(`CORS allowed: ${ORIGIN.join(', ')}`)
})