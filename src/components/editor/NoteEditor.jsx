import React, { useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import CursorOverlay from './CursorOverlay';

const NoteEditor = forwardRef(({ content, onChange, onSelectionChange, readOnly = false, users }, ref) => {
  const quillRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Expose quill editor to parent
  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current?.getEditor(),
    container: quillRef.current?.container,
  }));

  // Note: selection changes are handled exclusively via onChangeSelection prop below.
  // Do NOT add a direct editor.on('selection-change') listener here — it would
  // fire twice per user action and send duplicate cursor-move socket events.

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'color',
    'background',
    'align',
    'link',
    'image',
    'code-block',
  ];

  const handleTextChange = useCallback((content, delta, source, editor) => {
    if (source === 'user') {
      const fullContent = editor.getContents();
      if (onChange) {
        onChange(fullContent, delta, source);
      }
      // Do NOT call onSelectionChange here — onChangeSelection prop handles it.
      // Calling it here duplicates cursor-move socket events on every keystroke.
    }
  }, [onChange]);

  const handleSelectionChange = useCallback((range, source, editor) => {
    if (onSelectionChange) {
      onSelectionChange(range, source);
    }
  }, [onSelectionChange]);

  return (
    <div className="h-full flex flex-col relative">
      {/* The outer wrapper must be position:relative so the CursorOverlay's
          absolute inset-0 is correctly bounded to the editor area */}
      <div className="relative flex-1 flex flex-col" style={{ position: 'relative' }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleTextChange}
          onChangeSelection={handleSelectionChange}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
          className="flex-1"
          style={{ flex: 1 }}
        />
        {/* CursorOverlay sits over the entire editor area */}
        <CursorOverlay quillRef={quillRef} users={users || []} />
      </div>
         <style>{`
        .quill {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .quill .ql-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          line-height: 1.8;
          background: transparent;
          border: none !important;
        }
        .quill .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid var(--border) !important;
          background: var(--bg-tertiary) !important;
          backdrop-filter: blur(8px);
          flex-shrink: 0;
          z-index: 20;
          padding: 1rem 2rem !important;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .quill .ql-editor {
          flex: 1;
          color: var(--text-primary);
          padding: 2rem 8% !important;
          max-width: 900px;
          margin: 0 auto;
          outline: none;
          position: relative;
          min-height: 100%;
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
        }
        .ql-editor img {

          max-width: 100%;
          height: auto;
          border-radius: var(--radius-lg);
          margin: 2rem 0;
          box-shadow: var(--shadow-lg);
          transition: all 0.4s var(--ease-out-expo);
          cursor: pointer;
          display: block;
        }
        .ql-editor img:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl), var(--shadow-glow);
        }
        .quill .ql-editor.ql-blank::before {
          color: var(--text-secondary);
          opacity: 0.3;
          left: 8% !important;
          right: 8% !important;
          font-style: normal;
        }
        
        /* Premium Toolbar Buttons */
        .ql-snow.ql-toolbar button, 
        .ql-snow .ql-toolbar button {
          border-radius: 8px !important;
          width: 32px !important;
          height: 32px !important;
          padding: 4px !important;
          transition: all 0.2s;
        }
        .ql-snow.ql-toolbar button:hover,
        .ql-snow .ql-toolbar button:hover,
        .ql-snow.ql-toolbar button.ql-active,
        .ql-snow .ql-toolbar button.ql-active {
          background: rgba(99, 102, 241, 0.1) !important;
          color: #6366f1 !important;
        }
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #6366f1 !important;
        }
        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #6366f1 !important;
        }
        
        .ql-snow .ql-stroke {
          stroke: var(--text-muted) !important;
        }
        .ql-snow .ql-fill {
          fill: var(--text-muted) !important;
        }
        .ql-snow .ql-picker {
            color: var(--text-muted) !important;
        }
        
        /* Headings and Typography */
        .ql-editor h1 { font-family: 'Outfit', sans-serif; font-size: 3rem; font-weight: 800; margin-bottom: 2rem; }
        .ql-editor h2 { font-family: 'Outfit', sans-serif; font-size: 2.25rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1.5rem; }
        .ql-editor h3 { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 1rem; }
      `}</style>
    </div>
  );
});

export default NoteEditor;
