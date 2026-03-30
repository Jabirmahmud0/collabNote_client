import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  // Keep a ref to myId so socket event closures always see the latest value
  const myIdRef = useRef(null);

  useEffect(() => {
    const id = user?.id || user?._id;
    myIdRef.current = id ? String(id) : null;
  }, [user]);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      secure: window.location.protocol === 'https:',
    });

    newSocket.on('connect', () => {
      setConnected(true);

      // Register this user globally so server can send us targeted events
      // (e.g., note-shared notifications)
      newSocket.emit('register-user', { userId: user.id });
    });


    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('new-notification', (notification) => {
    });

    newSocket.on('room-users', (roomUsers) => {
      const seen = new Map();
      for (const u of roomUsers) {
        const uid = u.userId || u.id;
        const key = u.socketId || String(uid).trim();
        if (!seen.has(key)) seen.set(key, u);
      }
      setUsers(Array.from(seen.values()));
    });

    newSocket.on('user-joined', (userData) => {
      setUsers((prev) => {
        // Filter out any stale entries for this user
        const filtered = prev.filter(
          (u) => u.socketId !== userData.socketId && String(u.userId || u.id).trim() !== String(userData.userId || userData.id).trim()
        );
        return [...filtered, { ...userData, range: null }];
      });
    });

    newSocket.on('cursor-update', (data) => {
      const { userId, socketId, range, color, name } = data;
      const uid = userId || data.id;

      setUsers((prev) => {
        // Try to find existing user by socketId
        const idx = prev.findIndex((u) => u.socketId === socketId);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], range, color, userName: name || next[idx].userName };
          return next;
        }

        // Try to find by userId (for cases where socketId changed)
        const uidIdx = prev.findIndex((u) => {
          const u_uid = u.userId || u.id;
          return uid && u_uid && String(u_uid).trim() === String(uid).trim();
        });

        if (uidIdx !== -1) {
          const next = [...prev];
          next[uidIdx] = { ...next[uidIdx], socketId, range, color, userName: name || next[uidIdx].userName };
          return next;
        }

        // User not found, add them (they might have joined before we started tracking)
        return [...prev, {
          userId: uid,
          socketId,
          range,
          color,
          userName: name || 'Anonymous',
        }];
      });
    });

    newSocket.on('user-left', ({ socketId }) => {
      setUsers((prev) => prev.filter((u) => u.socketId !== socketId));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const joinRoom = (noteId) => {
    if (!socket || !user) return;
    // Clear stale presence from any previous room before joining new one
    setUsers([]);
    socket.emit('join-room', {
      noteId,
      userId: user.id || user._id,
      userName: user.name,
      userColor: getRandomColor(),
    });
  };

  const leaveRoom = (noteId) => {
    if (!socket) return;

    socket.emit('leave-room', {
      noteId,
      userId: user?.id || user?._id, // Add fallback
    });
    setUsers([]);
  };

  const sendNoteChange = (noteId, delta) => {
    if (!socket) return;

    socket.emit('note-change', {
      noteId,
      delta,
      userId: user?.id || user?._id, // Add fallback
    });
  };

  const sendCursorMove = (noteId, range) => {
    if (!socket) return;
    socket.emit('cursor-move', {
      noteId,
      userId: user?.id || user?._id, // Add fallback
      range,
      userName: user?.name,
    });
  };

  const sendTyping = (noteId) => {
    if (!socket) return;

    socket.emit('user-typing', {
      noteId,
      userId: user?.id || user?._id, // Add fallback
      userName: user?.name,
    });
  };

  const sendStopTyping = (noteId) => {
    if (!socket) return;

    socket.emit('user-stop-typing', {
      noteId,
      userId: user?.id || user?._id, // Add fallback
    });
  };

  /**
   * Listen for real-time notifications
   */
  const onNotification = useCallback((callback) => {
    if (!socket) return () => {};
    socket.on('new-notification', callback);
    return () => socket.off('new-notification', callback);
  }, [socket]);

  /**
   * Listen for response to our invitations
   */
  const onInviteResponse = useCallback((callback) => {
    if (!socket) return () => {};
    socket.on('invite-response', callback);
    return () => socket.off('invite-response', callback);
  }, [socket]);

  /**
   * Subscribe to note-shared events.
   * The callback will receive { note } when the current user is added as a collaborator.
   * Returns an unsubscribe function.
   */
  const onNoteShared = useCallback(
    (callback) => {
      if (!socket) return () => {};
      socket.on('note-shared', callback);
      return () => socket.off('note-shared', callback);
    },
    [socket]
  );

  const value = {
    socket,
    connected,
    users,
    joinRoom,
    leaveRoom,
    sendNoteChange,
    sendCursorMove,
    sendTyping,
    sendStopTyping,
    onNoteShared,
    onNotification,
    onInviteResponse,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

function getRandomColor() {
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#22C55E',
    '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
