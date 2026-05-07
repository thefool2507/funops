import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow, isPast, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'MMM d, yyyy')
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function isDueSoon(date?: string): boolean {
  if (!date) return false
  const d = parseISO(date)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 2)
  return d <= tomorrow && !isPast(d)
}

export function isOverdue(date?: string): boolean {
  if (!date) return false
  const d = parseISO(date)
  return isPast(d) && !isToday(d)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '…'
}

export function minutesToHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getMotivationalQuote(): string {
  const quotes = [
    'Ship it. Then improve it.',
    'Progress over perfection.',
    'One task at a time.',
    'Done is better than perfect.',
    'Focus on what matters.',
    'Make it happen.',
    'Small steps, big results.',
    'Clarity leads to productivity.',
  ]
  return quotes[Math.floor(Date.now() / 86400000) % quotes.length]
}
