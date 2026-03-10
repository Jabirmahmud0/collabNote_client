import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Edit2, Trash2, Share2, Clock, FileText, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../ui/Avatar';

const NoteCard = ({ note, onClick, onEdit, onShare, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  // Debug logging
  const contentDebug = note.content ? (typeof note.content === 'string' ? 'STRING: ' + note.content.substring(0, 100) : Object.keys(note.content)) : null;
  console.log('NoteCard received note:', {
    _id: note._id,
    title: note.title,
    hasContent: !!note.content,
    contentType: typeof note.content,
    contentDebug,
    contentOps: note.content?.ops,
    hasExcerpt: !!note.excerpt,
    excerpt: note.excerpt
  });

  // Get excerpt from backend or generate from content
  const excerpt = (() => {
    // First try backend excerpt
    if (note.excerpt && note.excerpt.trim()) return note.excerpt;
    
    // Fallback: generate from content
    if (!note.content) return 'No content yet...';
    
    // If content is HTML string, strip tags
    if (typeof note.content === 'string') {
      const text = note.content
        .replace(/<[^>]*>/g, ' ') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')   // Convert &nbsp; to space
        .replace(/\s+/g, ' ')      // Normalize whitespace
        .trim()
        .slice(0, 120);
      return text || 'Empty note';
    }
    
    // Handle Delta object format
    const ops = note.content.ops || note.content;
    
    if (!Array.isArray(ops)) return 'No content yet...';
    
    const text = ops
      .filter((op) => op && typeof op.insert === 'string')
      .map((op) => op.insert)
      .join(' ')
      .slice(0, 120);
    return text.trim() || 'Empty note';
  })();

  // Calculate word count
  const wordCount = (() => {
    if (!note.content) return 0;
    
    // If content is HTML string, strip tags and count
    if (typeof note.content === 'string') {
      const text = note.content
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return text ? text.split(/\s+/).filter(w => w).length : 0;
    }
    
    // Handle Delta object format
    const ops = note.content.ops || note.content;
    
    if (!Array.isArray(ops)) return 0;
    
    const text = ops
      .filter((op) => op && typeof op.insert === 'string')
      .map((op) => op.insert)
      .join(' ');
    return text.trim().split(/\s+/).filter(w => w).length;
  })();

  const collaborators = note.collaborators || [];
  const tags = note.tags || [];
  const hasTitle = note.title && note.title.trim() !== '' && note.title !== 'Untitled';

  return (
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
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
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
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Note
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onShare(note._id); setShowMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <div className="h-px bg-border mx-2 my-1" />
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(note._id); setShowMenu(false); }}
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
        {/* Word Count */}
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <FileText className="w-3.5 h-3.5" />
          <span>{wordCount} words</span>
        </div>

        {/* Collaborators */}
        {collaborators.length > 0 && (
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
        )}
      </div>
    </motion.div>
  );
};

export default NoteCard;
