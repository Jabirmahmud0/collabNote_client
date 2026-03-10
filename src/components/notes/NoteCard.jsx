import React, { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Edit2, Trash2, Share2, Clock, Users, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../ui/Avatar';

const NoteCard = ({ note, onClick, onEdit, onShare, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Memoize excerpt calculation
  const excerpt = useMemo(() => {
    // Use backend excerpt if available
    if (note.excerpt !== undefined && note.excerpt !== null) {
      return note.excerpt || 'No content yet...';
    }

    // Fallback: generate from content
    if (!note.content) return 'No content yet...';

    // If content is HTML string, strip tags
    if (typeof note.content === 'string') {
      const text = note.content
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 150);
      return text || 'Empty note';
    }

    // Handle Delta object format
    const ops = note.content?.ops || note.content;

    if (!Array.isArray(ops)) return 'No content yet...';

    const text = ops
      .filter((op) => op && typeof op.insert === 'string')
      .map((op) => op.insert)
      .join(' ')
      .slice(0, 150);
    return text.trim() || 'Empty note';
  }, [note.excerpt, note.content]);

  const collaborators = (note.collaborators || []).filter(c => c.status === 'accepted');
  const tags = note.tags || [];
  const hasTitle = note.title && note.title.trim() !== '' && note.title !== 'Untitled';

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(note._id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={onClick}
        className="group cn-card cursor-pointer overflow-hidden"
      >
        {/* Card Content */}
        <div className="p-5">
          {/* Header with Title */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 mr-2">
              <div className="flex items-center gap-2 mb-1">
                {hasTitle ? (
                  <h3 className="text-base font-bold text-text-primary truncate group-hover:text-accent transition-colors">
                    {note.title}
                  </h3>
                ) : (
                  <h3 className="text-sm font-medium text-text-muted italic truncate">
                    Untitled Note
                  </h3>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-border transition-all opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 4 }}
                      className="absolute right-0 mt-1 w-44 bg-bg-elevated border border-border rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(note._id); setShowMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-border transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Note
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onShare(note._id); setShowMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-border transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <div className="h-px bg-border mx-2 my-1" />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-4 min-h-[3.25rem]">
            {excerpt}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-4">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="cn-tag text-[10px] px-2 py-0.5">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-[10px] text-text-muted px-1">+{tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-bg-tertiary/50 border-t border-border flex items-center justify-between">
          {/* Collaborators */}
          {collaborators.length > 0 ? (
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-text-muted" />
              <div className="flex -space-x-1.5">
                {collaborators.slice(0, 3).map((collab) => (
                  <Avatar
                    key={collab.user._id}
                    src={collab.user.avatar}
                    name={collab.user.name}
                    size="xs"
                    className="w-5 h-5 text-[8px] border border-bg-secondary"
                  />
                ))}
                {collaborators.length > 3 && (
                  <div className="w-5 h-5 rounded-full bg-bg-tertiary border border-border flex items-center justify-center text-[7px] font-medium text-text-muted">
                    +{collaborators.length - 3}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-text-muted">
                {collaborators.length} {collaborators.length === 1 ? 'collaborator' : 'collaborators'}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-text-muted">Private note</span>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-bg-elevated border border-border rounded-2xl shadow-2xl p-6 mx-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-danger" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Delete Note?</h3>
                    <p className="text-sm text-text-muted">
                      {note.title || 'Untitled Note'}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-text-secondary mb-6">
                  This will move the note to trash. You can restore it later or permanently delete it.
                </p>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-danger hover:bg-danger-hover text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete Note
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NoteCard;
