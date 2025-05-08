import { RootLayout, Sidebar, Editor } from '@/components'
import { NoteCard } from '@/components'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <RootLayout>
      <Sidebar>
        <NoteCard title={'Hello'} sub={'This is some random text'} />
        <NoteCard title={'Hello'} sub={'This is some random text'} />
        <NoteCard title={'Hello'} sub={'This is some random text'} />
        <NoteCard
          title={'Hello'}
          sub={'This is some random text ndvkn dfkjb kjdfkjb kjndkjg kjhn lbngbkjn'}
        />
        <NoteCard title={'Hello'} sub={'This is some random text'} />
        <NoteCard title={'Hello'} sub={'This is some random text'} />
      </Sidebar>
      <Editor>Editor</Editor>
    </RootLayout>
  )
}

export default App
