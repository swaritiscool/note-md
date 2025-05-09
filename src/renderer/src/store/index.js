import { atom } from 'jotai'
import { Notes } from './Notes'

export const notesAtom = atom(Notes)

export const selectedNoteIndex = atom(null)

export const selectedNoteAtom = atom((get) => {
  const notes = get(notesAtom)
  const notesIndex = get(selectedNoteIndex)

  if (!selectedNoteIndex) return null

  const selectedNote = notes[notesIndex]

  return {
    ...selectedNote,
    content: `Hello From Notes ${selectedNoteIndex}`
  }
})
