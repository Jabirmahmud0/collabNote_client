import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
      console.log('Socket connected:', newSocket.id);
      setConnected(true);

      // Register this user globally so server can send us targeted events
      // (e.g., note-shared notifications)
      console.log('[SOCKET] Registering user:', user.id);
      newSocket.emit('register-user', { userId: user.id });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('new-notification', (notification) => {
      console.log('[SOCKET] Received new-notification event:', notification);
    });

    newSocket.on('room-users', (users) => {
      setUsers(users);
    });

    newSocket.on('user-joined', ({ userId, userName, color }) => {
      console.log(`${userName} joined`);
      setUsers((prev) => [
        ...prev.filter((u) => u.userId !== userId), // avoid duplicates
        { userId, userName, color },
      ]);
    });

    newSocket.on('user-left', ({ userId }) => {
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const joinRoom = (noteId) => {
    if (!socket || !user) return;

    socket.emit('join-room', {
      noteId,
      userId: user.id,
      userName: user.name,
      userColor: getRandomColor(),
    });
  };

  const leaveRoom = (noteId) => {
    if (!socket) return;

    socket.emit('leave-room', {
      noteId,
      userId: user?.id,
    });
    setUsers([]);
  };

  const sendNoteChange = (noteId, delta) => {
    if (!socket) return;

    socket.emit('note-change', {
      noteId,
      delta,
      userId: user?.id,
    });
  };

  const sendCursorMove = (noteId, range) => {
    if (!socket) return;

    socket.emit('cursor-move', {
      noteId,
      userId: user?.id,
      range,
      userName: user?.name,
    });
  };

  const sendTyping = (noteId) => {
    if (!socket) return;

    socket.emit('user-typing', {
      noteId,
      userId: user?.id,
      userName: user?.name,
    });
  };

  const sendStopTyping = (noteId) => {
    if (!socket) return;

    socket.emit('user-stop-typing', {
      noteId,
      userId: user?.id,
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
