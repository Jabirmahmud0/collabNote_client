import { createContext, useContext, useState, useCallback, useRef } from 'react';
import api from '../utils/api';

const NotesContext = createContext(null);

export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const lastFetchRef = useRef({});

  const fetchNotes = useCallback(async (filters = {}) => {
    const { filter = 'all', tag = null, force = false } = filters;
    // Removed cache blocking to ensure clicking sidebar filters instantly requests the actual data.

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filter) params.append('filter', filter);
      if (tag) params.append('tag', tag);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await api.get(`/api/notes?${params}`);
      setNotes(response.data.data.notes);
      setTags(response.data.data.tags || []);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNote = useCallback(async (noteId) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/notes/${noteId}`);
      return response.data.data.note;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (noteData = {}) => {
    try {
      const response = await api.post('/api/notes', noteData);
      const newNote = response.data.data.note;
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (noteId, updates) => {
    try {
      const response = await api.patch(`/api/notes/${noteId}`, updates);
      const updatedNote = response.data.data.note;
      setNotes((prev) =>
        prev.map((note) => (note._id === noteId ? updatedNote : note))
      );
      return updatedNote;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (noteId) => {
    try {
      await api.delete(`/api/notes/${noteId}`);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (err) {
      throw err;
    }
  }, []);

  const restoreNote = useCallback(async (noteId) => {
    try {
      await api.post(`/api/notes/${noteId}/restore`);
      setNotes((prev) =>
        prev.map((note) =>
          note._id === noteId ? { ...note, isDeleted: false, deletedAt: null } : note
        )
      );
    } catch (err) {
      throw err;
    }
  }, []);

  const permanentDelete = useCallback(async (noteId) => {
    try {
      await api.delete(`/api/notes/${noteId}/permanent`);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (err) {
      throw err;
    }
  }, []);

  const shareNote = useCallback(async (noteId, email, permission = 'view') => {
    try {
      const response = await api.post(`/api/notes/${noteId}/share`, {
        email,
        permission,
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const value = {
    notes,
    tags,
    loading,
    error,
    fetchNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    restoreNote,
    permanentDelete,
    shareNote,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
