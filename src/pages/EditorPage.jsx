import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '../hooks/useNotes';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Toolbar from '../components/editor/Toolbar';
import PresenceBar from '../components/editor/PresenceBar';
import NoteEditor from '../components/editor/NoteEditor';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { exportToPDF, exportToMarkdown, exportToJSON } from '../utils/exportUtils';

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getNote, updateNote, shareNote } = useNotes();
  const { socket, joinRoom, leaveRoom, users } = useSocket();

  const [note, setNote] = useState(null);
  const [content, setContent] = useState({ ops: [] });
  const [title, setTitle] = useState('Untitled');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [saveTimeout, setSaveTimeout] = useState(null);

  useEffect(() => { loadNote(); }, [id]);

  useEffect(() => {
    if (note && socket) joinRoom(id);
    return () => { if (id) leaveRoom(id); };
  }, [note, socket, id]);

  useEffect(() => {
    if (!socket) return;
    const handleNoteUpdate = ({ delta, userId }) => {
      if (userId !== user?.id) console.log('Remote update from:', userId);
    };
    socket.on('note-update', handleNoteUpdate);
    return () => { socket.off('note-update', handleNoteUpdate); };
  }, [socket, user]);

  const loadNote = async () => {
    try {
      const noteData = await getNote(id);
      setNote(noteData);
      setTitle(noteData.title || 'Untitled');
      setContent(noteData.content || { ops: [] });
    } catch { toast.error('Failed to load note'); navigate('/dashboard'); }
  };

  const handleContentChange = useCallback((delta) => {
    setContent(delta);
    if (saveTimeout) clearTimeout(saveTimeout);
    setIsSaving(true);
    setIsSaved(false);
    const timeout = setTimeout(async () => {
      try {
        await updateNote(id, { content: delta, saveVersion: false });
        setIsSaving(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch { setIsSaving(false); toast.error('Failed to save'); }
    }, 2000);
    setSaveTimeout(timeout);
  }, [id, updateNote, saveTimeout]);

  const handleTitleChange = useCallback((t) => setTitle(t), []);

  const handleTitleBlur = async () => {
    if (title !== note?.title) {
      try { await updateNote(id, { title }); toast.success('Title updated'); }
      catch { toast.error('Failed to update title'); }
    }
  };

  const handleShare = () => setShowShareModal(true);

  const handleShareSubmit = async () => {
    if (!shareEmail) { toast.error('Enter an email'); return; }
    try { await shareNote(id, shareEmail, 'view'); toast.success(`Shared with ${shareEmail}`); setShowShareModal(false); setShareEmail(''); loadNote(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to share'); }
  };

  const handleExport = async (format) => {
    try {
      const exportFn = { pdf: exportToPDF, markdown: exportToMarkdown, json: exportToJSON }[format];
      if (exportFn) { await exportFn(note, title); toast.success(`${format.toUpperCase()} exported`); }
    } catch { toast.error('Export failed'); }
  };

  if (!note) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-primary">
        <motion.div className="w-8 h-8 rounded-full border-2 border-border border-t-accent" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      <div className="mesh-bg opacity-10 pointer-events-none" />

      {/* Toolbar */}
      <Toolbar
        title={title}
        onTitleChange={handleTitleChange}
        isSaving={isSaving}
        isSaved={isSaved}
        onShare={handleShare}
        onExport={handleExport}
      />

      {/* Presence */}
      {users.length > 0 && (
        <div className="border-b border-border bg-bg-primary/60 backdrop-blur-sm">
          <PresenceBar users={users} />
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <NoteEditor content={content} onChange={handleContentChange} />
      </div>

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share Note">
        <div className="space-y-5">
          <p className="text-sm text-text-secondary">Invite someone to collaborate on this note.</p>
          <Input label="Email" type="email" placeholder="collaborator@example.com" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowShareModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleShareSubmit}>Share</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditorPage;
