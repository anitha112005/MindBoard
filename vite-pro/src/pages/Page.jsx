import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../shared/Sidebar.jsx'
import { useStore } from '../store/useStore.js'
import BlockEditor from '../shared/editor/BlockEditor.jsx'

export default function Page() {
  const { pageId } = useParams()
  const navigate = useNavigate()

  const pages = useStore(s => s.pages)
  const addPage = useStore(s => s.addPage)
  const getPage = useStore(s => s.getPage)

  useEffect(() => {
    if (!getPage(pageId)) {
      const id = addPage('')
      navigate('/page/' + id, { replace: true })
    }
  }, [pageId])

  const page = useMemo(() => pages.find(p => p.id === pageId), [pages, pageId])
  if (!page) return null

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        <div className="editor">
          <BlockEditor page={page} />
        </div>
      </main>
    </div>
  )
}