import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAmbientSound } from '../../contexts/AmbientSoundContext';

interface AmbientSoundPanelProps {
  isOpen?: boolean;
  onClose: () => void;
}

export function AmbientSoundPanel({ isOpen = true, onClose }: AmbientSoundPanelProps) {
  const { sounds, activeSounds, toggleSound, setVolume, stopAll } = useAmbientSound();

  const getVolume = (soundId: string) => {
    const active = activeSounds.find(s => s.id === soundId);
    return active?.volume ?? 50;
  };

  const isActive = (soundId: string) => activeSounds.some(s => s.id === soundId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '480px',
              maxHeight: '80vh',
              background: '#0c0c0c',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div>
                <h2 style={{ color: '#ffffff', fontSize: '17px', fontWeight: 600 }}>Ambient Sounds</h2>
                <p style={{ color: '#666666', fontSize: '12px', marginTop: '4px' }}>
                  {activeSounds.length > 0 ? `${activeSounds.length} playing` : 'Select sounds to play'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {activeSounds.length > 0 && (
                  <button
                    type="button"
                    onClick={stopAll}
                    style={{
                      padding: '8px 14px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#888888',
                      fontSize: '13px',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    Stop All
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: 'none',
                    borderRadius: '50%',
                    color: '#888888',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Sound Grid */}
            <div
              style={{
                padding: '20px',
                overflowY: 'auto',
              }}
            >
              <div
                className="ambient-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)', // Default for desktop
                  gap: '12px',
                }}
              >
                {sounds.map(sound => {
                  const active = isActive(sound.id);
                  const volume = getVolume(sound.id);

                  return (
                    <motion.div
                      key={sound.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSound(sound.id)}
                      className="ambient-tile"
                      style={{
                        padding: '16px',
                        background: active ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: active ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column', // Set for mobile via class, row via inline (desktop default) but style object overrides class if not careful.
                        // Actually inline styles override classes. 
                        // I should remove the inline styles that conflict with my class!
                      }}
                    >
                      <div className="ambient-content" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                        <span className="ambient-icon" style={{ fontSize: '24px' }}>{sound.icon}</span>
                        <div style={{ flex: 1, width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                            <span className="ambient-text" style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>
                              {sound.name}
                            </span>
                            {active && (
                              <div
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: '#22c55e',
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Volume slider - always reserve space */}
                      <div
                        onClick={e => e.stopPropagation()}
                        className="ambient-slider"
                        style={{
                          marginTop: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          opacity: active ? 1 : 0,
                          pointerEvents: active ? 'auto' : 'none',
                          height: '20px',
                        }}
                      >
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={e => setVolume(sound.id, Number(e.target.value))}
                          style={{ flex: 1, height: '6px' }}
                        />
                        <span style={{ color: '#666666', fontSize: '11px', minWidth: '32px', textAlign: 'right' }}>
                          {volume}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
