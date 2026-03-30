import React, { useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import api from '../../utils/api';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const AISummarizer = () => {
  const { notes } = useNotes();
  const [selectedNote, setSelectedNote] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!selectedNote) {
      toast.error('Please select a note');
      return;
    }

    setLoading(true);
    try {
      const note = notes.find((n) => n._id === selectedNote);
      if (!note) return;

      const response = await api.post('/api/ai/summarize', {
        content: note.content,
        title: note.title,
      });

      setSummary(response.data.data.summary);
    } catch (error) {
      toast.error('Failed to generate summary');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">AI Summary</h2>
        <p className="text-sm text-text-secondary">
          Generate AI-powered summaries of your notes
        </p>
      </div>

      <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto custom-scrollbar min-h-0">
        {/* Note Selector */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Select Note
          </label>
          <select
            value={selectedNote}
            onChange={(e) => setSelectedNote(e.target.value)}
            className="w-full p-3 bg-bg-secondary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Choose a note...</option>
            {notes.map((note) => (
              <option key={note._id} value={note._id}>
                {note.title || 'Untitled'}
              </option>
            ))}
          </select>
        </div>

        {/* Summarize Button */}
        <Button
          onClick={handleSummarize}
          loading={loading}
          disabled={!selectedNote}
        >
          Generate Summary
        </Button>

        {/* Summary Output */}
        {summary && (
          <div className="flex-1 p-4 bg-bg-secondary border border-border rounded-lg overflow-auto">
            <h3 className="text-sm font-medium text-text-secondary mb-2">
              Summary:
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-text-primary prose-headings:text-text-primary prose-strong:text-text-primary">
              {summary}
            </div>
          </div>
        )}

        {!summary && !loading && (
          <div className="flex-1 flex items-center justify-center text-text-secondary">
            Select a note and click "Generate Summary" to see AI-powered insights
          </div>
        )}
      </div>
    </div>
  );
};

export default AISummarizer;
