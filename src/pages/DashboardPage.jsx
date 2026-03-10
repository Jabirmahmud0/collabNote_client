import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
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
  const { notes, tags, loading, fetchNotes, createNote, deleteNote, permanentDelete, restoreNote } = useNotes();

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => { loadNotes(); }, [filter, selectedTag]);

  const loadNotes = async () => {
    try { await fetchNotes({ filter, tag: selectedTag }); }
    catch (error) { console.error('Failed to load notes:', error); }
  };

  const handleCreateNote = async () => {
    try {
      const note = await createNote({ title: 'Untitled', content: { ops: [] } });
      navigate(`/note/${note._id}`);
    } catch { toast.error('Failed to create note'); }
  };

  const handleNoteClick = (noteId) => navigate(`/note/${noteId}`);

  const handleDelete = async (noteId) => {
    const isTrash = filter === 'trash';
    if (!window.confirm(`${isTrash ? 'Permanently delete' : 'Delete'} this note?`)) return;
    try {
      if (isTrash) { await permanentDelete(noteId); toast.success('Permanently deleted'); }
      else { await deleteNote(noteId); toast.success('Moved to trash'); }
      loadNotes();
    } catch { toast.error('Failed to delete'); }
  };

  const handleRestore = async (noteId) => {
    try { await restoreNote(noteId); toast.success('Restored'); loadNotes(); }
    catch { toast.error('Failed to restore'); }
  };

  const handleShare = (noteId) => { setSelectedNoteId(noteId); setShowShareModal(true); };

  const handleShareSubmit = async () => {
    if (!shareEmail) { toast.error('Enter an email'); return; }
    try { toast.success(`Shared with ${shareEmail}`); setShowShareModal(false); setShareEmail(''); }
    catch { toast.error('Failed to share'); }
  };

  const filteredNotes = notes.filter((note) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return note.title?.toLowerCase().includes(q) || note.excerpt?.toLowerCase().includes(q);
  });

  const filterLabels = { all: 'All Notes', owned: 'My Notes', shared: 'Shared', trash: 'Trash' };

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
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                  {filterLabels[filter] || filter}
                </h2>
                <p className="text-sm text-text-muted mt-0.5">
                  {selectedTag ? `Tagged: ${selectedTag}` : `${filteredNotes.length} notes`}
                </p>
              </div>
            </div>

            <NoteList
              notes={filteredNotes}
              loading={loading}
              onNoteClick={handleNoteClick}
              onEdit={handleNoteClick}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          </motion.div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => { setShowShareModal(false); setShareEmail(''); }} title="Share Note">
        <div className="space-y-5">
          <p className="text-sm text-text-secondary">Enter the email of the person you want to share with.</p>
          <Input
            label="Email"
            type="email"
            placeholder="colleague@work.com"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
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
