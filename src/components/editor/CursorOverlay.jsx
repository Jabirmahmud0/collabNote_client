import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

/**
 * A single remote user's cursor.
 */
const LiveCursor = ({ user, quillEditor }) => {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!user.range || !quillEditor) {
      setPos(null);
      return;
    }

    const updatePosition = () => {
      try {
        // getBounds returns coordinates relative to the editor container
        const bounds = quillEditor.getBounds(user.range.index, user.range.length);
        if (bounds) {
          setPos({
            x: bounds.left,
            y: bounds.top,
            height: bounds.height || 18,
          });
        }
      } catch (e) {
        // Likely index out of range because content hasn't synced yet
        setPos(null);
      }
    };

    updatePosition();

    // Smooth update for rapid typing or window resizing
    const interval = setInterval(updatePosition, 100);
    return () => clearInterval(interval);
  }, [user.range, quillEditor]);

  if (!pos || !user.color) return null;

  const displayName = user.name || user.userName || 'Someone';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        zIndex: 5000,
        pointerEvents: 'none'
      }}
    >
      {/* Blinking caret */}
      <div
        style={{
          width: 2,
          height: pos.height,
          backgroundColor: user.color,
          boxShadow: `0 0 8px ${user.color}`,
          animation: 'cursorBlink 1s step-end infinite',
        }}
      />

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: -24, // Slightly higher to clear the caret
          left: 0,
          backgroundColor: user.color,
          color: 'white',
          fontSize: '11px',
          fontWeight: '700',
          padding: '2px 8px',
          borderRadius: '4px 4px 4px 0', // Nice speech bubble effect
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          fontFamily: 'Inter, sans-serif',
          zIndex: 5001,
        }}
      >
        {displayName}
      </div>
    </motion.div>
  );
};

const CursorOverlay = ({ quillRef, users }) => {
  const [editorInstance, setEditorInstance] = useState(null);
  const [containerEl, setContainerEl] = useState(null);
  const { user } = useAuth();

  // Initialize editor and container
  useEffect(() => {
    const timer = setInterval(() => {
      if (quillRef?.current) {
        const ed = quillRef.current.getEditor();
        if (ed && ed.container) {
          setEditorInstance(ed);
          setContainerEl(ed.container);
          ed.container.style.position = 'relative';
          clearInterval(timer);
        }
      }
    }, 100);
    return () => clearInterval(timer);
  }, [quillRef]);

  if (!containerEl || !editorInstance) return null;

  const myUserId = user?.id || user?._id;

  // Filter out local user and users without range
  const remoteCursors = users.filter(u => {
    const uid = u.userId || u.id;
    // Filter out local user
    if (myUserId && uid && String(uid).trim() === String(myUserId).trim()) {
      return false;
    }
    // Only show cursors that have a range (selection)
    return u.range && u.range.index !== null && u.range.index !== undefined;
  });

  return createPortal(
    <>
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      <div
        className="ql-cursors-overlay"
        contentEditable={false}
        suppressContentEditableWarning={true}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5000,
        }}
      >
        <AnimatePresence>
          {remoteCursors.map(c => (
            <LiveCursor
              key={c.socketId || c.userId}
              user={c}
              quillEditor={editorInstance}
            />
          ))}
        </AnimatePresence>
      </div>
    </>,
    containerEl
  );
};

export default CursorOverlay;
