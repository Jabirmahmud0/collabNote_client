import { useAuthContext } from '../context/AuthContext';

/**
 * useAuth hook - wrapper around AuthContext
 * @returns {object} Auth context value
 */
export const useAuth = () => {
  return useAuthContext();
};
