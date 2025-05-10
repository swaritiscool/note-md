import { RootLayout, Sidebar, Editor } from '@/components'
import { NoteCard } from '@/components'
import '@mdxeditor/editor/style.css'
import { MarkDownEditor, TitleComponent } from './components'
import { useAtom } from 'jotai'
import { isSaved, notesAtom, refreshNotesAtom } from './store'
import { useEffect, useState } from 'react'
import { useNotesList } from './hooks/useNotesList'

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  const [Notes, setNotes] = useAtom(notesAtom)

  const { notesIndex, handleNoteSelect } = useNotesList({})

  const [saved, setSaved] = useAtom(isSaved)

  const [response, setResponse] = useState(null)

  useEffect(() => {
    handleClick(null)
    setSaved(false)
    window.electron.on('file-changed', () => {
      console.log('File system changed — refreshing notes...')
      setNotes(window.markdownFiles.listMarkdownFiles())
    })
    window.electron.on('Result_Unsaved_Dialog', (result) => {
      console.log('Result: ', result)
      setResponse(result)
    })
  }, [])

  const handleClick = (index) => {
    if (!saved) {
      window.electron.send('confirm-notSaved')
      return
    }
    console.log(`Index passed : ${index}`)
    console.log(index)
    handleNoteSelect(index)
  }

  return (
    <RootLayout>
      <Sidebar>
        {Notes.length > 0 ? (
          Notes.map((item, index) => {
            if (index === notesIndex) {
              return (
                <NoteCard
                  key={index}
                  title={item.title}
                  sub={item.sub}
                  onClick={(e) => {
                    e.preventDefault()
                    handleClick(index)
                  }}
                  id="#on"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.24)' }}
                />
              )
            } else {
              return (
                <NoteCard
                  key={index}
                  title={item.title}
                  sub={item.sub}
                  onClick={(e) => {
                    e.preventDefault()
                    handleClick(index)
                  }}
                />
              )
            }
          })
        ) : (
          <p style={{ alignSelf: 'center', fontSize: 15 }}>No Notes Yet</p>
        )}
      </Sidebar>
      <Editor>
        <TitleComponent>New File</TitleComponent>
        <MarkDownEditor />
      </Editor>
    </RootLayout>
  )
}

export default App
