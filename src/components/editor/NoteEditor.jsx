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
      // Get the full document state
      const fullContent = editor.getContents();

      if (onChange) {
        onChange(fullContent);
      }
    }
  }, [onChange]);

  const handleSelectionChange = useCallback((range, source, editor) => {
    if (onSelectionChange) {
      onSelectionChange(range, source);
    }
  }, [onSelectionChange]);

  return (
    <div className="h-full flex flex-col relative">
      <div className="relative flex-1 flex flex-col">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleTextChange}
          onSelectionChange={handleSelectionChange}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
          className="flex-1"
          style={{ flex: 1 }}
        />
        {/* Cursor Overlay */}
        <CursorOverlay quillRef={quillRef} users={users || []} />
      </div>
      
      <style>{`
        .quill {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .quill .ql-container {
          flex: 1;
          overflow: auto;
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          line-height: 1.8;
          background: transparent;
          border: none !important;
        }
        .quill .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          background: rgba(15, 23, 42, 0.8) !important;
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 20;
          padding: 1rem 2rem !important;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .quill .ql-editor {
          color: var(--text-primary);
          padding: 4rem max(2rem, calc((100% - 800px) / 2)) !important;
          min-height: 100%;
          outline: none;
        }
        .quill .ql-editor.ql-blank::before {
          color: var(--text-secondary);
          opacity: 0.3;
          left: max(2rem, calc((100% - 800px) / 2)) !important;
          padding: 4rem 0 !important;
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
          stroke: rgba(255, 255, 255, 0.5) !important;
        }
        .ql-snow .ql-fill {
          fill: rgba(255, 255, 255, 0.5) !important;
        }
        .ql-snow .ql-picker {
            color: rgba(255, 255, 255, 0.5) !important;
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
