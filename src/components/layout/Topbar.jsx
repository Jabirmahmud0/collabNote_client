import React from 'react';
import { Search, Plus, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import NotificationCenter from './NotificationCenter';

const Topbar = ({ searchQuery, onSearchChange, onCreateNote }) => {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-bg-primary/60 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 z-20 sticky top-0">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-secondary/60 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all hover:border-border-hover"
          />
          <kbd className="hidden md:inline absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onCreateNote}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-[0.97]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        <NotificationCenter />

        <ThemeToggle />

        <div className="w-px h-5 bg-border mx-1" />

        <UserMenu user={user} />
      </div>
    </header>
  );
};

export default Topbar;
