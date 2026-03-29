import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useCollaborators = (noteId) => {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!noteId) return;

    const fetchCollaborators = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/notes/${noteId}`);
        if (res.data?.success) {
          setCollaborators(res.data.data.note.collaborators || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching collaborators');
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborators();
  }, [noteId]);

  const addCollaborator = async (email, permission = 'view') => {
    try {
      const res = await api.post(`/api/notes/${noteId}/share`, { email, permission });
      if (res.data?.success) {
        setCollaborators(res.data.data.note.collaborators || []);
        return { success: true, message: 'Collaborator added' };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error adding collaborator' };
    }
  };

  return { collaborators, loading, error, addCollaborator };
};
