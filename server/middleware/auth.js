import jwt from 'jsonwebtoken'
import { sanitize } from '../db/index.js'
import { findUserByEmail } from '../db/index.js'

export function signToken(user) {
  const payload = { sub: user.id, email: user.email }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN || '7d'
  })
}

export function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || ''
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export async function attachUser(req, _res, next) {
  if (!req.user?.email) return next()
  const full = await findUserByEmail(req.user.email)
  req.currentUser = sanitize(full)
  next()
}