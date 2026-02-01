import { useState, useEffect, useCallback } from 'react';
import { AppProviders, useTimer } from './contexts';
import { Timer } from './components/Timer';
import { Header } from './components/Header';
import { SettingsModal } from './components/Settings/SettingsModal';
import { StatsModal } from './components/Stats/StatsModal';
import { AuthModal } from './components/Auth/AuthModal';
import { TaskPanel } from './components/Tasks/TaskPanel';
import { AmbientSoundProvider } from './contexts/AmbientSoundContext';
import { AmbientSoundPanel } from './components/AmbientSound/AmbientSoundPanel';

function AppContent() {
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showAmbient, setShowAmbient] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const { isRunning, isPaused, start, pause, resume, reset, skip, mode, timeLeft, setMode, adjustTime } = useTimer();

  // Update document title with timer
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const modeStr = mode === 'pomodoro' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break';

    if (isRunning || isPaused) {
      document.title = `${timeStr} - ${modeStr} | Pomodoro`;
    } else {
      document.title = 'Pomodoro - Focus Timer';
    }
  }, [timeLeft, mode, isRunning, isPaused]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        if (isRunning) {
          pause();
        } else if (isPaused) {
          resume();
        } else {
          start();
        }
        break;
      case 'KeyR':
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          reset();
        }
        break;
      case 'KeyS':
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          skip();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        adjustTime(5); // Increase by 5 minutes
        break;
      case 'ArrowDown':
        e.preventDefault();
        adjustTime(-5); // Decrease by 5 minutes
        break;
      case 'ArrowRight':
        e.preventDefault();
        // Cycle forward: pomodoro -> shortBreak -> longBreak
        if (mode === 'pomodoro') {
          setMode('shortBreak');
        } else if (mode === 'shortBreak') {
          setMode('longBreak');
        } else {
          setMode('pomodoro');
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        // Cycle backward: pomodoro -> longBreak -> shortBreak
        if (mode === 'pomodoro') {
          setMode('longBreak');
        } else if (mode === 'longBreak') {
          setMode('shortBreak');
        } else {
          setMode('pomodoro');
        }
        break;
      case 'KeyF':
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setIsFocusMode(prev => !prev);
        }
        break;
    }
  }, [isRunning, isPaused, start, pause, resume, reset, skip, mode, setMode, adjustTime]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{ minHeight: '100vh', background: '#000000' }}>
      {!isFocusMode && (
        <Header
          onOpenSettings={() => setShowSettings(true)}
          onOpenStats={() => setShowStats(true)}
          onOpenAuth={() => setShowAuth(true)}
          onOpenTasks={() => setShowTasks(true)}
          onOpenAmbient={() => setShowAmbient(true)}
        />
      )}

      <Timer isFocusMode={isFocusMode} />

      {/* All Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <TaskPanel isOpen={showTasks} onClose={() => setShowTasks(false)} />
      <AmbientSoundPanel isOpen={showAmbient} onClose={() => setShowAmbient(false)} />
    </div>
  );
}

function App() {
  return (
    <AppProviders>
      <AmbientSoundProvider>
        <AppContent />
      </AmbientSoundProvider>
    </AppProviders>
  );
}

export default App;
