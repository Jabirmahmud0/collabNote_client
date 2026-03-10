import * as diff from 'jdiff';

/**
 * Compare two Quill deltas and return the diff
 */
export const compareDeltas = (delta1, delta2) => {
  const text1 = deltaToText(delta1);
  const text2 = deltaToText(delta2);

  return diff.diff_main(text1, text2);
};

/**
 * Convert Quill delta to plain text
 */
const deltaToText = (delta) => {
  if (!delta?.ops) return '';
  return delta.ops
    .filter((op) => typeof op.insert === 'string')
    .map((op) => op.insert)
    .join('');
};

/**
 * Render diff as HTML with color coding
 */
export const renderDiff = (diffs) => {
  return diffs.map((part, index) => {
    const [type, text] = part;

    if (type === diff.DELETE) {
      return (
        <del key={index} className="bg-red-200 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-0.5 rounded">
          {text}
        </del>
      );
    } else if (type === diff.INSERT) {
      return (
        <ins key={index} className="bg-green-200 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-0.5 rounded">
          {text}
        </ins>
      );
    } else {
      return <span key={index}>{text}</span>;
    }
  });
};

/**
 * Get a summary of changes
 */
export const getDiffSummary = (diffs) => {
  let additions = 0;
  let deletions = 0;

  diffs.forEach(([type, text]) => {
    if (type === diff.INSERT) {
      additions += text.length;
    } else if (type === diff.DELETE) {
      deletions += text.length;
    }
  });

  return { additions, deletions };
};

/**
 * Create a side-by-side diff view data
 */
export const createSideBySideDiff = (original, modified) => {
  const diffs = compareDeltas(original, modified);

  const originalLines = [];
  const modifiedLines = [];

  diffs.forEach(([type, text]) => {
    const lines = text.split('\n');

    lines.forEach((line, i) => {
      if (type === diff.DELETE) {
        originalLines.push({ type: 'delete', content: line });
        if (i < lines.length - 1) originalLines.push({ type: 'newline' });
      } else if (type === diff.INSERT) {
        modifiedLines.push({ type: 'insert', content: line });
        if (i < lines.length - 1) modifiedLines.push({ type: 'newline' });
      } else {
        originalLines.push({ type: 'same', content: line });
        modifiedLines.push({ type: 'same', content: line });
        if (i < lines.length - 1) {
          originalLines.push({ type: 'newline' });
          modifiedLines.push({ type: 'newline' });
        }
      }
    });
  });

  return { originalLines, modifiedLines };
};
