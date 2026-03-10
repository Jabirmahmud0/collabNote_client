import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Decode token to get user info (simple JWT decode)
      const decoded = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        // Token expired, try to refresh
        await refreshAccessToken();
        return;
      }

      // Token is valid, set user
      setUser({
        id: decoded.id,
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        avatar: localStorage.getItem('userAvatar') || '',
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      const response = await api.post('/api/auth/refresh', { refreshToken });
      const { accessToken } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      
      // Update user state directly with new token info
      const decoded = JSON.parse(atob(accessToken.split('.')[1]));
      setUser({
        id: decoded.id,
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        avatar: localStorage.getItem('userAvatar') || '',
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    // Clear any existing tokens before registering
    localStorage.clear();
    
    const response = await api.post('/api/auth/register', {
      name,
      email,
      password,
    });

    const { user, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userAvatar', user.avatar || '');

    setUser(user);
    return response.data;
  };

  const login = async (email, password) => {
    // Clear any existing tokens before logging in
    localStorage.clear();
    
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });

    const { user, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userAvatar', user.avatar || '');

    setUser(user);
    return response.data;
  };

  const loginWithGoogle = async (name, email, googleId, avatar) => {
    // Clear any existing tokens before Google login
    localStorage.clear();
    
    const response = await api.post('/api/auth/google', {
      name,
      email,
      googleId,
      avatar
    });

    const { user: authUser, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userName', authUser.name);
    localStorage.setItem('userEmail', authUser.email);
    localStorage.setItem('userAvatar', authUser.avatar || '');

    setUser(authUser);
    return response.data;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/api/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userAvatar');
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
    localStorage.setItem('userName', updatedUser.name || prev.name);
    localStorage.setItem('userAvatar', updatedUser.avatar || prev.avatar);
  };

  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
