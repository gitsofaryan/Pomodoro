import { useSettings } from '../../contexts';
import { Select, Slider } from '../UI';
import { ALARM_SOUNDS, AMBIENT_SOUNDS } from '../../types';

export function SoundSettings() {
  const { settings, updateSoundSettings } = useSettings();

  const alarmOptions = ALARM_SOUNDS.map(s => ({ value: s.id, label: s.name }));
  const ambientOptions = AMBIENT_SOUNDS.map(s => ({ value: s.id, label: s.name }));

  return (
    <div className="space-y-6">
      {/* Alarm Sound */}
      <div className="space-y-3">
        <Select
          label="Alarm Sound"
          options={alarmOptions}
          value={settings.sound.alarmSound}
          onChange={value => updateSoundSettings({ alarmSound: value })}
        />
        <Slider
          label="Alarm Volume"
          value={settings.sound.alarmVolume}
          onChange={value => updateSoundSettings({ alarmVolume: value })}
          min={0}
          max={100}
        />
      </div>

      {/* Ambient Sound */}
      <div className="space-y-3">
        <Select
          label="Ambient Sound"
          options={ambientOptions}
          value={settings.sound.ambientSound}
          onChange={value => updateSoundSettings({ ambientSound: value })}
        />
        {settings.sound.ambientSound !== 'none' && (
          <Slider
            label="Ambient Volume"
            value={settings.sound.ambientVolume}
            onChange={value => updateSoundSettings({ ambientVolume: value })}
            min={0}
            max={100}
          />
        )}
      </div>
    </div>
  );
}
