import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Sparkles } from 'lucide-react';
import NoteCard from './NoteCard';

const NoteList = ({ notes, loading, onNoteClick, onEdit, onShare, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="cn-card p-5 animate-pulse-soft">
            <div className="h-5 w-3/4 bg-border rounded-md mb-3" />
            <div className="h-3 w-1/2 bg-border/50 rounded-md mb-4" />
            <div className="h-3 w-full bg-border/50 rounded-md mb-2" />
            <div className="h-3 w-4/5 bg-border/50 rounded-md mb-4" />
            <div className="h-px bg-border my-3" />
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-border/50 rounded-full" />
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
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
          <FileText className="w-9 h-9 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">No notes yet</h3>
        <p className="text-sm text-text-muted max-w-md mb-6">
          Start capturing your ideas and collaborating with others. Create your first note now.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold text-sm shadow-[0_4px_16px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Your First Note
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
