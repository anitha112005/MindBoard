import { Router } from 'express'
import { initDB, createUser, validateUser, findUserByEmail, sanitize } from '../db/index.js'
import { signToken, requireAuth, attachUser } from '../middleware/auth.js'

await initDB()
const router = Router()

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, name } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
    const user = await createUser({ email: String(email).trim(), password, name })
    const token = signToken(user)
    return res.status(201).json({ user, token })
  } catch (err) { next(err) }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
    const user = await validateUser(String(email).trim(), password)
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const token = signToken(user)
    return res.json({ user, token })
  } catch (err) { next(err) }
})

router.get('/me', requireAuth, attachUser, async (req, res) => {
  return res.json({ user: sanitize(req.currentUser) })
})

export default router