import { useAtom } from 'jotai'
import { selectedNoteIndex } from '../store'

export const useNotesList = ({ onSelect }) => {
  const [notesIndex, setNotesIndex] = useAtom(selectedNoteIndex)

  const handleNoteSelect = (index) => {
    setNotesIndex(index)

    if (onSelect) {
      onSelect()
    }
  }
  return {
    notesIndex,
    handleNoteSelect
  }
}
