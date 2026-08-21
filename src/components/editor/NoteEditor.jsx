import React, { useCallback, useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './NoteEditor.css';
import CursorOverlay from './CursorOverlay';

const TOOL_TITLES = {
  '.ql-header': 'Text style', '.ql-bold': 'Bold (Ctrl+B)',
  '.ql-italic': 'Italic (Ctrl+I)', '.ql-underline': 'Underline (Ctrl+U)',
  '.ql-strike': 'Strikethrough', '.ql-blockquote': 'Block quote',
  '.ql-list[value=ordered]': 'Numbered list', '.ql-list[value=bullet]': 'Bulleted list',
  '.ql-color': 'Text color', '.ql-background': 'Highlight color',
  '.ql-align': 'Alignment', '.ql-link': 'Insert link',
  '.ql-image': 'Insert image from URL', '.ql-code-block': 'Code block',
  '.ql-clean': 'Clear formatting', '.ql-undo': 'Undo (Ctrl+Z)',
  '.ql-redo': 'Redo (Ctrl+Shift+Z)',
};

const NoteEditor = forwardRef(({ content, onChange, onSelectionChange, readOnly = false, users }, ref) => {
  const quillRef = useRef(null);

  // Expose quill editor to parent
  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current?.getEditor(),
    container: quillRef.current?.container,
  }));

  // Note: selection changes are handled exclusively via onChangeSelection prop below.
  // Do NOT add a direct editor.on('selection-change') listener here — it would
  // fire twice per user action and send duplicate cursor-move socket events.

  const modules = useMemo(() => ({
    toolbar: readOnly ? false : {
      container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image', 'code-block'],
      ['undo', 'redo'],
      ['clean'],
      ],
      handlers: {
        undo() { this.quill.history.undo(); },
        redo() { this.quill.history.redo(); },
        image() {
          const range = this.quill.getSelection(true);
          const url = window.prompt('Paste an image URL');
          if (!url || !/^https?:\/\//i.test(url)) return;
          this.quill.insertEmbed(range.index, 'image', url, 'user');
          this.quill.setSelection(range.index + 1, 0, 'silent');
        },
      },
    },
    history: { delay: 800, maxStack: 150, userOnly: true },
  }), [readOnly]);

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'color',
    'background',
    'align',
    'link',
    'image',
    'code-block',
  ];

  useEffect(() => {
    const toolbar = quillRef.current?.getEditor()?.getModule('toolbar')?.container;
    if (!toolbar) return;
    Object.entries(TOOL_TITLES).forEach(([selector, title]) => {
      toolbar.querySelectorAll(selector).forEach((control) => {
        control.setAttribute('title', title);
        control.setAttribute('aria-label', title);
      });
    });
  }, []);

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

  const handleSelectionChange = useCallback((range, source) => {
    if (onSelectionChange) {
      onSelectionChange(range, source);
    }
  }, [onSelectionChange]);

  const handleFocus = useCallback((_, __, editor) => {
    if (editor.getLength() <= 1 && editor.getText().trim() === '') {
      // Use the normal user-change path so the reset is saved and synced like any toolbar action.
      editor.removeFormat(0, 1, 'user');
      editor.setSelection(0, 0, 'silent');
    }
  }, []);

  return (
    <div className="note-editor-shell h-full flex flex-col relative">
      {/* The outer wrapper must be position:relative so the CursorOverlay's
          absolute inset-0 is correctly bounded to the editor area */}
      <div className="note-editor-stage relative flex-1 flex flex-col" style={{ position: 'relative' }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleTextChange}
          onChangeSelection={handleSelectionChange}
          onFocus={handleFocus}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
          placeholder="Start writing here..."
          className="note-editor flex-1"
          style={{ flex: 1 }}
        />
        {/* CursorOverlay sits over the entire editor area */}
        <CursorOverlay quillRef={quillRef} users={users || []} />
      </div>
    </div>
  );
});

NoteEditor.displayName = 'NoteEditor';

export default NoteEditor;
