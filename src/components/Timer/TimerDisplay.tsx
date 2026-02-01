import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useTimer, useSettings } from '../../contexts';
import { QUOTES } from '../../types';

interface TimerDisplayProps {
  isFocusMode?: boolean;
}

export function TimerDisplay({ isFocusMode = false }: TimerDisplayProps) {
  const { timeLeft, isRunning, mode, adjustTime, totalTime } = useTimer();
  const { settings } = useSettings();

  // Pick quote once when mode changes, not on every render
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));

  // Change quote when reset is pressed (timeLeft jumps to totalTime)
  useEffect(() => {
    if (timeLeft === totalTime && !isRunning) {
      setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
    }
  }, [timeLeft, totalTime, isRunning]);

  // Also change quote when mode changes
  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
  }, [mode]);

  const quote = useMemo(() => QUOTES[quoteIndex], [quoteIndex]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const minuteStr = String(minutes).padStart(2, '0');
  const secondStr = String(seconds).padStart(2, '0');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Fixed-width wrapper to prevent button jumping */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px', // Increased from 600px to prevent button overlap on desktop
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* -5 min button (left side) - ABSOLUTE POSITIONED */}
        <button
          type="button"
          onClick={() => adjustTime(-5)}
          style={{
            position: 'absolute',
            left: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            color: '#666666',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s ease',
            opacity: isRunning ? 0 : 1,
            pointerEvents: isRunning ? 'none' : 'auto',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = '#888888';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#666666';
          }}
          title="-5 minutes"
        >
          <Minus size={20} />
        </button>

        {/* Timer Numbers - Centered */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            fontWeight: 100,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            userSelect: 'none',
            fontSize: isRunning ? 'clamp(140px, 28vw, 280px)' : 'clamp(100px, 18vw, 160px)',
            transition: 'font-size 0.5s ease',
          }}
        >
          <span>{minuteStr}</span>
          <motion.span
            style={{ margin: '0 0.05em', color: '#333333' }}
            animate={{ opacity: isRunning ? [1, 0.3, 1] : 0.5 }}
            transition={{ duration: 1, repeat: isRunning ? Infinity : 0, ease: 'easeInOut' }}
          >
            :
          </motion.span>
          <span>{secondStr}</span>
        </div>

        {/* +5 min button (right side) - ABSOLUTE POSITIONED */}
        <button
          type="button"
          onClick={() => adjustTime(5)}
          style={{
            position: 'absolute',
            right: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            color: '#666666',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s ease',
            opacity: isRunning ? 0 : 1,
            pointerEvents: isRunning ? 'none' : 'auto',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = '#888888';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#666666';
          }}
          title="+5 minutes"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Quote - Hidden in focus mode */}
      {!isFocusMode && settings.showQuotes && (
        <div
          style={{
            minHeight: '80px',
            marginTop: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: '450px',
              opacity: isRunning ? 0.7 : 1,
              transition: 'opacity 0.4s ease',
            }}
          >
            <p style={{
              color: '#888888',
              fontSize: '15px',
              fontStyle: 'italic',
              lineHeight: 1.7,
              fontWeight: 400,
            }}>
              "{quote.text}"
            </p>
            <p style={{
              color: '#666666',
              fontSize: '12px',
              marginTop: '10px',
              fontWeight: 500,
            }}>
              — {quote.author}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
