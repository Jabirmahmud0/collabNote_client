import React, { useEffect, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSocketContext } from '../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

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
          top: -22,
          left: 0,
          backgroundColor: user.color,
          color: 'white',
          fontSize: '11px',
          fontWeight: '700',
          padding: '2px 8px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {displayName}
      </div>
    </motion.div>
  );
};

const CursorOverlay = ({ quillRef, users }) => {
  const { socket } = useSocketContext();
  const [cursors, setCursors] = useState({});
  const [editorInstance, setEditorInstance] = useState(null);
  const [containerEl, setContainerEl] = useState(null);

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

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    const onCursorUpdate = (data) => {
      const { userId, range, color, name } = data;
      if (!userId) return;

      if (!range) {
        setCursors(prev => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      } else {
        setCursors(prev => ({
          ...prev,
          [userId]: { userId, range, color, name }
        }));
      }
    };

    socket.on('cursor-update', onCursorUpdate);
    return () => socket.off('cursor-update', onCursorUpdate);
  }, [socket]);

  // Sync with active users list and initialize from props
  useEffect(() => {
    const activeUserIds = new Set(users.map(u => u.userId));
    
    setCursors(prev => {
      const next = { ...prev };
      let changed = false;

      // Add/Update from users prop
      users.forEach(u => {
        if (u.userId !== socket?.id && u.range) { // Skip self
          if (!next[u.userId] || JSON.stringify(next[u.userId].range) !== JSON.stringify(u.range)) {
            next[u.userId] = { 
              userId: u.userId, 
              range: u.range, 
              color: u.color, 
              name: u.userName || u.name 
            };
            changed = true;
          }
        }
      });

      // Remove inactive
      for (const id in next) {
        if (!activeUserIds.has(id)) {
          delete next[id];
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [users, socket]);

  if (!containerEl || !editorInstance) return null;

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
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 5000,
          overflow: 'hidden'
        }}
      >
        <AnimatePresence>
          {Object.values(cursors).map(c => (
            <LiveCursor key={c.userId} user={c} quillEditor={editorInstance} />
          ))}
        </AnimatePresence>
      </div>
    </>,
    containerEl
  );
};

export default CursorOverlay;
