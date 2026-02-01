import { useSettings } from '../../contexts';
import { Input, Toggle } from '../UI';

export function TimerSettings() {
  const { settings, updateTimerSettings } = useSettings();

  return (
    <div className="space-y-6">
      {/* Time Duration */}
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Pomodoro"
          type="number"
          min={1}
          max={120}
          value={settings.timer.pomodoro}
          onChange={e => updateTimerSettings({ pomodoro: Number(e.target.value) || 25 })}
        />
        <Input
          label="Short Break"
          type="number"
          min={1}
          max={60}
          value={settings.timer.shortBreak}
          onChange={e => updateTimerSettings({ shortBreak: Number(e.target.value) || 5 })}
        />
        <Input
          label="Long Break"
          type="number"
          min={1}
          max={60}
          value={settings.timer.longBreak}
          onChange={e => updateTimerSettings({ longBreak: Number(e.target.value) || 15 })}
        />
      </div>

      {/* Long Break Interval */}
      <Input
        label="Long Break Interval"
        type="number"
        min={2}
        max={10}
        value={settings.timer.longBreakInterval}
        onChange={e => updateTimerSettings({ longBreakInterval: Number(e.target.value) || 4 })}
      />

      {/* Auto Start Options */}
      <div className="space-y-4">
        <Toggle
          label="Auto-start breaks"
          checked={settings.timer.autoStartBreaks}
          onChange={checked => updateTimerSettings({ autoStartBreaks: checked })}
        />
        <Toggle
          label="Auto-start pomodoros"
          checked={settings.timer.autoStartPomodoros}
          onChange={checked => updateTimerSettings({ autoStartPomodoros: checked })}
        />
      </div>
    </div>
  );
}
