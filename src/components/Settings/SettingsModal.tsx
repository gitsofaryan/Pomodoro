import { useState } from 'react';
import { Modal } from '../UI';
import { useSettings } from '../../contexts';
import { THEME_COLORS, TIMER_PRESETS, ThemeColor } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateTimerSettings, updateSettings, resetSettings } = useSettings();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    resetSettings();
    setShowConfirm(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="md">
      <div style={{ padding: '8px 0' }}>
        {/* Theme Section - AT THE TOP */}
        <SettingsSection title="Theme">
          <div style={{ padding: '14px 24px' }}>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {(Object.entries(THEME_COLORS) as [ThemeColor, { primary: string; glow: string }][]).map(([id, color]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => updateSettings({ theme: id })}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: color.primary,
                    border: settings.theme === id ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: settings.theme === id ? `0 0 16px ${color.primary}` : 'none',
                  }}
                  title={id}
                />
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* Timer Presets */}
        <SettingsSection title="Presets">
          <div style={{ padding: '14px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {TIMER_PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  updateTimerSettings({
                    pomodoro: preset.pomodoro,
                    shortBreak: preset.shortBreak,
                    longBreak: preset.longBreak,
                  });
                  onClose(); // Close modal after applying preset
                }}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <span style={{ fontWeight: 500 }}>{preset.name}</span>
                <span style={{ color: '#888888', fontSize: '12px' }}>
                  {preset.pomodoro}/{preset.shortBreak}/{preset.longBreak}
                </span>
              </button>
            ))}
          </div>
        </SettingsSection>

        {/* Timer Section */}
        <SettingsSection title="Timer">
          <SettingsRow label="Focus duration" hint="minutes">
            <NumberInput
              value={settings.timer.pomodoro}
              onChange={v => updateTimerSettings({ pomodoro: v })}
              min={1}
              max={120}
            />
          </SettingsRow>
          <SettingsRow label="Short break" hint="minutes">
            <NumberInput
              value={settings.timer.shortBreak}
              onChange={v => updateTimerSettings({ shortBreak: v })}
              min={1}
              max={60}
            />
          </SettingsRow>
          <SettingsRow label="Long break" hint="minutes">
            <NumberInput
              value={settings.timer.longBreak}
              onChange={v => updateTimerSettings({ longBreak: v })}
              min={1}
              max={60}
            />
          </SettingsRow>
          <SettingsRow label="Long break interval" hint="sessions">
            <NumberInput
              value={settings.timer.longBreakInterval}
              onChange={v => updateTimerSettings({ longBreakInterval: v })}
              min={2}
              max={10}
            />
          </SettingsRow>
          <SettingsRow label="Auto-start breaks">
            <Toggle
              checked={settings.timer.autoStartBreaks}
              onChange={c => updateTimerSettings({ autoStartBreaks: c })}
            />
          </SettingsRow>
          <SettingsRow label="Auto-start focus">
            <Toggle
              checked={settings.timer.autoStartPomodoros}
              onChange={c => updateTimerSettings({ autoStartPomodoros: c })}
            />
          </SettingsRow>
        </SettingsSection>

        {/* General Section */}
        <SettingsSection title="General">
          <SettingsRow label="Daily goal" hint="sessions">
            <NumberInput
              value={settings.dailyGoal}
              onChange={v => updateSettings({ dailyGoal: v })}
              min={1}
              max={20}
            />
          </SettingsRow>
          <SettingsRow label="Show quotes">
            <Toggle
              checked={settings.showQuotes}
              onChange={c => updateSettings({ showQuotes: c })}
            />
          </SettingsRow>
          <SettingsRow label="Notifications">
            <Toggle
              checked={settings.notifications}
              onChange={c => updateSettings({ notifications: c })}
            />
          </SettingsRow>
        </SettingsSection>

        {/* Reset */}
        <div style={{ padding: '20px 24px', height: '24px', display: 'flex', alignItems: 'center' }}>
          <div style={{ minWidth: '140px' }}>
            {!showConfirm ? (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666666',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Reset to defaults
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#888888', fontSize: '12px' }}>Reset?</span>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    background: '#ff4444',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '12px',
                    padding: '4px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#888888',
                    fontSize: '12px',
                    padding: '4px 10px',
                    cursor: 'pointer',
                  }}
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div
        style={{
          padding: '12px 24px 8px',
          color: '#666666',
          fontSize: '12px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function SettingsRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#ffffff', fontSize: '14px' }}>{label}</span>
        {hint && <span style={{ color: '#444444', fontSize: '12px' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => {
        const v = parseInt(e.target.value) || min;
        onChange(Math.max(min, Math.min(max, v)));
      }}
      min={min}
      max={max}
      style={{
        width: '64px',
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.06)',
        border: 'none',
        borderRadius: '8px',
        color: '#ffffff',
        fontSize: '14px',
        textAlign: 'center',
        outline: 'none',
      }}
    />
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: '44px',
        height: '26px',
        padding: '2px',
        background: checked ? '#00d26a' : 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '13px',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        outline: 'none',
      }}
    >
      <div
        style={{
          width: '22px',
          height: '22px',
          background: '#ffffff',
          borderRadius: '50%',
          transform: checked ? 'translateX(18px)' : 'translateX(0)',
          transition: 'transform 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}
