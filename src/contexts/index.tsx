import { ReactNode } from 'react';
import { SettingsProvider } from './SettingsContext';
import { StatsProvider } from './StatsContext';
import { TasksProvider } from './TasksContext';
import { TimerProvider } from './TimerContext';
import { AuthProvider } from './AuthContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <StatsProvider>
          <TasksProvider>
            <TimerProvider>{children}</TimerProvider>
          </TasksProvider>
        </StatsProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export * from './SettingsContext';
export * from './StatsContext';
export * from './TasksContext';
export * from './TimerContext';
export * from './AuthContext';
