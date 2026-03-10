import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

const LiveCursor = ({ user, quillEditor }) => {
  const [position, setPosition] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    if (!user.range || !quillEditor) {
      setPosition(prev => ({ ...prev, visible: false }));
      return;
    }

    try {
      const bounds = quillEditor.getBounds(user.range.index, user.range.length);
      if (bounds) {
        setPosition({
          x: bounds.left,
          y: bounds.top,
          visible: true,
        });
      }
    } catch (error) {
      console.error('Error getting cursor position:', error);
      setPosition(prev => ({ ...prev, visible: false }));
    }
  }, [user.range, quillEditor]);

  if (!position.visible || !user.color) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Cursor */}
      <svg
        width="11"
        height="20"
        viewBox="0 0 11 20"
        fill="none"
        style={{
          filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2))',
        }}
      >
        <path
          d="M1.5 0L9.5 0L5.5 14.5L3.5 14.5L1.5 20L0 19L1.5 15.5L1.5 0Z"
          fill={user.color}
        />
      </svg>
      
      {/* Username label */}
      <div
        className="ml-3 px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap"
        style={{
          backgroundColor: user.color,
        }}
      >
        {user.userName}
      </div>
    </motion.div>
  );
};

const CursorOverlay = ({ quillRef, users }) => {
  const { socket } = useSocketContext();
  const [cursors, setCursors] = useState({});
  const [editorInstance, setEditorInstance] = useState(null);

  // Get editor instance from ref
  useEffect(() => {
    if (quillRef?.current) {
      const editor = quillRef.current.getEditor?.();
      if (editor) {
        setEditorInstance(editor);
      }
    }
    
    // Also check periodically in case ref isn't ready
    const checkInterval = setInterval(() => {
      if (quillRef?.current && !editorInstance) {
        const ed = quillRef.current.getEditor?.();
        if (ed) setEditorInstance(ed);
      }
    }, 100);
    
    return () => clearInterval(checkInterval);
  }, [quillRef]);

  useEffect(() => {
    if (!socket) return;

    const handleCursorUpdate = ({ userId, range, color, name }) => {
      if (!userId || !range) return;
      
      setCursors((prev) => ({
        ...prev,
        [userId]: { userId, range, color, userName: name || 'Anonymous' },
      }));
    };

    socket.on('cursor-update', handleCursorUpdate);

    return () => {
      socket.off('cursor-update', handleCursorUpdate);
      setCursors({});
    };
  }, [socket]);

  // Remove cursor when user leaves
  useEffect(() => {
    const currentUserIds = users.map((u) => u.userId);
    setCursors((prev) => {
      const filtered = {};
      Object.keys(prev).forEach((key) => {
        if (currentUserIds.includes(key)) {
          filtered[key] = prev[key];
        }
      });
      return filtered;
    });
  }, [users]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
      <AnimatePresence>
        {Object.values(cursors).map((cursor) => (
          <LiveCursor
            key={cursor.userId}
            user={cursor}
            quillEditor={editorInstance}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CursorOverlay;
