import { useThemeContext } from '../context/ThemeContext';

/**
 * useTheme hook - wrapper around ThemeContext
 */
export const useTheme = () => {
  return useThemeContext();
};
