import React from 'react';
import { Save, Share2, Download, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const Toolbar = ({
  title,
  onTitleChange,
  isSaving,
  isSaved,
  onShare,
  onExport,
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  return (
    <div className="h-20 bg-black/40 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-8 md:px-12 relative z-20">
      {/* Left: Title */}
      <div className="flex-1 max-w-2xl">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled workspace item"
          className="w-full bg-transparent text-2xl font-black text-text-primary placeholder-text-muted/40 focus:outline-none tracking-tighter"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* Save Status */}
        <div className="flex items-center gap-3">
          {isSaving ? (
            <div className="flex items-center gap-2 py-1.5 px-3 bg-white/5 border border-white/5 rounded-full">
              <div className="w-3 h-3 animate-spin rounded-full border-[1.5px] border-accent/20 border-t-accent shadow-[0_0_8px_var(--accent-glow)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent">Syncing</span>
            </div>
          ) : isSaved ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 py-1.5 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
            >
              <Save className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Secured</span>
            </motion.div>
          ) : null}
        </div>

        <div className="h-8 w-px bg-white/5 mx-2" />

        <div className="flex items-center gap-3">
            {/* Share Button */}
            <Button
              variant="primary"
              onClick={onShare}
              className="flex items-center gap-2.5 px-6 py-2.5 font-black text-xs uppercase tracking-widest shadow-xl shadow-accent/20"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">Invite Collaborators</span>
              <span className="md:hidden">Invite</span>
            </Button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-text-muted hover:text-text-primary hover:bg-white/10 transition-all active:scale-90"
              >
                <Download className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showExportMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportMenu(false)}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-4 w-56 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 py-3 overflow-hidden ring-1 ring-white/10"
                    >
                      <button
                        onClick={() => {
                          onExport('pdf');
                          setShowExportMenu(false);
                        }}
                        className="w-full px-5 py-3 text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-white/5 text-left flex items-center gap-4 transition-all"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        Export as PDF
                      </button>
                      <button
                        onClick={() => {
                          onExport('markdown');
                          setShowExportMenu(false);
                        }}
                        className="w-full px-5 py-3 text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-white/5 text-left flex items-center gap-4 transition-all"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        Export Markdown
                      </button>
                      <button
                        onClick={() => {
                          onExport('json');
                          setShowExportMenu(false);
                        }}
                        className="w-full px-5 py-3 text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-white/5 text-left flex items-center gap-4 transition-all"
                      >
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        Export as JSON
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
