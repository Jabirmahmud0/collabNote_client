import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Share2, Trash2, Plus, ChevronDown, ChevronRight,
  LayoutDashboard, Settings, Wrench, PanelLeftClose, PanelLeft,
} from 'lucide-react';

const Sidebar = ({
  filter = 'all',
  onFilterChange,
  tags = [],
  onTagClick,
  selectedTag,
  onCreateNote,
}) => {
  const location = useLocation();
  const [tagsExpanded, setTagsExpanded] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'all', label: 'All Notes', icon: LayoutDashboard },
    { id: 'owned', label: 'My Notes', icon: FileText },
    { id: 'shared', label: 'Shared', icon: Share2 },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-bg-sidebar border-r border-border flex flex-col h-full z-20 shrink-0 relative overflow-hidden"
    >
      {/* Header */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-3' : 'justify-between px-5'} h-16 border-b border-border`}>
        <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-secondary rounded-lg flex items-center justify-center shadow-md shrink-0">
            <span className="text-white font-bold text-[11px]">CN</span>
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base font-bold tracking-tight text-text-primary"
            >
              CollabNote
            </motion.span>
          )}
        </Link>
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="mx-auto mt-3 p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors">
          <PanelLeft className="w-4 h-4" />
        </button>
      )}

      {/* New Note Button */}
      <div className={`${collapsed ? 'px-3 mt-3' : 'px-4 mt-4'}`}>
        <button
          onClick={onCreateNote}
          className={`w-full group flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all shadow-[0_2px_12px_var(--accent-glow)] hover:shadow-[0_4px_20px_var(--accent-glow)] active:scale-[0.97] ${collapsed ? 'p-2.5' : 'py-2.5 px-4 text-sm'}`}
        >
          <Plus className={`w-4 h-4 transition-transform duration-300 ${!collapsed ? 'group-hover:rotate-90' : ''}`} />
          {!collapsed && 'New Note'}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} mt-6 space-y-1 overflow-y-auto custom-scrollbar`}>
        {!collapsed && <div className="section-label px-3 mb-2">Workspace</div>}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = filter === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-3 ${collapsed ? 'p-2.5' : 'px-3 py-2'} rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/15'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-[17px] h-[17px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto w-1 h-3.5 bg-accent rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}

        {/* Tags Section */}
        {!collapsed && tags.length > 0 && (
          <div className="pt-5">
            <button
              onClick={() => setTagsExpanded(!tagsExpanded)}
              className="w-full flex items-center justify-between px-3 py-1.5 section-label hover:text-text-secondary transition-colors"
            >
              <span>Tags</span>
              {tagsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            <AnimatePresence>
              {tagsExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-0.5 mt-1 overflow-hidden"
                >
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagClick(selectedTag === tag ? null : tag)}
                      className={`w-full text-left text-[13px] py-1.5 px-3 rounded-lg transition-all font-medium flex items-center gap-2 ${
                        selectedTag === tag
                          ? 'text-accent bg-accent/5'
                          : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedTag === tag ? 'bg-accent' : 'bg-text-muted/30'}`} />
                      {tag}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>

      {/* Footer links */}
      <div className={`${collapsed ? 'px-2' : 'px-3'} pb-4 pt-3 border-t border-border space-y-1`}>
        {[
          { to: '/tools', icon: Wrench, label: 'Tools' },
          { to: '/profile', icon: Settings, label: 'Settings' },
        ].map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center ${collapsed ? 'justify-center' : ''} gap-3 ${collapsed ? 'p-2.5' : 'px-3 py-2'} rounded-xl text-[13px] font-medium transition-all ${
              location.pathname === to
                ? 'bg-accent/10 text-accent border border-accent/15'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
            }`}
            title={collapsed ? label : undefined}
          >
            <Icon className="w-[17px] h-[17px] shrink-0" />
            {!collapsed && label}
          </Link>
        ))}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
