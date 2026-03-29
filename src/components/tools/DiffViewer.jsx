import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { compareTextsDetailed, getDiffSummary, getDiffState, chunkDiff, generatePatch } from '../../utils/diffUtils';
import Button from '../ui/Button';
import { Minus, Plus, RefreshCw, FileText, CheckCircle, AlertCircle, Maximize2, Columns, Download, Copy, ChevronDown, ChevronUp, Share } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DiffViewer = () => {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diffResult, setDiffResult] = useState(null);
  const [diffState, setDiffState] = useState('none');
  const [viewMode, setViewMode] = useState('unified'); // unified, split
  const [showAllLines, setShowAllLines] = useState(false);
  const [currentHunkIndex, setCurrentHunkIndex] = useState(-1);
  const resultsRef = useRef(null);

  const handleCompare = () => {
    const state = getDiffState(original, modified);
    setDiffState(state);
    
    if (state === 'changed') {
      const detailedDiff = compareTextsDetailed(original, modified);
      setDiffResult(detailedDiff);
    } else {
      setDiffResult(null);
    }
  };

  const detailedDiff = diffResult || [];
  const summary = diffResult ? getDiffSummary(detailedDiff) : null;
  const hunks = diffResult ? chunkDiff(detailedDiff) : [];
  const displayLines = showAllLines ? detailedDiff : hunks.flatMap((h, i) => [
    ...(i > 0 ? [{ type: 'hunk-header', content: `@@ Hunk ${i+1} @@` }] : []),
    ...h.lines
  ]);

  const handleCopy = () => {
    const patch = generatePatch('note.txt', original, modified);
    navigator.clipboard.writeText(patch);
    toast.success('Diff copied to clipboard as patch!');
  };

  const handleDownload = () => {
    const patch = generatePatch('note.txt', original, modified);
    const blob = new Blob([patch], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'changes.patch';
    a.click();
    toast.success('Patch file downloaded');
  };

  const scrollToHunk = (index) => {
    if (index < 0 || index >= hunks.length) return;
    setCurrentHunkIndex(index);
    const hunkElement = document.getElementById(`hunk-${index}`);
    if (hunkElement) {
      hunkElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-border flex items-center justify-between bg-bg-primary/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <Columns size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary tracking-tight">Advanced Diff Viewer</h2>
            <p className="text-[11px] uppercase tracking-widest font-bold text-text-muted">Compare & Review Changes</p>
          </div>
        </div>
        
        {diffResult && (
          <div className="flex items-center gap-2">
            <div className="flex bg-bg-secondary rounded-lg p-1 border border-border">
              <button 
                onClick={() => setViewMode('unified')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'unified' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}
              >
                Unified
              </button>
              <button 
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'split' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}
              >
                Split
              </button>
            </div>
            
            {diffResult && hunks.length > 1 && (
              <div className="flex bg-bg-secondary rounded-lg p-1 border border-border">
                <button 
                  onClick={() => scrollToHunk(Math.max(0, currentHunkIndex - 1))}
                  className="p-1 text-text-secondary hover:text-primary disabled:opacity-30"
                  disabled={currentHunkIndex <= 0}
                >
                  <ChevronUp size={16} />
                </button>
                <div className="px-2 flex items-center text-[10px] font-bold text-text-muted border-x border-white/5">
                  {currentHunkIndex + 1} / {hunks.length}
                </div>
                <button 
                  onClick={() => scrollToHunk(Math.min(hunks.length - 1, currentHunkIndex + 1))}
                  className="p-1 text-text-secondary hover:text-primary disabled:opacity-30"
                  disabled={currentHunkIndex >= hunks.length - 1}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            )}

            <Button variant="outline" size="sm" onClick={handleCopy} icon={<Copy size={14} />} />
            <Button variant="outline" size="sm" onClick={handleDownload} icon={<Download size={14} />} />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar bg-bg-primary/30">
        {/* Input Areas */}
        <div className="p-6 grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
          <div className="space-y-3 group">
            <div className="flex items-center justify-between text-text-secondary transition-colors group-hover:text-primary">
              <div className="flex items-center gap-2">
                <FileText size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Source String A</span>
              </div>
              <span className="text-[10px] opacity-50">{original.length} chars</span>
            </div>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              className="w-full h-80 p-5 bg-bg-secondary/50 border border-border/50 rounded-2xl text-primary font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all hover:border-border placeholder:text-text-muted/30 shadow-inner"
              placeholder="Paste original text here..."
            />
          </div>

          <div className="flex flex-col items-center gap-4 py-12 h-full justify-center">
            <div className="h-20 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            <motion.div whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="primary" 
                size="md" 
                onClick={handleCompare}
                className="rounded-full w-14 h-14 p-0 shadow-[0_0_30px_rgba(124,92,252,0.3)] animate-glow"
                icon={<RefreshCw size={24} />}
              />
            </motion.div>
            <div className="h-20 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
          </div>

          <div className="space-y-3 group">
            <div className="flex items-center justify-between text-text-secondary transition-colors group-hover:text-primary">
              <div className="flex items-center gap-2">
                <FileText size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Source String B</span>
              </div>
              <span className="text-[10px] opacity-50">{modified.length} chars</span>
            </div>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              className="w-full h-80 p-5 bg-bg-secondary/50 border border-border/50 rounded-2xl text-primary font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all hover:border-border placeholder:text-text-muted/30 shadow-inner"
              placeholder="Paste modified text here..."
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="px-6 pb-12 space-y-6" ref={resultsRef}>
          {diffState === 'empty' && (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted border-2 border-dashed border-border/40 rounded-[2rem] bg-white/[0.02] backdrop-blur-sm">
              <AlertCircle size={40} className="mb-4 opacity-20" />
              <p className="text-sm font-bold tracking-tight">Requirement: Provide Input</p>
              <p className="text-xs opacity-60 mt-1">Both text buffers are currently empty.</p>
            </div>
          )}

          {diffState === 'identical' && (
            <div className="flex flex-col items-center justify-center py-20 text-success border-2 border-dashed border-success/30 rounded-[2rem] bg-success/5 backdrop-blur-sm">
              <CheckCircle size={40} className="mb-4 opacity-40" />
              <p className="text-sm font-bold tracking-tight">No Differences Detected</p>
              <p className="text-xs text-text-muted mt-1 uppercase tracking-widest font-black">Buffers Match Precisely</p>
            </div>
          )}

          {diffState === 'changed' && diffResult && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-4">
              {/* Stats & Actions */}
              <div className="flex items-center justify-between bg-bg-elevated/50 p-4 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex items-center gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-text-muted tracking-tighter">Changes Summary</p>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 font-mono font-bold text-lg">+{summary.additions}</span>
                      <span className="text-red-400 font-mono font-bold text-lg">-{summary.deletions}</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/5" />
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-text-muted tracking-tighter">Density</p>
                    <p className="text-primary font-mono font-bold text-lg leading-tight">{summary.density}%</p>
                  </div>
                  <div className="h-8 w-px bg-white/5" />
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-text-muted tracking-tighter">Chunks</p>
                    <p className="text-primary font-mono font-bold text-lg leading-tight">{summary.changedBlocks}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="xs" 
                    onClick={() => setShowAllLines(!showAllLines)}
                    className="text-[10px] font-black uppercase tracking-widest px-4"
                  >
                    {showAllLines ? 'Hide Context' : 'Show All Lines'}
                  </Button>
                </div>
              </div>

              {/* Render Unified / Split View */}
              {viewMode === 'unified' ? (
                <div className="cn-card bg-bg-primary border-border/80 shadow-2xl overflow-hidden rounded-[1.5rem]">
                  <div className="font-mono text-[11px] leading-relaxed p-2">
                    <table className="w-full border-collapse">
                      <tbody>
                        {displayLines.map((line, idx) => {
                          if (line.type === 'hunk-header') {
                            const hunkIdx = parseInt(line.content.match(/\d+/) || [0])[0] - 1;
                            return (
                              <tr key={idx} id={`hunk-${hunkIdx}`} className="bg-accent/10 text-accent font-black select-none border-y border-accent/20">
                                <td colSpan={4} className="px-4 py-2 flex items-center gap-2">
                                  <Maximize2 size={12} /> {line.content}
                                </td>
                              </tr>
                            );
                          }

                          const isAdded = line.type === 'added';
                          const isRemoved = line.type === 'removed';
                          const rowClass = isAdded ? 'bg-emerald-500/25' : isRemoved ? 'bg-rose-500/25' : 'hover:bg-white/[0.03]';
                          const contentClass = isAdded ? 'text-emerald-400' : isRemoved ? 'text-rose-400' : 'text-text-primary/90';
                          const gutterColor = isAdded ? 'bg-emerald-500/35 text-emerald-100' : isRemoved ? 'bg-rose-500/35 text-rose-100' : 'text-text-muted/60 bg-bg-secondary/30';

                          return (
                            <tr key={idx} className={`${rowClass} group transition-colors duration-100`}>
                              <td className={`w-12 px-2 text-right select-none font-bold border-r border-white/5 text-[10px] ${gutterColor}`}>{line.leftLineNum || ''}</td>
                              <td className={`w-12 px-2 text-right select-none font-bold border-r border-white/5 text-[10px] ${gutterColor}`}>{line.rightLineNum || ''}</td>
                              <td className={`w-10 text-center select-none text-[15px] font-black ${contentClass}`}>{isAdded ? '+' : isRemoved ? '-' : ' '}</td>
                              <td className={`px-4 py-1 whitespace-pre break-all ${contentClass}`}>
                                {line.wordDiffs ? (
                                  line.wordDiffs.map((w, wi) => (
                                    <span key={wi} className={
                                      w.removed && isRemoved ? 'bg-rose-500/50 text-white rounded px-0.5 border-b-2 border-rose-300' : 
                                      w.added && isAdded ? 'bg-emerald-500/50 text-white rounded px-0.5 border-b-2 border-emerald-300' : 
                                      ''
                                    }>
                                      {w.value}
                                    </span>
                                  ))
                                ) : (
                                  line.content || ' '
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-px bg-white/5 rounded-[1.5rem] overflow-hidden border border-white/5 shadow-2xl">
                  {/* Left Side (Original) */}
                  <div className="bg-bg-primary/80 backdrop-blur-sm min-h-[400px]">
                    <div className="bg-bg-secondary/50 p-3 text-[10px] font-black uppercase tracking-widest text-text-muted border-b border-white/5 text-center flex items-center justify-center gap-2">
                       <Minus size={12} className="text-rose-500" /> Original State
                    </div>
                    <div className="font-mono text-[11px] leading-relaxed p-2 h-full">
                      {detailedDiff.map((line, idx) => {
                        if (line.type === 'added') return <div key={idx} className="h-6 bg-emerald-500/[0.03] border-b border-white/[0.02]" />;
                        return (
                          <div key={idx} className={`flex h-6 items-center px-1 border-b border-white/[0.02] ${line.type === 'removed' ? 'bg-rose-500/15 text-rose-300' : 'text-text-primary/70'}`}>
                            <span className="w-10 text-right pr-3 text-[9px] text-text-muted/40 select-none font-bold">{line.leftLineNum}</span>
                            <span className="whitespace-pre overflow-hidden text-ellipsis px-2">
                              {line.type === 'removed' && line.wordDiffs ? (
                                line.wordDiffs.map((w, wi) => (
                                  <span key={wi} className={w.removed ? 'bg-rose-500/50 text-white rounded px-0.5' : ''}>
                                    {w.value}
                                  </span>
                                ))
                              ) : (
                                line.content || ' '
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Right Side (Modified) */}
                  <div className="bg-bg-primary/80 backdrop-blur-sm min-h-[400px]">
                    <div className="bg-bg-secondary/50 p-3 text-[10px] font-black uppercase tracking-widest text-text-muted border-b border-white/5 text-center flex items-center justify-center gap-2">
                      <Plus size={12} className="text-emerald-500" /> Modified State
                    </div>
                    <div className="font-mono text-[11px] leading-relaxed p-2 h-full">
                      {detailedDiff.map((line, idx) => {
                        if (line.type === 'removed') return <div key={idx} className="h-6 bg-rose-500/[0.03] border-b border-white/[0.02]" />;
                        return (
                          <div key={idx} className={`flex h-6 items-center px-1 border-b border-white/[0.02] ${line.type === 'added' ? 'bg-emerald-500/15 text-emerald-300' : 'text-text-primary/70'}`}>
                            <span className="w-10 text-right pr-3 text-[9px] text-text-muted/40 select-none font-bold">{line.rightLineNum}</span>
                            <span className="whitespace-pre overflow-hidden text-ellipsis px-2">
                              {line.type === 'added' && line.wordDiffs ? (
                                line.wordDiffs.map((w, wi) => (
                                  <span key={wi} className={w.added ? 'bg-emerald-500/50 text-white rounded px-0.5' : ''}>
                                    {w.value}
                                  </span>
                                ))
                              ) : (
                                line.content || ' '
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;
