import React, { useState } from 'react';
import { compareDeltas, renderDiff, getDiffSummary } from '../../utils/diffUtils';
import Button from '../ui/Button';

const DiffViewer = () => {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diffResult, setDiffResult] = useState(null);

  const handleCompare = () => {
    const diffs = compareDeltas(
      { ops: [{ insert: original }] },
      { ops: [{ insert: modified }] }
    );
    setDiffResult(diffs);
  };

  const summary = diffResult ? getDiffSummary(diffResult) : null;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">Diff Viewer</h2>
        <p className="text-sm text-text-secondary">
          Compare two texts to see the differences
        </p>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-4 overflow-auto">
        {/* Input Areas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Original Text
            </label>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              className="w-full h-48 p-3 bg-bg-secondary border border-border rounded-lg text-primary font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter original text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Modified Text
            </label>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              className="w-full h-48 p-3 bg-bg-secondary border border-border rounded-lg text-primary font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter modified text..."
            />
          </div>
        </div>

        {/* Compare Button */}
        <div className="flex justify-center">
          <Button onClick={handleCompare} disabled={!original || !modified}>
            Compare
          </Button>
        </div>

        {/* Results */}
        {diffResult && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex gap-4 justify-center">
              <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                <span className="text-green-500 font-medium">+{summary.additions}</span>
                <span className="text-text-secondary ml-2">additions</span>
              </div>
              <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="text-red-500 font-medium">-{summary.deletions}</span>
                <span className="text-text-secondary ml-2">deletions</span>
              </div>
            </div>

            {/* Diff View */}
            <div className="p-4 bg-bg-secondary border border-border rounded-lg">
              <h3 className="text-sm font-medium text-text-secondary mb-2">
                Differences:
              </h3>
              <div className="p-3 bg-bg-primary rounded border border-border font-mono text-sm whitespace-pre-wrap">
                {renderDiff(diffResult)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiffViewer;
