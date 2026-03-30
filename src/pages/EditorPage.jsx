import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const { socket, users, joinRoom, leaveRoom, sendNoteChange, sendCursorMove, sendTyping, sendStopTyping } = useSocket();

  const [note, setNote] = useState(null);
  const [content, setContent] = useState({ ops: [] });
  const [title, setTitle] = useState('Untitled');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('edit');
  const [saveTimeout, setSaveTimeout] = useState(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => { loadNote(); }, [id]);

  useEffect(() => {
    if (note && socket) joinRoom(id);
    return () => { if (id) leaveRoom(id); };
  }, [note, socket, id]);

  useEffect(() => {
    if (!socket) return;
    
    const handleNoteUpdate = ({ delta, userId }) => {
      // Don't apply your own changes
      const myId = user?.id || user?._id;
      if (userId === myId) return;
      
      // Apply the delta directly to the editor instance for smoothness
      // and to preserve the local cursor position/history
      if (editorRef.current) {
        const editor = editorRef.current.getEditor();
        if (editor) {
          // Applying with default 'api' source. NoteEditor will pass this source 
          // to handleContentChange, which will ignore it.
          editor.updateContents(delta);
          
          // Also update our local state to reflect the latest content
          setContent(editor.getContents());
        }
      }
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

  const handleContentChange = useCallback((fullContent, delta, source) => {
    // Only send updates triggered by the user to avoid loops
    if (source !== 'user') {
      return;
    }
    
    setContent(fullContent);
    
    if (saveTimeout) clearTimeout(saveTimeout);
    setIsSaving(true);
    setIsSaved(false);
    
    // Send socket update with partial delta (much more efficient and preserves cursors)
    if (socket && delta) {
      sendNoteChange(id, delta);
      sendTyping(id);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        sendStopTyping(id);
      }, 1000);
    }
    
    const timeout = setTimeout(async () => {
      try {
        await updateNote(id, { content: fullContent, saveVersion: false });
        setIsSaving(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch { setIsSaving(false); toast.error('Failed to save'); }
    }, 2000);
    setSaveTimeout(timeout);
  }, [id, updateNote, saveTimeout, socket, sendNoteChange, sendTyping, sendStopTyping]);

  const handleTitleChange = useCallback((t) => setTitle(t), []);

  const handleSelectionChange = useCallback((range, source) => {
    // Send cursor update for both 'user' (direct selection change) and 'silent' (typing)
    if (socket && range) {
      sendCursorMove(id, range);
    }
  }, [id, socket, sendCursorMove]);

  const handleTitleBlur = async () => {
    if (title !== note?.title) {
      try { await updateNote(id, { title }); toast.success('Title updated'); }
      catch { toast.error('Failed to update title'); }
    }
  };

  const handleShare = () => setShowShareModal(true);

  const editorRef = useRef(null);

  const handleShareSubmit = async () => {
    if (!shareEmail) { toast.error('Enter an email'); return; }
    try { 
      await shareNote(id, shareEmail, sharePermission);
      toast.success(`Shared with ${shareEmail} as ${sharePermission}`); 
      setShowShareModal(false); 
      setShareEmail('');
      setSharePermission('edit');
      loadNote(); 
    }
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
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <NoteEditor 
          ref={editorRef}
          content={content} 
          onChange={handleContentChange}
          onSelectionChange={handleSelectionChange}
          users={users}
        />
      </div>

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => { setShowShareModal(false); setShareEmail(''); setSharePermission('edit'); }} title="Share Note">
        <div className="space-y-5">
          <p className="text-sm text-text-secondary">Invite someone to collaborate on this note.</p>
          <Input 
            label="Email" 
            type="email" 
            placeholder="collaborator@example.com" 
            value={shareEmail} 
            onChange={(e) => setShareEmail(e.target.value)} 
          />
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Permission</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSharePermission('edit')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  sharePermission === 'edit'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-tertiary text-text-secondary border-border hover:border-accent/50'
                }`}
              >
                Can Edit
              </button>
              <button
                onClick={() => setSharePermission('view')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  sharePermission === 'view'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-tertiary text-text-secondary border-border hover:border-accent/50'
                }`}
              >
                Can View
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2">
              {sharePermission === 'edit' ? 'Collaborator can view and edit the note' : 'Collaborator can only view the note'}
            </p>
          </div>
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
