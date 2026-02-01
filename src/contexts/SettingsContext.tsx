import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateTimerSettings: (newSettings: Partial<AppSettings['timer']>) => void;
  updateSoundSettings: (newSettings: Partial<AppSettings['sound']>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'pomodoro-settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Load settings from Supabase when user logs in
  useEffect(() => {
    if (!user || !supabase) return;

    const loadSettings = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If not found, create it with current local settings
        if (error.code === 'PGRST116') {
          saveSettingsToSupabase(settings);
        }
        return;
      }

      if (data && data.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      }
    };

    loadSettings();
  }, [user]);

  // Save to localStorage whenever settings change (backup/offline)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Save to Supabase
  const saveSettingsToSupabase = async (newSettings: AppSettings) => {
    if (!user || !supabase) return;

    await supabase.from('user_settings').upsert({
      user_id: user.id,
      settings: newSettings,
      updated_at: new Date().toISOString(),
    });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (user) saveSettingsToSupabase(updated);
      return updated;
    });
  };

  const updateTimerSettings = (newSettings: Partial<AppSettings['timer']>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        timer: { ...prev.timer, ...newSettings },
      };
      if (user) saveSettingsToSupabase(updated);
      return updated;
    });
  };

  const updateSoundSettings = (newSettings: Partial<AppSettings['sound']>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        sound: { ...prev.sound, ...newSettings },
      };
      if (user) saveSettingsToSupabase(updated);
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    if (user) saveSettingsToSupabase(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateTimerSettings,
        updateSoundSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
