'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, Sun, Moon } from 'lucide-react'
import { getGreeting, getMotivationalQuote } from '@/lib/utils'

interface HeaderProps {
  userName?: string
  onSearch?: (q: string) => void
}

export default function Header({ userName, onSearch }: HeaderProps) {
  const [query, setQuery] = useState('')
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date()) // set pertama kali di client
    const timer = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  const displayName = userName?.split(' ')[0] || 'there'

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[--bg-base]/90 backdrop-blur-md">
      <div className="flex items-center gap-4 px-6 h-14">
        {/* Greeting */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display font-600 text-[--text-primary] text-sm truncate">
              {getGreeting()}, {displayName} 
            </h2>
            <span className="text-xs text-[--text-muted] hidden sm:block">— {getMotivationalQuote()}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted]" />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search tasks..."
            className="input pl-8 pr-3 py-1.5 w-52 text-xs h-8"
          />
        </div>

        {/* Time */}
        <div className="hidden md:flex items-center gap-1 text-xs text-[--text-muted]">
          <span>{time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-white/5 transition-all">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
        </button>
      </div>
    </header>
  )
}
