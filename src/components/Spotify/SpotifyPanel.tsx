import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, ExternalLink } from 'lucide-react';

interface SpotifyPanelProps {
  isOpen?: boolean;
  onClose: () => void;
}

const FOCUS_PLAYLISTS = [
  { id: '1', name: 'Deep Focus', description: 'Ambient music for concentration', cover: '🎯', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { id: '2', name: 'Lo-Fi Beats', description: 'Chill beats for studying', cover: '🎧', url: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn' },
  { id: '3', name: 'Classical Focus', description: 'Classical for productivity', cover: '🎻', url: 'https://open.spotify.com/playlist/37i9dQZF1DWV7EzJMK2FUI' },
  { id: '4', name: 'Nature Sounds', description: 'Natural ambience', cover: '🌿', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4PP3DA4J0N8' },
  { id: '5', name: 'Brain Food', description: 'Music for thinking', cover: '🧠', url: 'https://open.spotify.com/playlist/37i9dQZF1DWXLeA8Omikj7' },
  { id: '6', name: 'Peaceful Piano', description: 'Piano melodies', cover: '🎹', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
];

export function SpotifyPanel({ isOpen = true, onClose }: SpotifyPanelProps) {
  const openSpotify = (url: string) => {
    window.open(url, '_blank');
  };

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
              width: '100%',
              maxWidth: '380px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#1DB954',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Music size={12} color="#000000" />
                </div>
                <h2 style={{ color: '#ffffff', fontSize: '17px', fontWeight: 600 }}>Spotify</h2>
              </div>
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
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#888888';
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Info */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ color: '#888888', fontSize: '14px', lineHeight: 1.5 }}>
                Select a playlist to open in Spotify
              </p>
            </div>

            {/* Playlists */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {FOCUS_PLAYLISTS.map(playlist => (
                  <button
                    key={playlist.id}
                    type="button"
                    onClick={() => openSpotify(playlist.url)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      background: 'rgba(255,255,255,0.03)',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      outline: 'none',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        flexShrink: 0,
                      }}
                    >
                      {playlist.cover}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{playlist.name}</p>
                      <p style={{ color: '#666666', fontSize: '12px' }}>{playlist.description}</p>
                    </div>
                    <ExternalLink size={16} color="#444444" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                type="button"
                onClick={() => openSpotify('https://open.spotify.com')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  background: '#1DB954',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#000000',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <Music size={18} />
                Open Spotify
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
