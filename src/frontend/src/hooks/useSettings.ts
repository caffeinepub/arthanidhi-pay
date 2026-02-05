import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useGetSettings, useUpdateSettings } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';
import { getBackendConfig } from '../backendClient';

export function useSettings() {
  const { identity } = useInternetIdentity();
  const { theme, setTheme } = useTheme();
  const { data: settings, isLoading } = useGetSettings();
  const updateSettingsMutation = useUpdateSettings();
  const config = getBackendConfig();

  const isAuthenticated = config.mode === 'rest' ? true : !!identity;

  // Sync backend settings with theme on load
  useEffect(() => {
    if (settings && isAuthenticated) {
      const backendTheme = settings.isDarkMode ? 'dark' : 'light';
      if (theme !== backendTheme) {
        setTheme(backendTheme);
      }
    }
  }, [settings, isAuthenticated, theme, setTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    if (isAuthenticated && settings) {
      try {
        await updateSettingsMutation.mutateAsync({
          ...settings,
          isDarkMode: newTheme === 'dark',
        });
      } catch (error) {
        // Silently handle errors in REST mode to avoid console noise
        if (config.mode === 'ic') {
          console.error('Failed to update theme setting:', error);
        }
      }
    }
  };

  return {
    theme,
    toggleTheme,
    isLoading,
    settings,
  };
}
