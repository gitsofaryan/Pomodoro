import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useTimer, useSettings } from '../../contexts';
import { THEME_COLORS } from '../../types';

export function TimerControls() {
  const { isRunning, isPaused, start, pause, resume, reset, skip } = useTimer();
  const { settings } = useSettings();

  const themeColor = THEME_COLORS[settings.theme].primary;

  const handleMainButton = () => {
    if (isRunning) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      start();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      {/* Reset - Hidden when running */}
      {!isRunning && (
        <button
          type="button"
          onClick={reset}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'transparent',
            border: '1px solid #222222',
            borderRadius: '50%',
            color: '#555555',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#444444';
            e.currentTarget.style.color = '#888888';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#222222';
            e.currentTarget.style.color = '#555555';
          }}
        >
          <RotateCcw size={18} />
        </button>
      )}

      {/* Main Button */}
      <button
        type="button"
        onClick={handleMainButton}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: isRunning ? '16px 40px' : '14px 36px',
          background: isRunning ? 'transparent' : themeColor,
          border: isRunning ? `1px solid ${themeColor}` : 'none',
          borderRadius: '50px',
          color: isRunning ? themeColor : '#000000',
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '0.05em',
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {isRunning ? (
          <>
            <Pause size={18} />
            <span>PAUSE</span>
          </>
        ) : (
          <>
            <Play size={18} />
            <span>{isPaused ? 'RESUME' : 'START'}</span>
          </>
        )}
      </button>

      {/* Skip - Hidden when running */}
      {!isRunning && (
        <button
          type="button"
          onClick={skip}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'transparent',
            border: '1px solid #222222',
            borderRadius: '50%',
            color: '#555555',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#444444';
            e.currentTarget.style.color = '#888888';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#222222';
            e.currentTarget.style.color = '#555555';
          }}
        >
          <SkipForward size={18} />
        </button>
      )}
    </div>
  );
}
