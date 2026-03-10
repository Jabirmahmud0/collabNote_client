import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Edit2, Trash2, Share2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../ui/Avatar';

const NoteCard = ({ note, onClick, onEdit, onShare, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const excerpt = note.excerpt || (() => {
    if (!note.content?.ops) return 'Empty note';
    const text = note.content.ops
      .filter((op) => typeof op.insert === 'string')
      .map((op) => op.insert)
      .join(' ')
      .slice(0, 100);
    return text || 'Empty note';
  })();

  const collaborators = note.collaborators || [];
  const tags = note.tags || [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="group cn-card p-5 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-accent transition-colors">
            {note.title || 'Untitled'}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-text-muted">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
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
                  className="absolute right-0 mt-1 w-40 bg-bg-elevated border border-border rounded-xl shadow-xl z-20 py-1.5 overflow-hidden"
                >
                  {[
                    { icon: Edit2, label: 'Edit', action: () => onEdit(note._id) },
                    { icon: Share2, label: 'Share', action: () => onShare(note._id) },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={(e) => { e.stopPropagation(); item.action(); setShowMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      {item.label}
                    </button>
                  ))}
                  <div className="h-px bg-border mx-2 my-1" />
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(note._id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Excerpt */}
      <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-4">{excerpt}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {tags.length > 0 ? (
            tags.slice(0, 2).map((tag) => (
              <span key={tag} className="cn-tag">{tag}</span>
            ))
          ) : (
            <span className="text-[10px] text-text-muted/40">No tags</span>
          )}
          {tags.length > 2 && <span className="text-[10px] text-text-muted">+{tags.length - 2}</span>}
        </div>

        {/* Collaborators */}
        <div className="flex -space-x-2">
          {collaborators.length > 0 ? (
            collaborators.slice(0, 3).map((collab) => (
              <Avatar key={collab.user._id} src={collab.user.avatar} name={collab.user.name} size="xs" className="border border-bg-secondary" />
            ))
          ) : null}
          {collaborators.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-bg-tertiary border border-border flex items-center justify-center text-[8px] font-medium text-text-muted">
              +{collaborators.length - 3}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
