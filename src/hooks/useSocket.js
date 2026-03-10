import { useSocketContext } from '../context/SocketContext';

/**
 * useSocket hook - wrapper around SocketContext
 */
export const useSocket = () => {
  return useSocketContext();
};
