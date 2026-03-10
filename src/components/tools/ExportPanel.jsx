import React, { useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import Button from '../ui/Button';
import { exportToPDF, exportToMarkdown, exportToJSON } from '../../utils/exportUtils';
import toast from 'react-hot-toast';

const ExportPanel = () => {
  const { notes } = useNotes();
  const [selectedNote, setSelectedNote] = useState('');
  const [format, setFormat] = useState('pdf');

  const handleExport = async () => {
    if (!selectedNote) {
      toast.error('Please select a note');
      return;
    }

    try {
      const note = notes.find((n) => n._id === selectedNote);
      if (!note) return;

      switch (format) {
        case 'pdf':
          await exportToPDF(note, note.title);
          toast.success('PDF exported successfully');
          break;
        case 'markdown':
          await exportToMarkdown(note, note.title);
          toast.success('Markdown exported successfully');
          break;
        case 'json':
          await exportToJSON(note, note.title);
          toast.success('JSON exported successfully');
          break;
        default:
          toast.error('Unknown format');
      }
    } catch (error) {
      toast.error('Export failed');
      console.error(error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">Export</h2>
        <p className="text-sm text-text-secondary">
          Export your notes to various formats
        </p>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-4">
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

        {/* Format Selector */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['pdf', 'markdown', 'json'].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`p-3 rounded-lg border font-medium transition-colors ${
                  format === f
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-secondary text-text-secondary border-border hover:border-accent'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={!selectedNote}
          className="mt-auto"
        >
          Export as {format.toUpperCase()}
        </Button>
      </div>
    </div>
  );
};

export default ExportPanel;
