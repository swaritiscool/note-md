import { RootLayout, Sidebar, Editor } from '@/components'
import { NoteCard } from '@/components'
import { Notes } from './utils'
import '@mdxeditor/editor/style.css'
import { MarkDownEditor, TitleComponent } from './components'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <RootLayout>
      <Sidebar>
        {Notes.length > 0 ? (
          Notes.map(({ title, sub }) => <NoteCard title={title} sub={sub} />)
        ) : (
          <p style={{ alignSelf: 'center', fontSize: 15 }}>No Notes Yet...</p>
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
