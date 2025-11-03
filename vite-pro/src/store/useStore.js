import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const initialPage = () => ({
  id: 'welcome',
  icon: '✨',
  title: 'Welcome to Mindboard',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  blocks: [
    { type: 'h1', children: [{ text: 'Welcome to Mindboard' }] },
    { type: 'paragraph', children: [{ text: 'Create pages and start typing. Autosave is built‑in.' }] },
  ],
})

export const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      // Auth (demo)
      user: null,
      token: null,
      login: (email) => set({ user: { email } }),
      setToken: (t) => set({ token: t }),
      serverLogin: async (email, password) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Login failed')
        set({ user: data.user, token: data.token })
      },
      serverSignup: async (email, password, name) => {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Signup failed')
        set({ user: data.user, token: data.token })
      },
      logout: () => set({ user: null, token: null }),

      // Pages
      pages: [initialPage()],
      getPage: (id) => get().pages.find(p => p.id === id),
      addPage: (title = '') => {
        const id = crypto?.randomUUID?.() || String(Date.now())
        const now = Date.now()
        const page = { id, title, icon: '📄', createdAt: now, updatedAt: now, blocks: [{ type: 'paragraph', children: [{ text: '' }] }] }
        set(s => ({ pages: [page, ...s.pages] }))
        return id
      },
      renamePage: (id, title) => set(s => ({
        pages: s.pages.map(p => p.id === id ? { ...p, title, updatedAt: Date.now() } : p)
      })),
      updateBlocks: (id, blocks) => set(s => ({
        pages: s.pages.map(p => p.id === id ? { ...p, blocks, updatedAt: Date.now() } : p)
      })),
      removePage: (id) => set(s => ({ pages: s.pages.filter(p => p.id !== id) })),
    }),
    {
      name: 'mindboard_store',
      storage: createJSONStorage(() => localStorage),
      partialize: s => ({ theme: s.theme, user: s.user, pages: s.pages }),
    }
  )
)