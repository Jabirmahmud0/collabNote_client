import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import NoteCard from './NoteCard';

const NoteList = ({ notes, loading, onNoteClick, onEdit, onShare, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="cn-card p-5 animate-pulse-soft">
            <div className="h-4 w-2/3 bg-border rounded-md mb-3" />
            <div className="h-3 w-full bg-border/50 rounded-md mb-2" />
            <div className="h-3 w-4/5 bg-border/50 rounded-md mb-4" />
            <div className="h-px bg-border my-3" />
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-border/50 rounded-full" />
              <div className="h-5 w-5 bg-border/50 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-bg-tertiary border border-border flex items-center justify-center mb-5">
          <FileText className="w-7 h-7 text-text-muted" />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-1">No notes yet</h3>
        <p className="text-sm text-text-muted max-w-xs">
          Create your first note to start capturing ideas and collaborating.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note, index) => (
        <motion.div
          key={note._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.35 }}
        >
          <NoteCard
            note={note}
            onClick={() => onNoteClick(note._id)}
            onEdit={onEdit}
            onShare={onShare}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default NoteList;
