import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useSettings } from '../contexts';

// Sound URLs - using free sounds
const ALARM_SOUNDS: Record<string, string> = {
  bell: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  digital: 'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3',
  gentle: 'https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3',
  kitchen: 'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3',
};

const AMBIENT_SOUNDS: Record<string, string> = {
  rain: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
  forest: 'https://assets.mixkit.co/active_storage/sfx/2518/2518-preview.mp3',
  cafe: 'https://assets.mixkit.co/active_storage/sfx/2516/2516-preview.mp3',
  ocean: 'https://assets.mixkit.co/active_storage/sfx/2517/2517-preview.mp3',
  fireplace: 'https://assets.mixkit.co/active_storage/sfx/2519/2519-preview.mp3',
};

export function useSound() {
  const { settings } = useSettings();
  const alarmRef = useRef<Howl | null>(null);
  const ambientRef = useRef<Howl | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      alarmRef.current?.unload();
      ambientRef.current?.unload();
    };
  }, []);

  const playAlarm = useCallback(() => {
    const soundUrl = ALARM_SOUNDS[settings.sound.alarmSound];
    if (!soundUrl) return;

    alarmRef.current?.stop();
    alarmRef.current = new Howl({
      src: [soundUrl],
      volume: settings.sound.alarmVolume / 100,
    });
    alarmRef.current.play();
  }, [settings.sound.alarmSound, settings.sound.alarmVolume]);

  const startAmbient = useCallback(() => {
    if (settings.sound.ambientSound === 'none') {
      stopAmbient();
      return;
    }

    const soundUrl = AMBIENT_SOUNDS[settings.sound.ambientSound];
    if (!soundUrl) return;

    ambientRef.current?.stop();
    ambientRef.current = new Howl({
      src: [soundUrl],
      volume: settings.sound.ambientVolume / 100,
      loop: true,
    });
    ambientRef.current.play();
  }, [settings.sound.ambientSound, settings.sound.ambientVolume]);

  const stopAmbient = useCallback(() => {
    ambientRef.current?.stop();
  }, []);

  const setAmbientVolume = useCallback((volume: number) => {
    ambientRef.current?.volume(volume / 100);
  }, []);

  return {
    playAlarm,
    startAmbient,
    stopAmbient,
    setAmbientVolume,
  };
}
