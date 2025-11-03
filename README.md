# MindBoard

MindBoard is a React (Vite) frontend with a Node/Express backend. It provides a clean, keyboard-friendly workspace UI with optional realtime via Socket.IO.

## Tech stack
- Frontend: Vite + React (vite-pro)
- Backend: Node.js + Express + Socket.IO (server)
- Dev tooling: npm workspaces

## Repository structure
```
.
├─ server/         # backend API + Socket.IO
├─ vite-pro/       # frontend app (Vite + React)
├─ package.json    # root scripts to run both
└─ .gitignore
```

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+

## Getting started (Windows / PowerShell)
1) Install dependencies
```
cd d:\MINDBOARD
npm i
```

2) Run frontend and backend together
```
npm run dev
```
- Frontend: http://localhost:5173
- Backend:  http://localhost:4000 (health: /api/health)

If you prefer separate terminals:
```
npm --workspace server run dev
npm --workspace vite-pro run dev
```

## Environment variables
Create server/.env:
```
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

Optional frontend env (vite-pro/.env):
```
# 1 to enable sockets, 0 to disable
VITE_ENABLE_SOCKET=1
# leave unset to use same-origin; or point to backend
# VITE_SOCKET_URL=http://localhost:4000
```

## Vite proxy (dev)
vite-pro/vite.config.js proxies API and WebSocket to the backend:
- /api → http://localhost:4000
- /socket.io → ws://localhost:4000

## Available scripts
At repo root:
- npm run dev       → run server and frontend in parallel
- npm run build     → build frontend (vite-pro/dist)
- npm run serve     → start server only

Backend (server):
- npm run dev       → nodemon index.js
- npm start         → node index.js

Frontend (vite-pro):
- npm run dev       → Vite dev server
- npm run build     → production build to vite-pro/dist
- npm run preview   → preview built site

## API quick test
- GET http://localhost:4000/api/health → { ok: true, service: "mindboard-api", time: "..." }
- GET http://localhost:4000/api/hello  → { message: "Hello from API" }

## Build and deploy
- Build frontend:
```
npm --workspace vite-pro run build
```
- Option A (separate hosting): deploy vite-pro/dist to static hosting, deploy server separately.
- Option B (single process): copy dist into server/public and add static serve in server/index.js:
```js
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, 'public')))
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))
```

## Troubleshooting
- Port in use:
  - netstat -ano | findstr :4000
  - taskkill /PID <pid> /F  (or change PORT in server/.env)
- WebSocket connection refused:
  - Ensure server is running and CORS_ORIGIN includes http://localhost:5173
  - Verify VITE_ENABLE_SOCKET=1 (or set to 0 to disable)
- 404 /.well-known in console:
  - The backend serves a small JSON to silence DevTools probes.
- Images not loading:
  - Put assets in vite-pro/public/images and use paths like /images/xyz.jpg
  - The ImageX component falls back to a built‑in SVG if a file is missing.

## License
MIT