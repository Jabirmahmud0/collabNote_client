import React from 'react';
import { Search } from 'lucide-react';

const NoteSearch = ({ value, onChange, placeholder = 'Search notes...' }) => {
  return (
    <div className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-bg-input border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all hover:border-border-hover"
      />
    </div>
  );
};

export default NoteSearch;
