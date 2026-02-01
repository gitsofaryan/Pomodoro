import { useSettings } from '../../contexts';
import { Input, Toggle } from '../UI';

export function GeneralSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      {/* Daily Goal */}
      <Input
        label="Daily Goal (pomodoros)"
        type="number"
        min={1}
        max={20}
        value={settings.dailyGoal}
        onChange={e => updateSettings({ dailyGoal: Number(e.target.value) || 8 })}
      />

      {/* Toggles */}
      <div className="space-y-4">
        <Toggle
          label="Dark mode when running"
          checked={settings.darkModeWhenRunning}
          onChange={checked => updateSettings({ darkModeWhenRunning: checked })}
        />
        <Toggle
          label="Show motivational quotes"
          checked={settings.showQuotes}
          onChange={checked => updateSettings({ showQuotes: checked })}
        />
        <Toggle
          label="Browser notifications"
          checked={settings.notifications}
          onChange={checked => updateSettings({ notifications: checked })}
        />
      </div>
    </div>
  );
}
