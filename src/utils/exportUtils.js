import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

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
 * Convert Quill delta to Markdown
 */
const deltaToMarkdown = (delta) => {
  if (!delta?.ops) return '';
  
  let markdown = '';
  let currentList = null;
  
  delta.ops.forEach((op) => {
    const text = typeof op.insert === 'string' ? op.insert : '';
    const attrs = op.attributes || {};
    
    if (attrs.header) {
      const prefix = '#'.repeat(attrs.header);
      markdown += `${prefix} ${text.trim()}\n\n`;
    } else if (attrs.list === 'bullet') {
      if (currentList !== 'bullet') {
        currentList = 'bullet';
      }
      markdown += `- ${text.trim()}\n`;
    } else if (attrs.list === 'ordered') {
      if (currentList !== 'ordered') {
        currentList = 'ordered';
      }
      markdown += `1. ${text.trim()}\n`;
    } else {
      currentList = null;
      let formatted = text;
      
      if (attrs.bold) formatted = `**${formatted}**`;
      if (attrs.italic) formatted = `*${formatted}*`;
      if (attrs.underline) formatted = `_${formatted}_`;
      if (attrs.strike) formatted = `~~${formatted}~~`;
      if (attrs.code) formatted = `\`${formatted}\``;
      if (attrs.link) formatted = `[${formatted}](${attrs.link})`;
      
      markdown += formatted;
    }
  });
  
  return markdown.trim();
};

/**
 * Export note as PDF
 */
export const exportToPDF = async (note, filename = 'note') => {
  const doc = new jsPDF();
  
  const text = deltaToText(note.content);
  const title = note.title || 'Untitled';
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 20, 20);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  const date = new Date(note.updatedAt).toLocaleString();
  doc.text(`Last updated: ${date}`, 20, 30);
  
  // Add content with word wrapping
  doc.setFontSize(12);
  doc.setTextColor(0);
  
  const lines = doc.splitTextToSize(text, 170);
  let y = 45;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  lines.forEach((line) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 7;
  });
  
  // Save
  const safeFilename = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
  doc.save(safeFilename);
};

/**
 * Export note as Markdown
 */
export const exportToMarkdown = async (note, filename = 'note') => {
  const markdown = deltaToMarkdown(note.content);
  const title = note.title || 'Untitled';
  
  const content = `# ${title}\n\n${markdown}`;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  
  const safeFilename = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  saveAs(blob, safeFilename);
};

/**
 * Export note as JSON
 */
export const exportToJSON = async (note, filename = 'note') => {
  const content = JSON.stringify(note, null, 2);
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  
  const safeFilename = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  saveAs(blob, safeFilename);
};
