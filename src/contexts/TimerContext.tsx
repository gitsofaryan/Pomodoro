import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { TimerMode } from '../types';
import { useSettings } from './SettingsContext';
import { useStats } from './StatsContext';

// Create notification sounds using Web Audio API (no CORS issues)
const playNotificationSound = (type: 'start' | 'complete') => {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    if (type === 'start') {
      // Premium subtle "pop" - Apple-like haptic feedback
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Single clean tone, very subtle
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.type = 'sine';

      // Very quiet and extremely short
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.06);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.08);
    } else {
      // Bell-like sound for completion
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 chord

      frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';

        const startTime = audioContext.currentTime + (i * 0.08);
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.8);
      });
    }
  } catch (error) {
    console.log('Audio playback failed:', error);
  }
};

interface TimerContextType {
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  isPaused: boolean;
  pomodorosCompleted: number;
  currentTaskId: string | null;
  setCurrentTaskId: (id: string | null) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  adjustTime: (minutes: number) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const { addSession, updateStreak } = useStats();

  // Request notification permission
  useEffect(() => {
    if (settings.notifications && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.notifications]);

  const [mode, setModeState] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.timer.pomodoro * 60);
  const [totalTime, setTotalTime] = useState(settings.timer.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const getTimeForMode = useCallback((m: TimerMode) => {
    switch (m) {
      case 'pomodoro':
        return settings.timer.pomodoro * 60;
      case 'shortBreak':
        return settings.timer.shortBreak * 60;
      case 'longBreak':
        return settings.timer.longBreak * 60;
    }
  }, [settings.timer]);

  const setMode = useCallback((newMode: TimerMode) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setModeState(newMode);
    const newTime = getTimeForMode(newMode);
    setTimeLeft(newTime);
    setTotalTime(newTime);
    setIsRunning(false);
    setIsPaused(false);
  }, [getTimeForMode]);

  const playAlarm = useCallback((prevMode: TimerMode) => {
    // Play completion sound
    playNotificationSound('complete');

    // Send browser notification
    if (settings.notifications && 'Notification' in window && Notification.permission === 'granted') {
      const title = prevMode === 'pomodoro' ? '🎉 Pomodoro Completed!' : '☕ Break Completed!';
      const body = prevMode === 'pomodoro'
        ? 'Great work! Time for a break.'
        : 'Break finished. Ready to focus?';

      new Notification(title, {
        body: body,
        icon: '/favicon.ico',
        tag: 'pomodoro-timer',
        requireInteraction: false,
      });
    }
  }, [settings.notifications]);

  const handleTimerComplete = useCallback(() => {
    playAlarm(mode);

    if (mode === 'pomodoro') {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);

      // Add session to stats
      addSession({
        id: Date.now().toString(),
        mode: 'pomodoro',
        duration: settings.timer.pomodoro,
        completedAt: new Date(),
        taskId: currentTaskId || undefined,
      });
      updateStreak();

      // Determine next mode
      const shouldTakeLongBreak = newCount % settings.timer.longBreakInterval === 0;
      const nextMode = shouldTakeLongBreak ? 'longBreak' : 'shortBreak';

      if (settings.timer.autoStartBreaks) {
        setMode(nextMode);
        setTimeout(() => start(), 100);
      } else {
        setMode(nextMode);
      }
    } else {
      // Break completed
      if (settings.timer.autoStartPomodoros) {
        setMode('pomodoro');
        setTimeout(() => start(), 100);
      } else {
        setMode('pomodoro');
      }
    }
  }, [mode, pomodorosCompleted, settings, addSession, updateStreak, currentTaskId, setMode, playAlarm]);

  const start = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Play start sound
    playNotificationSound('start');

    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsRunning(false);
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleTimerComplete]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPaused(true);
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    start();
  }, [start]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const newTime = getTimeForMode(mode);
    setTimeLeft(newTime);
    setTotalTime(newTime);
    setIsRunning(false);
    setIsPaused(false);
  }, [mode, getTimeForMode]);

  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setIsPaused(false);

    if (mode === 'pomodoro') {
      const shouldTakeLongBreak = (pomodorosCompleted + 1) % settings.timer.longBreakInterval === 0;
      setMode(shouldTakeLongBreak ? 'longBreak' : 'shortBreak');
    } else {
      setMode('pomodoro');
    }
  }, [mode, pomodorosCompleted, settings.timer.longBreakInterval, setMode]);

  const adjustTime = useCallback((minutes: number) => {
    if (isRunning) return; // Only adjust when not running

    setTimeLeft(prev => {
      const currentMinutes = Math.round(prev / 60);
      const newMinutes = currentMinutes + minutes;

      // Define allowed time values in minutes
      const allowedValues = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 90, 120];

      // Find closest allowed value
      let closestValue = allowedValues[0];
      let minDiff = Math.abs(newMinutes - closestValue);

      for (const value of allowedValues) {
        const diff = Math.abs(newMinutes - value);
        if (diff < minDiff) {
          minDiff = diff;
          closestValue = value;
        }
      }

      // If we're already at an allowed value and moving away, go to next/prev allowed value
      if (allowedValues.includes(currentMinutes)) {
        const currentIndex = allowedValues.indexOf(currentMinutes);
        if (minutes > 0 && currentIndex < allowedValues.length - 1) {
          closestValue = allowedValues[currentIndex + 1];
        } else if (minutes < 0 && currentIndex > 0) {
          closestValue = allowedValues[currentIndex - 1];
        }
      }

      const newTime = closestValue * 60;
      setTotalTime(newTime);
      return newTime;
    });
  }, [isRunning]);

  // Update time when settings change
  useEffect(() => {
    if (!isRunning && !isPaused) {
      const newTime = getTimeForMode(mode);
      setTimeLeft(newTime);
      setTotalTime(newTime);
    }
  }, [settings.timer, mode, isRunning, isPaused, getTimeForMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Request notification permission
  useEffect(() => {
    if (settings.notifications && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.notifications]);

  return (
    <TimerContext.Provider
      value={{
        mode,
        setMode,
        timeLeft,
        totalTime,
        isRunning,
        isPaused,
        pomodorosCompleted,
        currentTaskId,
        setCurrentTaskId,
        start,
        pause,
        resume,
        reset,
        skip,
        adjustTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
