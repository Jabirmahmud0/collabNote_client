import { diffLines, diffWords } from 'diff';

/**
 * Compare two texts and return a detailed line-by-line diff with word-level highlighting
 */
export const compareTextsDetailed = (text1, text2) => {
  const lineDiffs = diffLines(text1, text2);
  const result = [];
  let leftLineNum = 1;
  let rightLineNum = 1;

  lineDiffs.forEach((part, index) => {
    const lines = part.value.split('\n');
    if (lines[lines.length - 1] === '') {
      lines.pop();
    }

    // Check if this removed part is followed by an added part (potential line modification)
    const nextPart = lineDiffs[index + 1];
    const isModification = part.removed && nextPart?.added;

    lines.forEach((line, lineIdx) => {
      if (part.added) {
        let words = null;
        if (index > 0 && lineDiffs[index - 1].removed && lineDiffs[index - 1].value.split('\n').length === lines.length) {
          const matchingOldLine = lineDiffs[index - 1].value.split('\n')[lineIdx];
          if (matchingOldLine !== undefined) {
            words = diffWords(matchingOldLine, line);
          }
        }

        result.push({
          type: 'added',
          rightLineNum: rightLineNum++,
          content: line,
          wordDiffs: words,
        });
      } else if (part.removed) {
        let words = null;
        if (isModification && nextPart.value.split('\n').length === lines.length) {
          const matchingModifiedLine = nextPart.value.split('\n')[lineIdx];
          if (matchingModifiedLine !== undefined) {
            words = diffWords(line, matchingModifiedLine);
          }
        }

        result.push({
          type: 'removed',
          leftLineNum: leftLineNum++,
          content: line,
          wordDiffs: words,
        });
      } else {
        result.push({
          type: 'unchanged',
          leftLineNum: leftLineNum++,
          rightLineNum: rightLineNum++,
          content: line,
        });
      }
    });
  });

  return result;
};

/**
 * Groups lines into hunks with context
 */
export const chunkDiff = (detailedDiff, contextSize = 3) => {
  const hunks = [];
  let currentHunk = null;

  detailedDiff.forEach((line, index) => {
    const isChanged = line.type !== 'unchanged';
    
    // Check if within context of a change
    let inContext = false;
    for (let i = Math.max(0, index - contextSize); i <= Math.min(detailedDiff.length - 1, index + contextSize); i++) {
      if (detailedDiff[i].type !== 'unchanged') {
        inContext = true;
        break;
      }
    }

    if (inContext) {
      if (!currentHunk) {
        currentHunk = {
          lines: [],
          startLeft: line.leftLineNum || null,
          startRight: line.rightLineNum || null,
        };
        hunks.push(currentHunk);
      }
      currentHunk.lines.push(line);
    } else {
      currentHunk = null;
    }
  });

  return hunks;
};

/**
 * Generate standard .diff patch format
 */
export const generatePatch = (filename, oldText, newText) => {
  const diffs = diffLines(oldText, newText);
  let patch = `--- ${filename} (Original)\n+++ ${filename} (Modified)\n`;
  
  let leftLine = 1;
  let rightLine = 1;

  diffs.forEach(part => {
    const lines = part.value.split('\n');
    if (lines[lines.length - 1] === '') lines.pop();

    if (part.added || part.removed) {
      // For a real .diff, we should group by hunks, but for export simplicity:
      lines.forEach(line => {
        patch += `${part.added ? '+' : '-'}${line}\n`;
      });
    } else {
      lines.forEach(line => {
        patch += ` ${line}\n`;
      });
    }
  });

  return patch;
};

/**
 * Get a summary of changes
 */
export const getDiffSummary = (detailedDiff) => {
  let additions = 0;
  let deletions = 0;
  let totalLines = detailedDiff.length;
  let changedLines = 0;

  detailedDiff.forEach((line) => {
    if (line.type === 'added') {
      additions++;
      changedLines++;
    }
    if (line.type === 'removed') {
      deletions++;
      changedLines++;
    }
  });

  return { 
    additions, 
    deletions, 
    totalLines, 
    changedBlocks: chunkDiff(detailedDiff).length,
    density: totalLines > 0 ? ((changedLines / totalLines) * 100).toFixed(1) : 0
  };
};

/**
 * @deprecated Use compareTextsDetailed for newer UI
 */
export const compareDeltas = (delta1, delta2) => {
  const text1 = deltaToText(delta1);
  const text2 = deltaToText(delta2);
  return diffLines(text1, text2);
};

const deltaToText = (delta) => {
  if (!delta?.ops) return '';
  return delta.ops
    .filter((op) => typeof op.insert === 'string')
    .map((op) => op.insert)
    .join('');
};
