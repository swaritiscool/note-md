import { RootLayout, Sidebar, Editor } from '@/components'
import { NoteCard } from '@/components'
import '@mdxeditor/editor/style.css'
import { MarkDownEditor, TitleComponent } from './components'
import { useAtom } from 'jotai'
import { editorContent, isSaved, lastSavedEditorAtom, notesAtom } from './store'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNotesList } from './hooks/useNotesList'

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  const [Notes, setNotes] = useAtom(notesAtom)

  const { notesIndex, handleNoteSelect } = useNotesList({})

  const [saved, setSaved] = useAtom(isSaved)

  const [response, setResponse] = useState(null)

  const [editor, setEditor] = useAtom(editorContent)
  const [lastEditor, setLastEditor] = useAtom(lastSavedEditorAtom)
  const [indexTemp, setIndex] = useState(null)

  const pendingIndexRef = useRef(null)

  useEffect(() => {
    console.log('Editor content: ', editor)

    if (lastEditor != editor) {
      setSaved(false)
      console.log('Unsaved Changes')
    } else {
      setSaved(true)
      console.log('Saved Changes')
    }
  }, [editor])

  useEffect(() => {
    if (response === 0 && indexTemp !== null) {
      selectAndRead(indexTemp)
    }
    if (response === 1 && indexTemp !== null) {
      return
    }
  }, [response, indexTemp])

  const handleSave = () => {
    setLastEditor(editor)
    setSaved(true)
    console.log('Saved')
  }

  useEffect(() => {
    setSaved(true)
    window.electron.on('file-changed', () => {
      console.log('File system changed — refreshing notes...')
      setNotes(window.markdownFiles.listMarkdownFiles())
    })
    window.electron.on('Result_Unsaved_Dialog', (_event, result) => {
      console.log('Result: ', result)
      setResponse(result)

      if (result === 0 && pendingIndexRef.current !== null) {
        selectAndRead(pendingIndexRef.current)
        pendingIndexRef.current = null // reset
      }
    })
    setLastEditor(editor)

    window.electron.on('File_Read', (e, data) => {
      console.log(data)
      setEditor(data)
      setLastEditor(data)
    })
  }, [])

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
      console.log('Ctrl+S inside app')
      handleSave()
    }
  })

  const selectAndRead = (index) => {
    console.log(`Index passed : ${index}`)
    handleNoteSelect(index)

    const read = (file) => {
      if (!file) {
        console.error('Cannot read undefined file')
        return
      }
      window.electron.send('read-file', file)
    }

    if (index !== null && Notes[index]) {
      read(Notes[index].title + '.md')
    } else {
      console.error('Invalid note index or missing Notes array')
    }
  }

  const handleClick = (index) => {
    if (!saved) {
      pendingIndexRef.current = index
      window.electron.send('confirm-notSaved', () => {
        return
      })
      return
    }
    selectAndRead(index)
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
                    setIndex(index)

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
                    setIndex(index)
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
        <TitleComponent>New File{saved ? '' : '*'}</TitleComponent>
        <MarkDownEditor
          autofocus
          key={editor}
          markdown={editor}
          onChange={(md, initial) => {
            setEditor(md)
          }}
        />
      </Editor>
    </RootLayout>
  )
}

export default App
