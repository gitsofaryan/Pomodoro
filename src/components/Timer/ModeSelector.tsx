import { motion } from 'framer-motion';
import { useTimer, useSettings } from '../../contexts';
import { TimerMode, THEME_COLORS } from '../../types';

const modes: { id: TimerMode; label: string }[] = [
  { id: 'pomodoro', label: 'Pomodoro' },
  { id: 'shortBreak', label: 'Short Break' },
  { id: 'longBreak', label: 'Long Break' },
];

export function ModeSelector() {
  const { mode, setMode, isRunning } = useTimer();
  const { settings } = useSettings();

  const themeColor = THEME_COLORS[settings.theme].primary;

  const handleModeChange = (newMode: TimerMode) => {
    if (isRunning) {
      const confirmed = window.confirm(
        'Timer is running. Are you sure you want to switch modes?'
      );
      if (!confirmed) return;
    }
    setMode(newMode);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        padding: '6px',
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        borderRadius: '16px',
      }}
    >
      {modes.map(m => (
        <button
          key={m.id}
          type="button"
          onClick={() => handleModeChange(m.id)}
          style={{
            position: 'relative',
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderRadius: '12px',
            color: mode === m.id ? '#ffffff' : '#555555',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            outline: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          {mode === m.id && (
            <motion.div
              layoutId="activeMode"
              style={{
                position: 'absolute',
                inset: 0,
                background: `${themeColor}25`,
                borderRadius: '12px',
              }}
              transition={{ type: 'spring', duration: 0.3 }}
            />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>{m.label}</span>
        </button>
      ))}
    </div>
  );
}
