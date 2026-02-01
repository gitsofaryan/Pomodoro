import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { ModeSelector } from './ModeSelector';
import { useTimer, useSettings, useStats, useTasks } from '../../contexts';
import { THEME_COLORS } from '../../types';

interface TimerProps {
  isFocusMode?: boolean;
}

export function Timer({ isFocusMode = false }: TimerProps) {
  const { pomodorosCompleted, isRunning, timeLeft, totalTime, currentTaskId } = useTimer();
  const { settings } = useSettings();
  const { todayStats } = useStats();
  const { tasks } = useTasks();

  const goalProgress = Math.min((todayStats.totalPomodoros / settings.dailyGoal) * 100, 100);
  const timerProgress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const themeColor = THEME_COLORS[settings.theme].primary;
  const currentTask = tasks.find(t => t.id === currentTaskId);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh', // Modern mobile viewport height
        width: '100%',
        overflow: 'hidden',
        padding: isFocusMode ? '20px' : '80px 20px 40px 20px', // Responsive padding handled via style here roughly, refined with class
        background: '#000000',
        boxSizing: 'border-box',
      }}
      className="responsive-padding"
    >
      {/* Mode Selector - Hidden in focus mode */}
      {!isFocusMode && (
        <div
          style={{
            minHeight: '60px',
            opacity: isRunning ? 0 : 1,
            transition: 'opacity 0.4s ease',
            pointerEvents: isRunning ? 'none' : 'auto',
          }}
        >
          <ModeSelector />
        </div>
      )}

      {/* Current Task Indicator - MOVED TO TOP */}
      {currentTask && (
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: `1px solid ${currentTask.color}40`,
            maxWidth: '100%', // Ensure it doesn't overflow
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: currentTask.color,
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#888888', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Working on: <span style={{ color: '#ffffff', fontWeight: 500 }}>{currentTask.title}</span>
          </span>
        </div>
      )}

      {/* Spacer */}
      <div style={{ height: '32px' }} />

      {/* Timer Display */}
      <TimerDisplay isFocusMode={isFocusMode} />

      {/* Spacer before controls */}
      <div style={{ height: isRunning ? '48px' : '24px', transition: 'height 0.3s ease' }} />

      {/* Progress Bar - Above controls when running */}
      {isRunning && (
        <div
          style={{
            width: '280px',
            maxWidth: '100%', // Responsive width
            height: '2px',
            background: '#1a1a1a',
            borderRadius: '1px',
            overflow: 'hidden',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${timerProgress}%`,
              background: themeColor,
              borderRadius: '1px',
              transition: 'width 0.3s linear',
            }}
          />
        </div>
      )}

      {/* Controls */}
      <TimerControls />


      {/* Bottom Info - Always reserve space */}
      <div
        style={{
          minHeight: '100px',
          opacity: isRunning ? 0 : 1,
          transition: 'opacity 0.4s ease',
          marginTop: '48px',
          pointerEvents: isRunning ? 'none' : 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Progress */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{ color: '#444444', fontSize: '13px' }}>
              Today: {todayStats.totalPomodoros}/{settings.dailyGoal}
            </span>
            <div
              style={{
                width: '100px',
                height: '3px',
                background: '#1a1a1a',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${goalProgress}%`,
                  background: '#ffffff',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Session */}
          <span style={{ color: '#333333', fontSize: '12px' }}>
            Session #{pomodorosCompleted + 1}
          </span>
        </div>
      </div>

      {/* Keyboard hint */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          color: '#666666',
          fontSize: '12px',
          letterSpacing: '0.05em',
          opacity: 0.6,
        }}
        className="hide-keyboard-hints"
      >
        SPACE start/pause • R reset • S skip • F focus • ↑↓ adjust time • ←→ change mode
      </div>
    </div>
  );
}

export { TimerDisplay } from './TimerDisplay';
export { TimerControls } from './TimerControls';
export { ModeSelector } from './ModeSelector';
