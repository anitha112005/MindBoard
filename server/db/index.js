import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join } from 'node:path'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'

const file = join(process.cwd(), 'server', 'data', 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter, { users: [] })

export async function initDB() {
  await db.read()
  db.data ||= { users: [] }
  await db.write()
  return db
}

export async function findUserByEmail(email) {
  await db.read()
  return db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}

export async function createUser({ email, password, name }) {
  await db.read()
  const exists = db.data.users.some(u => u.email.toLowerCase() === email.toLowerCase())
  if (exists) throw new Error('Email already registered')
  const passwordHash = await bcrypt.hash(password, 12)
  const user = {
    id: nanoid(),
    email,
    name: name || email.split('@')[0],
    passwordHash,
    createdAt: new Date().toISOString()
  }
  db.data.users.push(user)
  await db.write()
  return sanitize(user)
}

export async function validateUser(email, password) {
  const u = await findUserByEmail(email)
  if (!u) return null
  const ok = await bcrypt.compare(password, u.passwordHash)
  if (!ok) return null
  return sanitize(u)
}

export function sanitize(user) {
  if (!user) return null
  const { passwordHash, ...safe } = user
  return safe
}