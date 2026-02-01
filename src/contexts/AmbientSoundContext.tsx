import { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from 'react';
import { Howl } from 'howler';

interface Sound {
  id: string;
  name: string;
  icon: string;
  src: string;
}

// Real audio files in public/sounds folder
export const AMBIENT_SOUNDS: Sound[] = [
  { id: 'rain', name: 'Rain', icon: '🌧️', src: '/sounds/rain.mp3' },
  { id: 'ocean', name: 'Ocean Waves', icon: '🌊', src: '/sounds/ocean.mp3' },
  { id: 'forest', name: 'Forest', icon: '🌲', src: '/sounds/forest.mp3' },
  { id: 'cafe', name: 'Cafe', icon: '☕', src: '/sounds/cafe.mp3' },
  { id: 'white-noise', name: 'White Noise', icon: '🌫️', src: '' }, // Web Audio generated
  { id: 'brown-noise', name: 'Brown Noise', icon: '🟤', src: '' }, // Web Audio generated
];

interface ActiveSound {
  id: string;
  volume: number;
  howl: Howl | null;
  webAudio: { context: AudioContext; node: AudioBufferSourceNode; gain: GainNode } | null;
}

interface AmbientSoundContextType {
  sounds: Sound[];
  activeSounds: ActiveSound[];
  toggleSound: (soundId: string) => void;
  setVolume: (soundId: string, volume: number) => void;
  stopAll: () => void;
}

const AmbientSoundContext = createContext<AmbientSoundContextType | undefined>(undefined);

// Web Audio noise generators for white/brown noise
function createWhiteNoise(volume: number) {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const node = audioContext.createBufferSource();
  node.buffer = noiseBuffer;
  node.loop = true;

  const gain = audioContext.createGain();
  gain.gain.value = volume / 100;

  node.connect(gain);
  gain.connect(audioContext.destination);
  node.start();

  return { context: audioContext, node, gain };
}

function createBrownNoise(volume: number) {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
  }

  const node = audioContext.createBufferSource();
  node.buffer = noiseBuffer;
  node.loop = true;

  const gain = audioContext.createGain();
  gain.gain.value = volume / 100;

  node.connect(gain);
  gain.connect(audioContext.destination);
  node.start();

  return { context: audioContext, node, gain };
}

export function AmbientSoundProvider({ children }: { children: ReactNode }) {
  const [activeSounds, setActiveSounds] = useState<ActiveSound[]>([]);
  const howlsRef = useRef<Map<string, Howl>>(new Map());
  const webAudioRef = useRef<Map<string, { context: AudioContext; node: AudioBufferSourceNode; gain: GainNode }>>(new Map());

  const toggleSound = useCallback((soundId: string) => {
    const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    // Check if already playing
    const existingHowl = howlsRef.current.get(soundId);
    const existingWebAudio = webAudioRef.current.get(soundId);

    if (existingHowl || existingWebAudio) {
      // Stop
      if (existingHowl) {
        existingHowl.fade(existingHowl.volume(), 0, 300);
        setTimeout(() => {
          existingHowl.stop();
          existingHowl.unload();
        }, 300);
        howlsRef.current.delete(soundId);
      }
      if (existingWebAudio) {
        existingWebAudio.gain.gain.setValueAtTime(existingWebAudio.gain.gain.value, existingWebAudio.context.currentTime);
        existingWebAudio.gain.gain.exponentialRampToValueAtTime(0.001, existingWebAudio.context.currentTime + 0.3);
        setTimeout(() => {
          existingWebAudio.node.stop();
          existingWebAudio.context.close();
        }, 300);
        webAudioRef.current.delete(soundId);
      }
      setActiveSounds(prev => prev.filter(s => s.id !== soundId));
    } else {
      // Start
      if (sound.src) {
        // Use Howler for real audio files
        const howl = new Howl({
          src: [sound.src],
          loop: true,
          volume: 0.5,
          html5: true,
        });
        howl.play();
        howlsRef.current.set(soundId, howl);
        setActiveSounds(prev => [...prev, { id: soundId, volume: 50, howl, webAudio: null }]);
      } else {
        // Use Web Audio for generated noise
        let webAudio;
        if (soundId === 'white-noise') {
          webAudio = createWhiteNoise(50);
        } else if (soundId === 'brown-noise') {
          webAudio = createBrownNoise(50);
        }
        if (webAudio) {
          webAudioRef.current.set(soundId, webAudio);
          setActiveSounds(prev => [...prev, { id: soundId, volume: 50, howl: null, webAudio }]);
        }
      }
    }
  }, []);

  const setVolume = useCallback((soundId: string, volume: number) => {
    const howl = howlsRef.current.get(soundId);
    if (howl) {
      howl.volume(volume / 100);
    }

    const webAudio = webAudioRef.current.get(soundId);
    if (webAudio) {
      webAudio.gain.gain.value = volume / 100;
    }

    setActiveSounds(prev =>
      prev.map(s => s.id === soundId ? { ...s, volume } : s)
    );
  }, []);

  const stopAll = useCallback(() => {
    howlsRef.current.forEach((howl) => {
      howl.fade(howl.volume(), 0, 300);
      setTimeout(() => {
        howl.stop();
        howl.unload();
      }, 300);
    });
    howlsRef.current.clear();

    webAudioRef.current.forEach(wa => {
      wa.node.stop();
      wa.context.close();
    });
    webAudioRef.current.clear();

    setActiveSounds([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      howlsRef.current.forEach(howl => {
        howl.stop();
        howl.unload();
      });
      webAudioRef.current.forEach(wa => {
        wa.node.stop();
        wa.context.close();
      });
    };
  }, []);

  return (
    <AmbientSoundContext.Provider
      value={{
        sounds: AMBIENT_SOUNDS,
        activeSounds,
        toggleSound,
        setVolume,
        stopAll,
      }}
    >
      {children}
    </AmbientSoundContext.Provider>
  );
}

export function useAmbientSound() {
  const context = useContext(AmbientSoundContext);
  if (!context) {
    throw new Error('useAmbientSound must be used within an AmbientSoundProvider');
  }
  return context;
}
