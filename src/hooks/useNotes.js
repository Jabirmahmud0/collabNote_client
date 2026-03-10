import { useNotesContext } from '../context/NotesContext';

/**
 * useNotes Hook - Wrapper around NotesContext
 */
export const useNotes = () => {
  return useNotesContext();
};
