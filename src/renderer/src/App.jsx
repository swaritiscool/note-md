import { RootLayout, Sidebar, Editor } from '@/components'
import { NoteCard } from '@/components'
import '@mdxeditor/editor/style.css'
import { MarkDownEditor, TitleComponent } from './components'
import { useAtom } from 'jotai'
import { notesAtom, refreshNotesAtom } from './store'
import { useEffect } from 'react'

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  const [Notes, setNotes] = useAtom(notesAtom)

  useEffect(() => {
    window.electron.on('file-changed', () => {
      console.log('File system changed — refreshing notes...')
      setNotes(window.markdownFiles.listMarkdownFiles())
    })
  }, [])

  return (
    <RootLayout>
      <Sidebar>
        {Notes.length > 0 ? (
          Notes.map((item, index) => <NoteCard key={index} title={item.title} sub={item.sub} />)
        ) : (
          <p style={{ alignSelf: 'center', fontSize: 15 }}>No Notes Yet</p>
        )}
      </Sidebar>
      <Editor>
        <TitleComponent>Title</TitleComponent>
        <MarkDownEditor />
      </Editor>
    </RootLayout>
  )
}

export default App
