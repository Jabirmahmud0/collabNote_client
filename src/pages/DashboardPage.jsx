import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { useSocket } from '../hooks/useSocket';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import NoteList from '../components/notes/NoteList';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notes, tags, loading, fetchNotes, createNote, deleteNote, permanentDelete, restoreNote, shareNote } = useNotes();
  const { onNoteShared, onInviteResponse } = useSocket();

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('edit');
  const [newNoteTitle, setNewNoteTitle] = useState('');

  // Fetch notes on mount and whenever filter or tag changes
  useEffect(() => {
    fetchNotes({ filter, tag: selectedTag });
  }, [filter, selectedTag]);



  // Real-time: refresh when someone shares a note with us
  useEffect(() => {
    const unsubscribe = onNoteShared(({ note }) => {
      // toast.success(`"${note?.title || 'A note'}" was shared with you!`); // Now handled by NotificationCenter
      fetchNotes({ filter: 'all', tag: null, force: true });
      if (filter !== 'all') {
        fetchNotes({ filter, tag: selectedTag, force: true });
      }
    });
    return unsubscribe;
  }, [onNoteShared, filter, selectedTag]);

  // Real-time: refresh when someone accepts our invite
  useEffect(() => {
    const unsubscribe = onInviteResponse((response) => {
      if (response.action === 'accept') {
        toast.success(`${response.userName} accepted your invitation!`);
        // Refresh notes to show updated collaborator list
        fetchNotes({ filter, tag: selectedTag, force: true });
      }
    });
    return unsubscribe;
  }, [onInviteResponse, filter, selectedTag, fetchNotes]);

  const loadNotes = async () => {
    try {
      await fetchNotes({ filter, tag: selectedTag, force: true });
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const handleCreateNote = () => setShowCreateModal(true);

  const handleCreateNoteSubmit = async () => {
    try {
      const note = await createNote({ 
        title: newNoteTitle.trim() || 'Untitled', 
        content: { ops: [] } 
      });
      setShowCreateModal(false);
      setNewNoteTitle('');
      navigate(`/note/${note._id}`);
    } catch { toast.error('Failed to create note'); }
  };

  const handleNoteClick = (noteId) => navigate(`/note/${noteId}`);

  const handleDelete = async (noteId) => {
    const isTrash = filter === 'trash';
    try {
      if (isTrash) {
        await permanentDelete(noteId);
        toast.success('Note permanently deleted');
      } else {
        await deleteNote(noteId);
        toast.success('Note moved to trash');
      }
      await loadNotes();
    } catch (error) {
      console.error('Delete error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to delete note';
      toast.error(message);
    }
  };

  const handleRestore = async (noteId) => {
    try {
      await restoreNote(noteId);
      toast.success('Note restored from trash');
      await loadNotes();
    } catch (error) {
      console.error('Restore error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to restore note';
      toast.error(message);
    }
  };

  const handleShare = (noteId) => { setSelectedNoteId(noteId); setShowShareModal(true); };

  const handleShareSubmit = async () => {
    if (!shareEmail) { toast.error('Enter an email'); return; }
    try {
      await shareNote(selectedNoteId, shareEmail, sharePermission);
      toast.success(`Shared with ${shareEmail} as ${sharePermission}`);
      setShowShareModal(false);
      setShareEmail('');
      setSharePermission('edit');
    } catch (error) {
      console.error('Share error:', error);
      const message = error.response?.data?.message || 'Failed to share note';
      toast.error(message);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return note.title?.toLowerCase().includes(q) || note.excerpt?.toLowerCase().includes(q);
    });
  }, [notes, searchQuery]);

  const filterLabels = { 
    all: 'All Notes', 
    owned: 'My Notes', 
    shared: 'Shared with Me', 
    trash: 'Trash' 
  };

  return (
    <div className="h-screen flex bg-bg-primary overflow-hidden">
      <div className="mesh-bg opacity-20 pointer-events-none" />

      <Sidebar
        filter={filter}
        onFilterChange={setFilter}
        tags={tags}
        onTagClick={setSelectedTag}
        selectedTag={selectedTag}
        onCreateNote={handleCreateNote}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Topbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onCreateNote={handleCreateNote} />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto"
          >
            {/* Header with Stats */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-bold tracking-tight text-text-primary">
                    {filterLabels[filter] || filter}
                  </h2>
                  {!loading && (
                    <span className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-xs font-medium text-text-muted">
                      {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted mt-1">
                  {selectedTag ? `Filtered by tag: ${selectedTag}` : 'Manage and organize your notes'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleCreateNote}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Note
                </Button>
              </div>
            </div>

            <NoteList
              notes={filteredNotes}
              loading={loading}
              onNoteClick={handleNoteClick}
              onEdit={handleNoteClick}
              onShare={handleShare}
              onDelete={handleDelete}
              onCreateNote={handleCreateNote}
            />
          </motion.div>
        </div>
      </div>

      {/* Create Note Modal */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); setNewNoteTitle(''); }} title="Create New Note">
        <div className="space-y-5">
          <p className="text-sm text-text-secondary">Give your note a title to get started.</p>
          <Input
            label="Title"
            placeholder="Enter note title..."
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateNoteSubmit()}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleCreateNoteSubmit}>Create Note</Button>
          </div>
        </div>
      </Modal>

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
            <Button variant="primary" size="sm" onClick={handleShareSubmit}>Send Invite</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
