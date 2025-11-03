import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { createEditor, Transforms, Editor, Element as SlateElement } from 'slate'
import { Slate, Editable, withReact, useSlate, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import { useStore } from '../../store/useStore.js'
import { useRealtime } from '../../shared/realtime.js'

const HOTKEYS = { 'mod+b': 'bold', 'mod+i': 'italic', 'mod+u': 'underline' }

export default function BlockEditor({ page }) {
  const editor = useMemo(() => withShortcuts(withHistory(withReact(createEditor()))), [])
  const updateBlocks = useStore(s => s.updateBlocks)
  const renamePage = useStore(s => s.renamePage)
  const [value, setValue] = useState(
    page.blocks?.length ? page.blocks : [{ type: 'h1', children: [{ text: page.title || 'Untitled' }] }]
  )
  const [slashOpen, setSlashOpen] = useState(false)
  const [slashPos, setSlashPos] = useState({ x: 0, y: 0 })
  const slashRef = useRef(null)

  // Optional realtime
  const { emitUpdate, onRemote } = useRealtime(page.id)
  useEffect(() => onRemote(remote => { setValue(remote) }), [onRemote])

  // Keep window title and page.title in sync with first H1/first text
  useEffect(() => {
    const title = getTitleFromBlocks(value)
    document.title = `${title || 'Mindboard'} — Mindboard`
    if ((title || 'Untitled') !== (page.title || 'Untitled')) {
      renamePage(page.id, title)
    }
  }, [value, page.id]) // eslint-disable-line

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  function onChange(next) {
    setValue(next)
    updateBlocks(page.id, next)   // autosave to localStorage
    emitUpdate(next)               // realtime (if server running)
  }

  return (
    <Slate editor={editor} initialValue={value} onChange={onChange} >
      <Toolbar />

      <Editable
        className="card"
        style={{ padding: '1rem 1.2rem' }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Type ‘/’ for commands…"
        spellCheck
        autoFocus
        onKeyDown={e => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, e)) { e.preventDefault(); toggleMark(editor, HOTKEYS[hotkey]) }
          }
          if (e.key === '/' && !e.shiftKey) {
            const domRange = ReactEditor.toDOMRange(editor, editor.selection)
            const rect = domRange.getBoundingClientRect()
            setSlashPos({ x: rect.left, y: rect.bottom + window.scrollY })
            setSlashOpen(true)
          } else if (e.key === 'Escape') {
            setSlashOpen(false)
          }
        }}
        onBlur={() => setSlashOpen(false)}
      />

      {slashOpen && (
        <div className="slashmenu" ref={slashRef} style={{ left: slashPos.x, top: slashPos.y }}>
          <SlashItem label="Heading 1" onClick={() => insertBlock(editor, 'h1')} />
          <SlashItem label="Heading 2" onClick={() => insertBlock(editor, 'h2')} />
          <SlashItem label="Heading 3" onClick={() => insertBlock(editor, 'h3')} />
          <SlashItem label="Paragraph" onClick={() => insertBlock(editor, 'paragraph')} />
          <SlashItem label="Bulleted List" onClick={() => insertList(editor, 'bulleted-list')} />
          <SlashItem label="Numbered List" onClick={() => insertList(editor, 'numbered-list')} />
          <SlashItem label="To‑do" onClick={() => insertBlock(editor, 'todo')} />
          <SlashItem label="Quote" onClick={() => insertBlock(editor, 'quote')} />
          <SlashItem label="Callout" onClick={() => insertBlock(editor, 'callout')} />
          <SlashItem label="Divider" onClick={() => insertBlock(editor, 'divider')} />
          <SlashItem label="Code Block" onClick={() => insertBlock(editor, 'code')} />
          <SlashItem label="Database (Table)" onClick={() => insertBlock(editor, 'db-table')} />
          <SlashItem label="Database (Kanban)" onClick={() => insertBlock(editor, 'db-board')} />
        </div>
      )}
    </Slate>
  )
}

function Toolbar() {
  const editor = useSlate()
  return (
    <div className="toolbar">
      <button className="ghost" onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'h1') }}>H1</button>
      <button className="ghost" onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'h2') }}>H2</button>
      <button className="ghost" onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'todo') }}>Todo</button>
      <button className="ghost" onMouseDown={e => { e.preventDefault(); toggleList(editor, 'bulleted-list') }}>List</button>
      <button className="ghost" onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'quote') }}>Quote</button>
      <button className="ghost" onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'bold') }}>Bold</button>
      <button className="ghost" onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'italic') }}>Italic</button>
      <button className="ghost" onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'underline') }}>U</button>
    </div>
  )
}

function SlashItem({ label, onClick }) {
  return <button onMouseDown={e => { e.preventDefault(); onClick() }}>{label}</button>
}

// Renderers
const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'h1': return <h1 {...attributes}>{children}</h1>
    case 'h2': return <h2 {...attributes}>{children}</h2>
    case 'h3': return <h3 {...attributes}>{children}</h3>
    case 'quote': return <blockquote {...attributes} style={{borderLeft:'3px solid #394', paddingLeft:12, color:'#a0b7ff'}}>{children}</blockquote>
    case 'callout': return <div {...attributes} className="note">{children}</div>
    case 'divider': return <div {...attributes} style={{borderTop:'1px solid #2a3050', margin:'1rem 0'}} />
    case 'code': return <pre {...attributes} className="card" style={{padding:12, overflow:'auto'}}><code>{children}</code></pre>
    case 'todo':
      return (
        <div {...attributes} className="todo">
          <TodoCheckbox element={element} />
          <span contentEditable suppressContentEditableWarning>{children}</span>
        </div>
      )
    case 'bulleted-list': return <ul {...attributes} style={{paddingLeft:24}}><li>{children}</li></ul>
    case 'numbered-list': return <ol {...attributes} style={{paddingLeft:24}}><li>{children}</li></ol>
    case 'db-table': return <DatabaseTable {...{ attributes, children, element }} />
    case 'db-board': return <DatabaseBoard {...{ attributes, children, element }} />
    default: return <p {...attributes}>{children}</p>
  }
}

function TodoCheckbox({ element }) {
  const editor = useSlate()
  return (
    <input
      type="checkbox"
      checked={!!element.checked}
      onChange={e => {
        const path = ReactEditor.findPath(editor, element)
        Transforms.setNodes(editor, { checked: e.target.checked }, { at: path })
      }}
    />
  )
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>
  if (leaf.italic) children = <em>{children}</em>
  if (leaf.underline) children = <u>{children}</u>
  return <span {...attributes}>{children}</span>
}

// Helpers
function isHotkey(hotkey, event) {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  const [mod, k] = hotkey.split('+')
  const modPressed = isMac ? event.metaKey : event.ctrlKey
  return modPressed && event.key.toLowerCase() === k
}
function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format)
  if (isActive) Editor.removeMark(editor, format)
  else Editor.addMark(editor, format, true)
}
function isMarkActive(editor, format) {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}
function toggleBlock(editor, type) {
  const [match] = Editor.nodes(editor, { match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === type })
  Transforms.setNodes(editor, { type: match ? 'paragraph' : type }, { match: n => Editor.isBlock(editor, n) })
}
function toggleList(editor, type) {
  const isActive = isBlockActive(editor, type)
  Transforms.setNodes(editor, { type: isActive ? 'paragraph' : type })
}
function insertList(editor, type) { Transforms.insertNodes(editor, { type, children: [{ text: '' }] }) }
function insertBlock(editor, type) { Transforms.insertNodes(editor, { type, children: [{ text: '' }] }) }
function isBlockActive(editor, type) {
  const [match] = Editor.nodes(editor, { match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === type })
  return !!match
}
function withShortcuts(editor) {
  const { insertText } = editor
  editor.insertText = text => {
    const { selection } = editor
    if (text === ' ' && selection && Editor.string(editor, Editor.before(editor, selection, { unit: 'word' })) === '#') {
      Transforms.select(editor, Editor.before(editor, selection, { unit: 'word' }))
      Transforms.delete(editor)
      Transforms.setNodes(editor, { type: 'h1' }, { match: n => Editor.isBlock(editor, n) })
      return
    }
    insertText(text)
  }
  return editor
}
function getTitleFromBlocks(blocks) {
  const first = blocks.find(b => ['h1','h2','paragraph'].includes(b.type))
  const text = first?.children?.map(c => c.text).join('') ?? ''
  const title = text.trim()
  return title || 'Untitled'
}

// Minimal database blocks (unchanged)
function DatabaseTable({ attributes, children, element }) {
  const data = element.data || {
    name: 'Tasks',
    properties: [
      { key: 'Name', type: 'text' },
      { key: 'Status', type: 'select', options: ['Todo', 'Doing', 'Done'] },
      { key: 'Due', type: 'date' }
    ],
    rows: [
      { Name: 'Write docs', Status: 'Doing', Due: '2025-10-24' },
      { Name: 'Design landing', Status: 'Todo', Due: '2025-10-30' },
    ]
  }
  return (
    <div {...attributes} className="card" style={{padding:'1rem', margin:'1rem 0'}}>
      <div contentEditable={false} className="row" style={{justifyContent:'space-between'}}>
        <strong>Database — {data.name}</strong>
        <button className="ghost" onClick={e=>e.preventDefault()}>+ New</button>
      </div>
      <table className="table">
        <thead><tr>{data.properties.map(p => <th key={p.key}>{p.key}</th>)}</tr></thead>
        <tbody>
          {data.rows.map((r,i) => (
            <tr key={i}>
              {data.properties.map(p => <td key={p.key}>{String(r[p.key] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {children}
    </div>
  )
}
function DatabaseBoard({ attributes, children, element }) {
  const data = element.data || {
    name: 'Projects',
    groupBy: 'Status',
    columns: ['Backlog', 'In Progress', 'Done'],
    cards: [
      { title: 'Editor MVP', Status: 'In Progress' },
      { title: 'Realtime sync', Status: 'Backlog' },
      { title: 'Landing animations', Status: 'Done' },
    ]
  }
  return (
    <div {...attributes} className="kanban" style={{margin:'1rem 0'}}>
      {data.columns.map(col => (
        <div key={col} className="column">
          <div className="row" style={{justifyContent:'space-between'}}>
            <strong>{col}</strong><button className="ghost" contentEditable={false}>+</button>
          </div>
          <div style={{display:'grid', gap:'.5rem', marginTop:'.6rem'}}>
            {data.cards.filter(c => c.Status === col).map((c, i) => (
              <div key={col+i} className="card" style={{padding:'.6rem .7rem'}}>{c.title}</div>
            ))}
          </div>
        </div>
      ))}
      {children}
    </div>
  )
}