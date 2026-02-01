import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, BarChart3, User, ListTodo, Volume2, LogOut, Copy, Check, ChevronDown, Music } from 'lucide-react';
import { useAuth, useTimer } from '../../contexts';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenAuth: () => void;
  onOpenTasks: () => void;
  onOpenAmbient: () => void;
  onOpenSpotify: () => void;
}

export function Header({
  onOpenSettings,
  onOpenStats,
  onOpenAuth,
  onOpenTasks,
  onOpenAmbient,
  onOpenSpotify,
}: HeaderProps) {
  const { user, signOut } = useAuth();
  const { isRunning } = useTimer();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyUserId = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="responsive-padding"
      >
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
              flexShrink: 0,
            }}
          >
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>P</span>
          </div>
          <span className="hide-on-mobile" style={{ color: '#ffffff', fontWeight: 600, fontSize: '18px', letterSpacing: '-0.02em' }}>
            Pomodoro
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <NavButton icon={<ListTodo size={20} />} label="Tasks" onClick={onOpenTasks} />
          <NavButton icon={<Volume2 size={20} />} label="Sounds" onClick={onOpenAmbient} />
          <NavButton icon={<Music size={20} />} label="Spotify" onClick={onOpenSpotify} />
          <NavButton icon={<BarChart3 size={20} />} label="Stats" onClick={onOpenStats} />
          <NavButton icon={<Settings size={20} />} label="Settings" onClick={onOpenSettings} />

          <div style={{ width: '1px', height: '24px', margin: '0 8px', background: '#222222' }} />

          <div key={user?.id || 'guest'} style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              type="button"
              onClick={() => user ? setIsProfileOpen(!isProfileOpen) : onOpenAuth()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: user ? 'rgba(255,255,255,0.05)' : '#111111',
                border: user ? '1px solid rgba(255,255,255,0.1)' : '1px solid #222222',
                borderRadius: '12px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = user ? 'rgba(255,255,255,0.08)' : '#1a1a1a')}
              onMouseLeave={e => (e.currentTarget.style.background = user ? 'rgba(255,255,255,0.05)' : '#111111')}
            >
              {user ? (
                <>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff4444, #ff8c00)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 600 }}>
                      {(user.user_metadata?.display_name || user.email)?.[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="hide-on-mobile" style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500 }}>
                    {user.user_metadata?.display_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown size={14} color="#666666" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </>
              ) : (
                <>
                  <User size={18} color="#555555" />
                  <span className="hide-on-mobile" style={{ color: '#888888', fontSize: '14px', fontWeight: 500 }}>Sign In</span>
                </>
              )}
            </button>

            <AnimatePresence>
              {isProfileOpen && user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: '240px',
                    background: '#0c0c0c',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                    padding: '12px',
                    zIndex: 200,
                  }}
                >
                  <div style={{ padding: '8px 12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '8px' }}>
                    <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                      {user.user_metadata?.display_name || 'User'}
                    </p>
                    <p style={{ color: '#666666', fontSize: '12px', margin: '2px 0 8px' }}>
                      {user.email}
                    </p>
                    <div
                      onClick={copyUserId}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#444444',
                        fontSize: '10px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px'
                      }}
                    >
                      <code style={{ fontFamily: 'monospace' }}>ID: {user.id.slice(0, 8)}...</code>
                      {copied ? <Check size={10} color="#22c55e" /> : <Copy size={10} />}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenSettings();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#888888',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#888888';
                    }}
                  >
                    <Settings size={16} />
                    Account Settings
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOut();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#ff4444',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: '4px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
