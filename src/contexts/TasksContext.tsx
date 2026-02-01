import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TASK_COLORS } from '../types';
import { useStats } from './StatsContext';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface TasksContextType {
  tasks: Task[];
  addTask: (title: string, estimatedPomodoros?: number, color?: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  incrementTaskPomodoro: (id: string) => void;
  clearCompletedTasks: () => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const STORAGE_KEY = 'pomodoro-tasks';

export function TasksProvider({ children }: { children: ReactNode }) {
  const { incrementTasksCompleted } = useStats();
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((t: Task) => ({
          ...t,
          color: t.color || TASK_COLORS[0],
          createdAt: new Date(t.createdAt),
          completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Load tasks from Supabase
  useEffect(() => {
    if (!user || !supabase) return;

    const loadTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading tasks:', error);
        return;
      }

      if (data) {
        setTasks(data.map((t: any) => ({
          id: t.id,
          title: t.title,
          estimatedPomodoros: t.estimated_pomodoros,
          completedPomodoros: t.completed_pomodoros,
          isCompleted: t.is_completed,
          color: t.color,
          createdAt: new Date(t.created_at),
          completedAt: t.completed_at ? new Date(t.completed_at) : undefined,
        })));
      }
    };

    loadTasks();
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (title: string, estimatedPomodoros = 1, color = TASK_COLORS[0]) => {
    if (user && supabase) {
      const newTaskData = {
        user_id: user.id,
        title,
        estimated_pomodoros: estimatedPomodoros,
        completed_pomodoros: 0,
        is_completed: false,
        color,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTaskData)
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        return;
      }

      if (data) {
        const newTask: Task = {
          id: data.id,
          title: data.title,
          estimatedPomodoros: data.estimated_pomodoros,
          completedPomodoros: data.completed_pomodoros,
          isCompleted: data.is_completed,
          color: data.color,
          createdAt: new Date(data.created_at),
        };
        setTasks(prev => [...prev, newTask]);
      }
    } else {
      // Local fallback
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        estimatedPomodoros,
        completedPomodoros: 0,
        isCompleted: false,
        color,
        createdAt: new Date(),
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );

    if (user && supabase) {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.estimatedPomodoros !== undefined) dbUpdates.estimated_pomodoros = updates.estimatedPomodoros;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      // Map other fields as needed, though typical updates are title, estimates, color from UI

      if (Object.keys(dbUpdates).length > 0) {
        supabase.from('tasks').update(dbUpdates).eq('id', id).then(({ error }) => {
          if (error) console.error('Error updating task:', error);
        });
      }
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));

    if (user && supabase) {
      supabase.from('tasks').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Error deleting task:', error);
      });
    }
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const isNowComplete = !task.isCompleted;
          if (isNowComplete) {
            incrementTasksCompleted();
          }

          const updatedTask = {
            ...task,
            isCompleted: isNowComplete,
            completedAt: isNowComplete ? new Date() : undefined,
          };

          if (user && supabase) {
            supabase.from('tasks').update({
              is_completed: isNowComplete,
              completed_at: isNowComplete ? new Date().toISOString() : null
            }).eq('id', id).then(({ error }) => {
              if (error) console.error('Error toggling task complete:', error);
            });
          }

          return updatedTask;
        }
        return task;
      })
    );
  };

  const incrementTaskPomodoro = (id: string) => {
    let newCount = 0;
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          newCount = task.completedPomodoros + 1;
          return { ...task, completedPomodoros: newCount };
        }
        return task;
      })
    );

    if (user && supabase) {
      supabase.from('tasks').update({
        completed_pomodoros: newCount // This might be stale if strict concurrency, but ok for this app
        // Safer way is using sql rpc or assuming single user session active
      }).eq('id', id).then(({ error }) => {
        if (error) console.error('Error incrementing task pomodoro:', error);
      });
    }
  };

  const clearCompletedTasks = () => {
    const completedIds = tasks.filter(t => t.isCompleted).map(t => t.id);
    setTasks(prev => prev.filter(task => !task.isCompleted));

    if (user && supabase && completedIds.length > 0) {
      supabase.from('tasks').delete().in('id', completedIds).then(({ error }) => {
        if (error) console.error('Error clearing completed tasks:', error);
      });
    }
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    setTasks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
    // Note: Reordering is not persisted to Supabase as there is no order column.
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        incrementTaskPomodoro,
        clearCompletedTasks,
        reorderTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
