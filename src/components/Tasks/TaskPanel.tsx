import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Trash2, Circle, CheckCircle2, Edit2 } from 'lucide-react';
import { useTasks, useTimer } from '../../contexts';
import { TASK_COLORS } from '../../types';

interface TaskPanelProps {
  isOpen?: boolean;
  onClose: () => void;
}

const PRESET_TASKS = [
  { title: 'Coding', color: '#3b82f6' },
  { title: 'Language Study', color: '#22c55e' },
  { title: 'Content Creation', color: '#f97316' },
  { title: 'Course Study', color: '#8b5cf6' },
  { title: 'Gaming', color: '#ec4899' },
  { title: 'Watch', color: '#06b6d4' },
];

export function TaskPanel({ isOpen = true, onClose }: TaskPanelProps) {
  const { tasks, addTask, toggleTaskComplete, deleteTask, clearCompletedTasks, updateTask } = useTasks();
  const { currentTaskId, setCurrentTaskId } = useTimer();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [newTaskColor, setNewTaskColor] = useState(TASK_COLORS[0]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingColor, setEditingColor] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), newTaskPomodoros, newTaskColor);
      setNewTaskTitle('');
      setNewTaskPomodoros(1);
      setNewTaskColor(TASK_COLORS[0]);
    }
  };

  const incompleteTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              maxHeight: '75vh',
              background: '#0c0c0c',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <h2 style={{ color: '#ffffff', fontSize: '17px', fontWeight: 600 }}>Tasks</h2>
              <button
                type="button"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#888888',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Add Task */}
            <form onSubmit={handleAddTask} style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="What are you working on?"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.06)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    background: newTaskTitle.trim() ? newTaskColor : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '12px',
                    color: newTaskTitle.trim() ? '#ffffff' : '#666666',
                    cursor: newTaskTitle.trim() ? 'pointer' : 'not-allowed',
                    outline: 'none',
                  }}
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Color selection */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                <span style={{ color: '#444444', fontSize: '12px' }}>Color:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {TASK_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewTaskColor(color)}
                      style={{
                        width: '20px',
                        height: '20px',
                        background: color,
                        border: newTaskColor === color ? '2px solid #ffffff' : '2px solid transparent',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'transform 0.1s ease',
                        transform: newTaskColor === color ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Preset Tasks */}
              <div style={{ marginTop: '12px' }}>
                <span style={{ color: '#444444', fontSize: '12px' }}>Quick add:</span>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {PRESET_TASKS.map(preset => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => {
                        addTask(preset.title, 1, preset.color);
                      }}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${preset.color}40`,
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${preset.color}20`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      }}
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

            </form>

            {/* Task List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {tasks.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <p style={{ color: '#444444', fontSize: '14px' }}>No tasks yet</p>
                  <p style={{ color: '#333333', fontSize: '12px', marginTop: '4px' }}>Add a task to get started</p>
                </div>
              ) : (
                <>
                  {/* Incomplete Tasks */}
                  {incompleteTasks.map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setCurrentTaskId(currentTaskId === task.id ? null : task.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 24px',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        background: currentTaskId === task.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                        borderLeft: `3px solid ${task.color}`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); toggleTaskComplete(task.id); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '22px',
                          height: '22px',
                          background: 'transparent',
                          border: `2px solid ${task.color}`,
                          borderRadius: '50%',
                          color: task.color,
                          cursor: 'pointer',
                          outline: 'none',
                          flexShrink: 0,
                        }}
                      >
                        <Circle size={12} style={{ opacity: 0 }} />
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {editingTaskId === task.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={e => setEditingTitle(e.target.value)}
                              onBlur={() => {
                                if (editingTitle.trim()) {
                                  updateTask(task.id, { title: editingTitle.trim(), color: editingColor });
                                }
                                setEditingTaskId(null);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  if (editingTitle.trim()) {
                                    updateTask(task.id, { title: editingTitle.trim(), color: editingColor });
                                  }
                                  setEditingTaskId(null);
                                } else if (e.key === 'Escape') {
                                  setEditingTaskId(null);
                                }
                              }}
                              onClick={e => e.stopPropagation()}
                              autoFocus
                              style={{
                                width: '100%',
                                padding: '4px 8px',
                                background: 'rgba(255,255,255,0.06)',
                                border: `1px solid ${editingColor}`,
                                borderRadius: '6px',
                                color: '#ffffff',
                                fontSize: '14px',
                                outline: 'none',
                              }}
                            />
                            <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                              {TASK_COLORS.map(color => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setEditingColor(color);
                                  }}
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    background: color,
                                    border: editingColor === color ? '2px solid #ffffff' : '2px solid transparent',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: 'transform 0.1s ease',
                                    transform: editingColor === color ? 'scale(1.2)' : 'scale(1)',
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p style={{ color: '#ffffff', fontSize: '14px' }}>{task.title}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setEditingTaskId(task.id);
                          setEditingTitle(task.title);
                          setEditingColor(task.color);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#444444',
                          cursor: 'pointer',
                          padding: '4px',
                          outline: 'none',
                        }}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#333333',
                          cursor: 'pointer',
                          padding: '4px',
                          outline: 'none',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}

                  {/* Completed Tasks */}
                  {completedTasks.length > 0 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 8px' }}>
                        <span style={{ color: '#444444', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Completed ({completedTasks.length})
                        </span>
                        <button
                          type="button"
                          onClick={clearCompletedTasks}
                          style={{ background: 'none', border: 'none', color: '#444444', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                        >
                          Clear
                        </button>
                      </div>
                      {completedTasks.map(task => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 24px',
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => toggleTaskComplete(task.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'none',
                              border: 'none',
                              color: '#00d26a',
                              cursor: 'pointer',
                              padding: 0,
                              outline: 'none',
                            }}
                          >
                            <CheckCircle2 size={22} />
                          </button>
                          <span style={{ flex: 1, color: '#444444', fontSize: '14px', textDecoration: 'line-through' }}>
                            {task.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#333333',
                              cursor: 'pointer',
                              padding: '4px',
                              outline: 'none',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Current Task */}
            {currentTaskId && (
              <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#00d26a" />
                  <span style={{ color: '#666666', fontSize: '13px' }}>
                    Working on: <span style={{ color: '#ffffff' }}>{tasks.find(t => t.id === currentTaskId)?.title}</span>
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
