import { useEffect } from 'react';
import { useTimer } from '../contexts';

export function useKeyboardShortcuts() {
  const { isRunning, isPaused, start, pause, resume, reset, skip } = useTimer();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
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
        case 'Escape':
          if (isRunning) {
            pause();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isPaused, start, pause, resume, reset, skip]);
}
