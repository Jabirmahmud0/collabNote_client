import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, GitCompare, Sparkles, Download, ArrowLeft } from 'lucide-react';
import MarkdownPreview from '../components/tools/MarkdownPreview';
import DiffViewer from '../components/tools/DiffViewer';
import AISummarizer from '../components/tools/AISummarizer';
import ExportPanel from '../components/tools/ExportPanel';

const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState('markdown');
  const navigate = useNavigate();

  const tabs = [
    { id: 'markdown', label: 'Markdown', icon: FileText, component: <MarkdownPreview /> },
    { id: 'diff', label: 'Diff Viewer', icon: GitCompare, component: <DiffViewer /> },
    { id: 'summary', label: 'AI Summary', icon: Sparkles, component: <AISummarizer /> },
    { id: 'export', label: 'Export', icon: Download, component: <ExportPanel /> },
  ];

  const activeComponent = tabs.find((t) => t.id === activeTab)?.component;

  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      <div className="mesh-bg opacity-15 pointer-events-none" />

      {/* Header */}
      <header className="h-14 bg-bg-primary/60 backdrop-blur-xl border-b border-border flex items-center px-6 z-20">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-all mr-3">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-text-primary">Tools</h1>
      </header>

      {/* Tabs */}
      <div className="bg-bg-primary/40 backdrop-blur-sm border-b border-border px-6 z-10">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="tools-tab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="h-full p-6"
          >
            <div className="cn-card h-full p-6 overflow-y-auto custom-scrollbar">
              {activeComponent}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ToolsPage;
