import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, BarChart3, ListTodo, Volume2, Music } from 'lucide-react';
import { useAuth, useTimer } from '../../contexts';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenTasks: () => void;
  onOpenAmbient: () => void;
  onOpenSpotify: () => void;
}

export function Header({
  onOpenSettings,
  onOpenStats,
  onOpenTasks,
  onOpenAmbient,
  onOpenSpotify,
}: HeaderProps) {
  const { isRunning } = useTimer();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        opacity: isRunning ? 0.4 : 1,
        background: '#000000',
        transition: 'opacity 0.5s ease',
      }}
      className={isRunning ? 'hide-on-mobile-when-running' : ''}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px', // Reduced default padding
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="responsive-padding"
      >
        {/* Logo - Click to go home */}
        <div
          onClick={() => window.location.reload()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ff4444, #ff8c00)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0, // Prevent shrinking
            }}
          >
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>P</span>
          </div>
          <span className="hide-on-mobile" style={{ color: '#ffffff', fontWeight: 600, fontSize: '18px', letterSpacing: '-0.02em' }}>
            Pomodoro
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <NavButton icon={<ListTodo size={20} />} label="Tasks" onClick={onOpenTasks} />
          <NavButton icon={<Volume2 size={20} />} label="Sounds" onClick={onOpenAmbient} />
          <NavButton icon={<Music size={20} />} label="Spotify" onClick={onOpenSpotify} />
          <NavButton icon={<BarChart3 size={20} />} label="Stats" onClick={onOpenStats} />
          <NavButton icon={<Settings size={20} />} label="Settings" onClick={onOpenSettings} />
        </nav>
      </div>
    </motion.header>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function NavButton({ icon, label, onClick }: NavButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ color: '#ffffff' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        background: 'transparent',
        border: 'none',
        borderRadius: '12px',
        color: '#555555',
        cursor: 'pointer',
        outline: 'none',
        transition: 'color 0.2s ease',
      }}
      title={label}
    >
      {icon}
    </motion.button>
  );
}
