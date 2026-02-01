export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export type ThemeColor = 'red' | 'blue' | 'purple' | 'green' | 'orange';

export interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface SoundSettings {
  alarmSound: string;
  alarmVolume: number;
  tickingSound: string;
  tickingVolume: number;
  ambientSound: string;
  ambientVolume: number;
}

export interface AppSettings {
  timer: TimerSettings;
  sound: SoundSettings;
  theme: ThemeColor;
  darkModeWhenRunning: boolean;
  showQuotes: boolean;
  dailyGoal: number;
  notifications: boolean;
}

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  color: string;
  createdAt: Date;
  completedAt?: Date;
}

export const TASK_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6b7280', // gray
];

export const THEME_COLORS: Record<ThemeColor, { primary: string; glow: string }> = {
  red: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' },
  orange: { primary: '#f97316', glow: 'rgba(249, 115, 22, 0.3)' },
  green: { primary: '#22c55e', glow: 'rgba(34, 197, 94, 0.3)' },
  blue: { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.3)' },
  purple: { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' },
};

export const TIMER_PRESETS = [
  { id: 'classic', name: 'Classic', pomodoro: 25, shortBreak: 5, longBreak: 15 },
  { id: 'deep-work', name: 'Deep Work', pomodoro: 50, shortBreak: 10, longBreak: 30 },
  { id: 'quick', name: 'Quick Tasks', pomodoro: 15, shortBreak: 3, longBreak: 10 },
];

export interface PomodoroSession {
  id: string;
  mode: TimerMode;
  duration: number;
  completedAt: Date;
  taskId?: string;
}

export interface DailyStats {
  date: string;
  totalPomodoros: number;
  totalFocusTime: number;
  tasksCompleted: number;
}

export interface UserStats {
  totalPomodoros: number;
  totalFocusTime: number;
  totalTasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyStats: DailyStats[];
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export const DEFAULT_SETTINGS: AppSettings = {
  timer: {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  },
  sound: {
    alarmSound: 'bell',
    alarmVolume: 50,
    tickingSound: 'none',
    tickingVolume: 50,
    ambientSound: 'none',
    ambientVolume: 30,
  },
  theme: 'orange',
  darkModeWhenRunning: true,
  showQuotes: true,
  dailyGoal: 8,
  notifications: true,
};

export const DEFAULT_STATS: UserStats = {
  totalPomodoros: 0,
  totalFocusTime: 0,
  totalTasksCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  dailyStats: [],
};

export const QUOTES = [
  // Productivity & Focus
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },

  // Deep Work & Concentration
  { text: "Deep work is the ability to focus without distraction on a cognitively demanding task.", author: "Cal Newport" },
  { text: "What we fear doing most is usually what we most need to do.", author: "Tim Ferriss" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Lack of direction, not lack of time, is the problem. We all have 24-hour days.", author: "Zig Ziglar" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "Until we can manage time, we can manage nothing else.", author: "Peter Drucker" },
  { text: "Efficiency is doing things right; effectiveness is doing the right things.", author: "Peter Drucker" },

  // Perseverance & Discipline
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "I hated every minute of training, but I said, 'Don't quit.'", author: "Muhammad Ali" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "The pain of discipline is nothing like the pain of disappointment.", author: "Justin Langer" },
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "Small disciplines repeated with consistency lead to great achievements over time.", author: "John Maxwell" },

  // Mindset & Growth
  { text: "Your mind is a garden, your thoughts are the seeds. You can grow flowers or weeds.", author: "Unknown" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Whether you think you can or think you can't, you're right.", author: "Henry Ford" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },

  // Creativity & Innovation
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
  { text: "The desire to create is one of the deepest yearnings of the human soul.", author: "Dieter F. Uchtdorf" },

  // Life & Purpose
  { text: "The purpose of life is a life of purpose.", author: "Robert Byrne" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Your time is limited. Don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "Life isn't about finding yourself. It's about creating yourself.", author: "George Bernard Shaw" },

  // Wisdom & Philosophy
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
];

export const AMBIENT_SOUNDS = [
  { id: 'none', name: 'None' },
  { id: 'rain', name: 'Rain' },
  { id: 'forest', name: 'Forest' },
  { id: 'cafe', name: 'Cafe' },
  { id: 'ocean', name: 'Ocean Waves' },
  { id: 'fireplace', name: 'Fireplace' },
];

export const ALARM_SOUNDS = [
  { id: 'bell', name: 'Bell' },
  { id: 'digital', name: 'Digital' },
  { id: 'gentle', name: 'Gentle' },
  { id: 'kitchen', name: 'Kitchen Timer' },
];
