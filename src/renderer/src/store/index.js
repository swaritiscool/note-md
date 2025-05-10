import { atom } from 'jotai'

export const notesAtom = atom(window.markdownFiles.listMarkdownFiles())

export const selectedNoteIndex = atom(null)

export const isSaved = atom(true)

export const editorContent = atom('')

export const lastSavedEditorAtom = atom('')

export const fileSelected = atom(false)

export const selectedNoteAtom = atom((get) => {
  const notes = get(notesAtom)
  const index = get(selectedNoteIndex)

  if (index === null || notes.length === 0) return null

  const selectedNote = notes[index]
  return {
    ...selectedNote,
    content: `Hello From Notes ${index}`
  }
})

export const refreshNotesAtom = atom(null, (get, set) => {
  const updatedNotes = window.markdownFiles.listMarkdownFiles()
  set(notesAtom, updatedNotes)
})
