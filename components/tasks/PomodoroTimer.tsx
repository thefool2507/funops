'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Coffee, Brain, Check } from 'lucide-react'
import { cn, minutesToHours } from '@/lib/utils'

type TimerMode = 'focus' | 'short_break' | 'long_break'

const MODES: Record<TimerMode, { label: string; duration: number; color: string; icon: typeof Brain }> = {
  focus: { label: 'Focus', duration: 25 * 60, color: 'text-amber-400', icon: Brain },
  short_break: { label: 'Short Break', duration: 5 * 60, color: 'text-sage-400', icon: Coffee },
  long_break: { label: 'Long Break', duration: 15 * 60, color: 'text-blue-400', icon: Coffee },
}

interface PomodoroTimerProps {
  taskTitle?: string
  onSessionComplete?: (minutes: number) => void
  compact?: boolean
}

export default function PomodoroTimer({ taskTitle, onSessionComplete, compact = false }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus')
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)

  const currentMode = MODES[mode]
  const total = currentMode.duration
  const progress = (timeLeft / total) * 100
  const circumference = 2 * Math.PI * 54 // radius = 54

  const reset = useCallback(() => {
    setRunning(false)
    setTimeLeft(MODES[mode].duration)
  }, [mode])

  useEffect(() => {
    reset()
  }, [mode, reset])

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) {
      setRunning(false)
      if (mode === 'focus') {
        setSessions(s => s + 1)
        onSessionComplete?.(25)
      }
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [running, timeLeft, mode, onSessionComplete])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
        <div className={cn('text-xs font-mono font-medium', currentMode.color)}>{formatTime(timeLeft)}</div>
        <button onClick={() => setRunning(!running)} className={cn('w-5 h-5 rounded-full flex items-center justify-center transition-all', currentMode.color)}>
          {running ? <Pause size={10} /> : <Play size={10} />}
        </button>
        <button onClick={reset} className="w-5 h-5 rounded-full flex items-center justify-center text-[--text-muted] hover:text-[--text-secondary]">
          <RotateCcw size={9} />
        </button>
      </div>
    )
  }

  return (
    <div className="card p-8 text-center max-w-sm mx-auto">
      {/* Mode selector */}
      <div className="flex items-center justify-center gap-1 mb-8 p-1 rounded-xl bg-white/5">
        {(Object.keys(MODES) as TimerMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 py-1.5 rounded-lg text-xs font-medium transition-all',
              mode === m ? 'bg-white/10 text-[--text-primary]' : 'text-[--text-muted] hover:text-[--text-secondary]'
            )}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="relative flex items-center justify-center mb-8">
        <svg width="140" height="140" className="-rotate-90">
          {/* Track */}
          <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          {/* Progress */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={cn('transition-all duration-1000', currentMode.color)}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn('font-mono text-4xl font-500 tabular-nums', currentMode.color)}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-[10px] text-[--text-muted] mt-1">{currentMode.label}</div>
        </div>
      </div>

      {/* Task name */}
      {taskTitle && (
        <div className="mb-6 px-4 py-2 rounded-lg bg-white/5 text-xs text-[--text-secondary] truncate">
          🎯 {taskTitle}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button onClick={reset} className="w-10 h-10 rounded-full flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-white/8 transition-all">
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => setRunning(!running)}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200',
            'bg-amber-400 text-obsidian-950 hover:bg-amber-300 active:scale-95 shadow-glow-amber'
          )}
        >
          {running ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <span className="text-xs text-[--text-muted] font-mono">{sessions}x</span>
        </div>
      </div>

      {/* Sessions */}
      <div className="flex items-center justify-center gap-1.5">
        {[1,2,3,4].map(i => (
          <div key={i} className={cn(
            'w-2 h-2 rounded-full transition-all',
            i <= (sessions % 4) ? 'bg-amber-400' : 'bg-white/10'
          )} />
        ))}
        {sessions > 0 && (
          <span className="text-[10px] text-[--text-muted] ml-2">{sessions} session{sessions !== 1 ? 's' : ''} today</span>
        )}
      </div>
    </div>
  )
}
