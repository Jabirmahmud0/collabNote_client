import { useState, useCallback } from 'react';
import api from '../utils/api';

/**
 * useNotes Hook - Manage notes operations
 */
export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);

  /**
   * Fetch all notes
   */
  const fetchNotes = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.filter) params.append('filter', filters.filter);
      if (filters.tag) params.append('tag', filters.tag);
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

  /**
   * Get single note by ID
   */
  const getNote = useCallback(async (noteId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/notes/${noteId}`);
      return response.data.data.note;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new note
   */
  const createNote = useCallback(async (noteData = {}) => {
    setError(null);

    try {
      const response = await api.post('/api/notes', noteData);
      setNotes((prev) => [response.data.data.note, ...prev]);
      return response.data.data.note;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Update note
   */
  const updateNote = useCallback(async (noteId, updates) => {
    setError(null);

    try {
      const response = await api.patch(`/api/notes/${noteId}`, updates);
      setNotes((prev) =>
        prev.map((note) =>
          note._id === noteId ? response.data.data.note : note
        )
      );
      return response.data.data.note;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Delete note (soft delete)
   */
  const deleteNote = useCallback(async (noteId) => {
    setError(null);

    try {
      await api.delete(`/api/notes/${noteId}`);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Restore note from trash
   */
  const restoreNote = useCallback(async (noteId) => {
    setError(null);

    try {
      await api.post(`/api/notes/${noteId}/restore`);
      setNotes((prev) =>
        prev.map((note) =>
          note._id === noteId ? { ...note, isDeleted: false, deletedAt: null } : note
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Permanently delete note
   */
  const permanentDelete = useCallback(async (noteId) => {
    setError(null);

    try {
      await api.delete(`/api/notes/${noteId}/permanent`);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Share note with collaborator
   */
  const shareNote = useCallback(async (noteId, email, permission = 'view') => {
    setError(null);

    try {
      const response = await api.post(`/api/notes/${noteId}/share`, {
        email,
        permission,
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Get version history
   */
  const getVersions = useCallback(async (noteId) => {
    setError(null);

    try {
      const response = await api.get(`/api/notes/${noteId}/versions`);
      return response.data.data.versions;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Restore note to a specific version
   */
  const restoreVersion = useCallback(async (noteId, versionId) => {
    setError(null);

    try {
      const response = await api.post(
        `/api/notes/${noteId}/versions/${versionId}/restore`
      );
      return response.data.data.note;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
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
    getVersions,
    restoreVersion,
  };
};
