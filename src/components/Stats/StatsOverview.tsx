import { motion } from 'framer-motion';
import { useStats, useSettings } from '../../contexts';
import { Clock, Target, CheckCircle, Flame, Award } from 'lucide-react';

export function StatsOverview() {
  const { stats, todayStats } = useStats();
  const { settings } = useSettings();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const cards = [
    {
      icon: Clock,
      label: 'Total Focus Time',
      value: formatTime(stats.totalFocusTime),
      color: '#4a9eff',
    },
    {
      icon: Target,
      label: 'Total Pomodoros',
      value: stats.totalPomodoros.toString(),
      color: '#00d26a',
    },
    {
      icon: CheckCircle,
      label: 'Tasks Completed',
      value: stats.totalTasksCompleted.toString(),
      color: '#a855f7',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: '#ff8c00',
    },
    {
      icon: Award,
      label: 'Longest Streak',
      value: `${stats.longestStreak} days`,
      color: '#ffd700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <div className="p-4 rounded-xl" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <h3 className="text-sm font-medium mb-3" style={{ color: '#666' }}>Today's Progress</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-white">{todayStats.totalPomodoros}</p>
            <p className="text-sm" style={{ color: '#555' }}>of {settings.dailyGoal} goal</p>
          </div>
          <div className="w-32">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#222' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#00d26a' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((todayStats.totalPomodoros / settings.dailyGoal) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs mt-1 text-right" style={{ color: '#444' }}>
              {formatTime(todayStats.totalFocusTime)} focused
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl"
            style={{ background: '#111', border: '1px solid #1a1a1a' }}
          >
            <card.icon size={20} style={{ color: card.color }} />
            <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
            <p className="text-xs" style={{ color: '#555' }}>{card.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
