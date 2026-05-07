'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export type TimerMode = 'focus' | 'short_break' | 'long_break'

export const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
}

export function usePomodoro(onComplete?: (mode: TimerMode, minutes: number) => void) {
  const [mode, setMode] = useState<TimerMode>('focus')
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const reset = useCallback(() => {
    setRunning(false)
    setTimeLeft(TIMER_DURATIONS[mode])
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [mode])

  useEffect(() => { reset() }, [mode, reset])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setRunning(false)
          if (mode === 'focus') {
            setSessions(s => s + 1)
            onComplete?.(mode, 25)
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode, onComplete])

  const toggle = () => setRunning(r => !r)
  const switchMode = (m: TimerMode) => { setMode(m); setRunning(false) }

  const progress = ((TIMER_DURATIONS[mode] - timeLeft) / TIMER_DURATIONS[mode]) * 100
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const seconds = (timeLeft % 60).toString().padStart(2, '0')
  const display = `${minutes}:${seconds}`

  return { mode, timeLeft, running, sessions, progress, display, toggle, reset, switchMode }
}
