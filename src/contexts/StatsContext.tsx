import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStats, PomodoroSession, DailyStats, DEFAULT_STATS } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface StatsContextType {
  stats: UserStats;
  todayStats: DailyStats;
  addSession: (session: PomodoroSession) => void;
  incrementTasksCompleted: () => void;
  updateStreak: () => void;
  resetStats: () => void;
  exportStats: () => string;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

const STORAGE_KEY = 'pomodoro-stats';

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function StatsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_STATS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_STATS;
      }
    }
    return DEFAULT_STATS;
  });

  // Load stats from Supabase
  useEffect(() => {
    if (!user || !supabase) return;

    const loadStats = async () => {
      if (!supabase) return;

      // Load user stats
      const { data: userStatsData, error: userStatsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userStatsError && userStatsError.code !== 'PGRST116') {
        console.error('Error loading user stats:', userStatsError);
      }

      // Load daily stats (last 365 days)
      const { data: dailyStatsData, error: dailyStatsError } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .limit(365);

      if (dailyStatsError) {
        console.error('Error loading daily stats:', dailyStatsError);
      }

      if (userStatsData || dailyStatsData) {
        setStats(prev => ({
          ...prev,
          ...(userStatsData ? {
            totalPomodoros: userStatsData.total_pomodoros,
            totalFocusTime: userStatsData.total_focus_time,
            totalTasksCompleted: userStatsData.total_tasks_completed,
            currentStreak: userStatsData.current_streak,
            longestStreak: userStatsData.longest_streak,
            lastActiveDate: userStatsData.last_active_date || '',
          } : {}),
          dailyStats: dailyStatsData ? dailyStatsData.map((d: any) => ({
            date: d.date,
            totalPomodoros: d.total_pomodoros,
            totalFocusTime: d.total_focus_time,
            tasksCompleted: d.tasks_completed,
          })) : prev.dailyStats,
        }));
      } else if (userStatsError?.code === 'PGRST116') {
        // Initialize if new user
        // We don't necessarily need to push local stats to DB immediately on load 
        // unless we want to sync local -> cloud on first login.
        // For now, let's assume cloud is truth if exists, else start fresh or keep local if merge needed.
        // The implementation plan says "data will start fresh or load from cloud".
      }
    };

    loadStats();
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const getTodayStats = (): DailyStats => {
    const today = getTodayKey();
    const existing = stats.dailyStats.find(s => s.date === today);
    return existing || { date: today, totalPomodoros: 0, totalFocusTime: 0, tasksCompleted: 0 };
  };

  const addSession = async (session: PomodoroSession) => {
    const today = getTodayKey();

    // Optimistic update
    setStats(prev => {
      const existingIndex = prev.dailyStats.findIndex(s => s.date === today);
      let newDailyStats = [...prev.dailyStats];
      let todayStat: DailyStats;

      if (existingIndex >= 0) {
        todayStat = {
          ...newDailyStats[existingIndex],
          totalPomodoros: newDailyStats[existingIndex].totalPomodoros + 1,
          totalFocusTime: newDailyStats[existingIndex].totalFocusTime + session.duration,
        };
        newDailyStats[existingIndex] = todayStat;
      } else {
        todayStat = {
          date: today,
          totalPomodoros: 1,
          totalFocusTime: session.duration,
          tasksCompleted: 0,
        };
        newDailyStats.push(todayStat);
      }

      // Keep only last 365 days
      if (newDailyStats.length > 365) {
        newDailyStats = newDailyStats.slice(-365);
      }

      const newState = {
        ...prev,
        totalPomodoros: prev.totalPomodoros + 1,
        totalFocusTime: prev.totalFocusTime + session.duration,
        dailyStats: newDailyStats,
      };

      // Sync to Supabase
      if (user && supabase) {
        (async () => {
          // 1. Insert detailed session
          await supabase.from('pomodoro_sessions').insert({
            user_id: user.id,
            duration: session.duration,
            type: session.mode,
            task_id: session.taskId || null,
            timestamp: new Date().toISOString()
          });

          // 2. Upsert daily stats
          await supabase.from('daily_stats').upsert({
            user_id: user.id,
            date: today,
            total_pomodoros: todayStat.totalPomodoros,
            total_focus_time: todayStat.totalFocusTime,
            tasks_completed: todayStat.tasksCompleted
          }, { onConflict: 'user_id,date' });

          // 3. Upsert user stats
          await supabase.from('user_stats').upsert({
            user_id: user.id,
            total_pomodoros: newState.totalPomodoros,
            total_focus_time: newState.totalFocusTime,
            // Other fields might need to be preserved if updated concurrently, but for now sending full state
            total_tasks_completed: newState.totalTasksCompleted,
            current_streak: newState.currentStreak,
            longest_streak: newState.longestStreak,
            last_active_date: newState.lastActiveDate,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        })();
      }

      return newState;
    });
  };

  const incrementTasksCompleted = async () => {
    const today = getTodayKey();

    setStats(prev => {
      const existingIndex = prev.dailyStats.findIndex(s => s.date === today);
      let newDailyStats = [...prev.dailyStats];
      let todayStat: DailyStats;

      if (existingIndex >= 0) {
        todayStat = {
          ...newDailyStats[existingIndex],
          tasksCompleted: newDailyStats[existingIndex].tasksCompleted + 1,
        };
        newDailyStats[existingIndex] = todayStat;
      } else {
        todayStat = {
          date: today,
          totalPomodoros: 0,
          totalFocusTime: 0,
          tasksCompleted: 1,
        };
        newDailyStats.push(todayStat);
      }

      const newState = {
        ...prev,
        totalTasksCompleted: prev.totalTasksCompleted + 1,
        dailyStats: newDailyStats,
      };

      if (user && supabase) {
        (async () => {
          await supabase.from('daily_stats').upsert({
            user_id: user.id,
            date: today,
            total_pomodoros: todayStat.totalPomodoros,
            total_focus_time: todayStat.totalFocusTime,
            tasks_completed: todayStat.tasksCompleted
          }, { onConflict: 'user_id,date' });

          await supabase.from('user_stats').upsert({
            user_id: user.id,
            total_pomodoros: newState.totalPomodoros,
            total_focus_time: newState.totalFocusTime,
            total_tasks_completed: newState.totalTasksCompleted,
            current_streak: newState.currentStreak,
            longest_streak: newState.longestStreak,
            last_active_date: newState.lastActiveDate,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        })();
      }

      return newState;
    });
  };

  const updateStreak = async () => {
    const today = getTodayKey();

    setStats(prev => {
      const lastActive = prev.lastActiveDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split('T')[0];

      let newStreak = prev.currentStreak;

      if (lastActive === today) {
        return prev;
      } else if (lastActive === yesterdayKey) {
        newStreak = prev.currentStreak + 1;
      } else if (lastActive !== today) {
        newStreak = 1;
      }

      const newState = {
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActiveDate: today,
      };

      if (user && supabase) {
        (async () => {
          await supabase.from('user_stats').upsert({
            user_id: user.id,
            total_pomodoros: newState.totalPomodoros,
            total_focus_time: newState.totalFocusTime,
            total_tasks_completed: newState.totalTasksCompleted,
            current_streak: newState.currentStreak,
            longest_streak: newState.longestStreak,
            last_active_date: newState.lastActiveDate,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        })();
      }

      return newState;
    });
  };

  const resetStats = () => {
    setStats(DEFAULT_STATS);
  };

  const exportStats = (): string => {
    const headers = ['Date', 'Pomodoros', 'Focus Time (min)', 'Tasks Completed'];
    const rows = stats.dailyStats.map(s => [
      s.date,
      s.totalPomodoros.toString(),
      s.totalFocusTime.toString(),
      s.tasksCompleted.toString(),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  return (
    <StatsContext.Provider
      value={{
        stats,
        todayStats: getTodayStats(),
        addSession,
        incrementTasksCompleted,
        updateStreak,
        resetStats,
        exportStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
