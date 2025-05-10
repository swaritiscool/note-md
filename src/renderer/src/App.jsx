import { RootLayout, Sidebar, Editor } from '@/components'
import { NoteCard } from '@/components'
import '@mdxeditor/editor/style.css'
import { MarkDownEditor, TitleComponent } from './components'
import { useAtom } from 'jotai'
import { editorContent, fileSelected, isSaved, lastSavedEditorAtom, notesAtom } from './store'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNotesList } from './hooks/useNotesList'

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  const [Notes, setNotes] = useAtom(notesAtom)

  const { notesIndex, handleNoteSelect } = useNotesList({})

  const [saved, setSaved] = useAtom(isSaved)

  const [response, setResponse] = useState(null)

  const editor = useRef('')
  const [lastEditor, setLastEditor] = useAtom(lastSavedEditorAtom)
  const [indexTemp, setIndex] = useState(null)

  const [isSelected, setIsSelected] = useAtom(fileSelected)

  const pendingIndexRef = useRef(null)

  const [contentVersion, setContentVersion] = useState(0)

  useEffect(() => {
    if (response === 0 && indexTemp !== null) {
      selectAndRead(indexTemp)
    }
    if (response === 1 && indexTemp !== null) {
      return
    }
  }, [response, indexTemp])

  const handleSave = () => {
    if (!isSelected || !Notes[notesIndex]) {
      console.warn('Cannot save: No note selected or note does not exist')
      return
    }
    if (isSelected) {
      window.electron.send('write-file', Notes[notesIndex].title + '.md', editor.current || '')
      console.log(`Tried saving ${Notes[notesIndex].title + '.md'} with content: ${editor.current}`)
      console.log(editor.current)
      setLastEditor(editor.current)
      setSaved(true)
      console.log('Saved')
    }
    // setLastEditor(editor)
    // setSaved(true)
    // console.log('Saved')
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
    setLastEditor(editor.current)

    window.electron.on('File_Read', (e, data) => {
      editor.current = data
      setLastEditor(data)
      setContentVersion((v) => v + 1) // force re-render
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

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

  useEffect(() => {
    console.log('File Selected: ', isSelected)
  }, [isSelected])

  return (
    <RootLayout>
      <Sidebar>
        {Notes.length > 0 ? (
          Notes.map((item, index) => {
            if (index === notesIndex) {
              setIsSelected(true)
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
        <TitleComponent>
          {isSelected ? Notes[notesIndex].title : 'New File'}
          {saved ? '' : '*'}
        </TitleComponent>
        <MarkDownEditor
          autofocus
          key={contentVersion}
          markdown={editor.current}
          onChange={(md, initial) => {
            editor.current = md
            setSaved(md === lastEditor)
          }}
        />
      </Editor>
    </RootLayout>
  )
}

export default App
