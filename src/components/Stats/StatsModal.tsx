import { useState } from 'react';
import { Modal } from '../UI';
import { useStats } from '../../contexts';
import { Clock, Target, Flame, TrendingUp } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const { stats, todayStats, exportStats, resetStats } = useStats();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = () => {
    const csv = exportStats();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomodoro-stats-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    resetStats();
    setShowConfirm(false);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayStats = stats.dailyStats.find(s => s.date === dateKey);
      days.push({
        date: dateKey,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: dayStats?.totalPomodoros || 0,
      });
    }
    return days;
  };

  const weekData = getLast7Days();
  const maxSessions = Math.max(...weekData.map(d => d.sessions), 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics" size="md">
      <div style={{ padding: '24px' }}>
        {/* Today's Stats */}
        <div style={{ marginBottom: '32px' }}>
          <h3
            style={{
              color: '#666666',
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}
          >
            Today
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <StatCard
              icon={<Target size={18} />}
              label="Sessions"
              value={todayStats.totalPomodoros.toString()}
            />
            <StatCard
              icon={<Clock size={18} />}
              label="Focus time"
              value={formatTime(todayStats.totalFocusTime)}
            />
          </div>
        </div>

        {/* Streak Counter */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 40px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(251, 146, 60, 0.1))',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔥</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              {stats.currentStreak} {stats.currentStreak === 1 ? 'Day' : 'Days'}
            </div>
            <div style={{ fontSize: '14px', color: '#888888', marginBottom: '12px' }}>
              {stats.currentStreak === 0 && 'Start your streak today!'}
              {stats.currentStreak === 1 && 'Great start! Keep it going'}
              {stats.currentStreak >= 2 && stats.currentStreak < 7 && 'You\'re building momentum!'}
              {stats.currentStreak >= 7 && stats.currentStreak < 30 && 'Amazing progress! 🌟'}
              {stats.currentStreak >= 30 && 'You\'re unstoppable! 🚀'}
            </div>
            {stats.longestStreak > stats.currentStreak && (
              <div style={{ fontSize: '12px', color: '#666666' }}>
                Best: {stats.longestStreak} {stats.longestStreak === 1 ? 'day' : 'days'}
              </div>
            )}
          </div>
        </div>

        {/* All Time Stats */}
        <div style={{ marginBottom: '32px' }}>
          <h3
            style={{
              color: '#666666',
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}
          >
            All time
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <StatCard
              icon={<TrendingUp size={18} />}
              label="Total sessions"
              value={stats.totalPomodoros.toString()}
            />
            <StatCard
              icon={<Clock size={18} />}
              label="Total focus"
              value={formatTime(stats.totalFocusTime)}
            />
            <StatCard
              icon={<Flame size={18} />}
              label="Current streak"
              value={`${stats.currentStreak} days`}
            />
            <StatCard
              icon={<Flame size={18} />}
              label="Best streak"
              value={`${stats.longestStreak} days`}
            />
          </div>
        </div>

        {/* Weekly Chart */}
        <div style={{ marginBottom: '32px' }}>
          <h3
            style={{
              color: '#666666',
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}
          >
            Last 7 Days
          </h3>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', gap: '8px' }}>
              {weekData.map((day, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    {day.sessions > 0 && (
                      <div style={{ fontSize: '11px', color: '#888888', marginBottom: '4px' }}>
                        {day.sessions}
                      </div>
                    )}
                    <div
                      style={{
                        width: '100%',
                        height: `${(day.sessions / maxSessions) * 100}%`,
                        minHeight: day.sessions > 0 ? '8px' : '4px',
                        background: day.sessions > 0
                          ? 'linear-gradient(180deg, #f97316, #ef4444)'
                          : 'rgba(255,255,255,0.05)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: index === 6 ? '#ffffff' : '#666666',
                      fontWeight: index === 6 ? 600 : 400,
                    }}
                  >
                    {day.dayName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            height: '32px',
          }}
        >
          <button
            type="button"
            onClick={handleExport}
            style={{
              background: 'none',
              border: 'none',
              color: '#666666',
              fontSize: '13px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Export CSV
          </button>

          <div style={{ minWidth: '80px', textAlign: 'right' }}>
            {!showConfirm ? (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff4444',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Reset stats
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
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

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: '16px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
      }}
    >
      <div style={{ color: '#444444', marginBottom: '8px' }}>{icon}</div>
      <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 500, marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ color: '#666666', fontSize: '12px' }}>{label}</div>
    </div>
  );
}
