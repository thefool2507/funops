'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Bell, Timer, Palette, Shield,
  ChevronRight, Check, LogOut, Trash2,
  ExternalLink, Sun, Moon, Monitor,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

type Section = 'profile' | 'notifications' | 'pomodoro' | 'appearance' | 'account'
type Theme = 'light' | 'dark' | 'system'

const SECTIONS: { id: Section; label: string; icon: typeof User; desc: string }[] = [
  { id: 'profile',       label: 'Profile',      icon: User,    desc: 'Name, email & avatar' },
  { id: 'pomodoro',      label: 'Focus Timer',   icon: Timer,   desc: 'Pomodoro durations' },
  { id: 'notifications', label: 'Notifications', icon: Bell,    desc: 'Alerts & reminders' },
  { id: 'appearance',    label: 'Appearance',    icon: Palette, desc: 'Theme & display' },
  { id: 'account',       label: 'Account',       icon: Shield,  desc: 'Security & data' },
]

// ─── Theme helpers ───────────────────────────────────────────────────────────
function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    prefersDark ? root.classList.add('dark') : root.classList.remove('dark')
  }
  localStorage.setItem('theme', theme)
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return (localStorage.getItem('theme') as Theme) || 'light'
}

// ─── Row component ────────────────────────────────────────────────────────────
function SettingRow({ label, desc, action }: { label: string; desc: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[--bg-subtle] border border-[--border]">
      <div>
        <p className="text-sm text-[--text-primary]">{label}</p>
        <p className="text-xs text-[--text-muted] mt-0.5">{desc}</p>
      </div>
      {action}
    </div>
  )
}

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-10 h-5 rounded-full transition-all duration-200 relative flex-shrink-0',
        enabled ? 'bg-amber-400' : 'bg-[--border-strong]'
      )}
    >
      <span className={cn(
        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200',
        enabled ? 'left-5' : 'left-0.5'
      )} />
    </button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter()
  const [active, setActive] = useState<Section>('profile')
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [name, setName] = useState('')
  const [pomoDuration, setPomoDuration] = useState(25)
  const [shortBreak, setShortBreak] = useState(5)
  const [longBreak, setLongBreak] = useState(15)
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [dailySummary, setDailySummary] = useState(false)
  const [pomodoroAlert, setPomodoroAlert] = useState(true)
  const [saving, setSaving] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')
  const [defaultView, setDefaultView] = useState('Dashboard')

  useEffect(() => {
    setTheme(getStoredTheme())
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const n = data.user.user_metadata?.full_name || ''
        setUser({ name: n, email: data.user.email || '' })
        setName(n)
      }
    })
  }, [])

  const handleThemeChange = (t: Theme) => {
    setTheme(t)
    applyTheme(t)
  }

  const saveProfile = async () => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } })
    if (error) toast.error(error.message)
    else {
      toast.success('Profile updated!')
      setUser((u) => u ? { ...u, name } : null)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const THEMES: { id: Theme; label: string; icon: typeof Sun }[] = [
    { id: 'light',  label: 'Light',  icon: Sun },
    { id: 'dark',   label: 'Dark',   icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[--text-primary]">Settings</h1>
        <p className="text-sm text-[--text-secondary] mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0">
          <div className="space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group',
                  active === s.id
                    ? 'bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-400/20'
                    : 'text-[--text-muted] hover:text-[--text-secondary] hover:bg-[--bg-subtle]'
                )}
              >
                <s.icon size={14} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium">{s.label}</div>
                </div>
                <ChevronRight size={12} className={cn(
                  'transition-opacity',
                  active === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                )} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 card p-6">

          {/* ── Profile ── */}
          {active === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h2 className="font-display font-semibold text-[--text-primary] mb-1">Profile</h2>
                <p className="text-xs text-[--text-muted]">Update your personal information</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/15 flex items-center justify-center text-2xl border border-amber-400/20 text-amber-600 dark:text-amber-400 font-bold">
                  {name ? name[0].toUpperCase() : '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-[--text-primary]">{user?.name || 'No name set'}</p>
                  <p className="text-xs text-[--text-muted]">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[--text-secondary] mb-1.5">Display name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs text-[--text-secondary] mb-1.5">Email</label>
                  <input type="email" value={user?.email || ''} disabled className="input opacity-50 cursor-not-allowed" />
                  <p className="text-[10px] text-[--text-muted] mt-1">Email cannot be changed here</p>
                </div>
              </div>

              <button onClick={saveProfile} disabled={saving} className="btn-primary">
                {saving
                  ? <span className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                  : <><Check size={13} /> Save changes</>
                }
              </button>
            </motion.div>
          )}

          {/* ── Focus Timer ── */}
          {active === 'pomodoro' && (
            <motion.div key="pomodoro" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h2 className="font-display font-semibold text-[--text-primary] mb-1">Focus Timer</h2>
                <p className="text-xs text-[--text-muted]">Customize your Pomodoro session durations</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Focus session', value: pomoDuration, set: setPomoDuration, hint: 'Default: 25 min', min: 5, max: 90 },
                  { label: 'Short break',   value: shortBreak,   set: setShortBreak,   hint: 'Default: 5 min',  min: 1, max: 30 },
                  { label: 'Long break',    value: longBreak,    set: setLongBreak,    hint: 'Default: 15 min', min: 5, max: 60 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-[--text-secondary]">{item.label}</label>
                      <span className="font-mono text-sm text-amber-600 dark:text-amber-400">{item.value} min</span>
                    </div>
                    <input
                      type="range" min={item.min} max={item.max} value={item.value}
                      onChange={(e) => item.set(Number(e.target.value))}
                      className="w-full accent-amber-400 h-1.5"
                    />
                    <p className="text-[10px] text-[--text-muted] mt-1">{item.hint}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => toast.success('Timer settings saved!')} className="btn-primary">
                <Check size={13} /> Save settings
              </button>
            </motion.div>
          )}

          {/* ── Notifications ── */}
          {active === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h2 className="font-display font-semibold text-[--text-primary] mb-1">Notifications</h2>
                <p className="text-xs text-[--text-muted]">Configure alerts and reminders</p>
              </div>
              <div className="space-y-3">
                <SettingRow label="Task due reminders" desc="Get notified when tasks are due soon"
                  action={<Toggle enabled={notifEnabled} onToggle={() => setNotifEnabled(!notifEnabled)} />} />
                <SettingRow label="Daily summary" desc="Morning summary of your tasks"
                  action={<Toggle enabled={dailySummary} onToggle={() => setDailySummary(!dailySummary)} />} />
                <SettingRow label="Pomodoro alerts" desc="Sound when focus session ends"
                  action={<Toggle enabled={pomodoroAlert} onToggle={() => setPomodoroAlert(!pomodoroAlert)} />} />
              </div>
            </motion.div>
          )}

          {/* ── Appearance ── */}
          {active === 'appearance' && (
            <motion.div key="appearance" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <h2 className="font-display font-semibold text-[--text-primary] mb-1">Appearance</h2>
                <p className="text-xs text-[--text-muted]">Customize how FunOps looks</p>
              </div>

              {/* Theme selector */}
              <div>
                <label className="block text-xs text-[--text-secondary] mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => handleThemeChange(id)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                        theme === id
                          ? 'border-amber-400/40 bg-amber-400/8 text-amber-600 dark:text-amber-400'
                          : 'border-[--border] hover:border-[--border-strong] text-[--text-muted] hover:text-[--text-secondary]'
                      )}
                    >
                      {/* Preview box */}
                      <div className={cn(
                        'w-10 h-7 rounded-lg border flex items-end overflow-hidden',
                        id === 'light'  ? 'bg-stone-100 border-stone-200' :
                        id === 'dark'   ? 'bg-stone-950 border-stone-800' :
                                          'border-[--border]'
                      )}>
                        {id === 'system' && (
                          <>
                            <div className="w-1/2 h-full bg-stone-100" />
                            <div className="w-1/2 h-full bg-stone-950" />
                          </>
                        )}
                      </div>
                      <span className="text-xs font-medium">{label}</span>
                      {theme === id && (
                        <span className="text-[9px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                          <Check size={9} /> Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent color */}
              <div>
                <label className="block text-xs text-[--text-secondary] mb-2">Accent color</label>
                <div className="flex gap-2">
                  {['#d97706', '#16a34a', '#2563eb', '#db2777', '#7c3aed'].map((c, i) => (
                    <button key={c}
                      className={cn(
                        'w-7 h-7 rounded-full border-2 transition-all',
                        i === 0 ? 'border-[--text-primary] scale-110' : 'border-transparent opacity-60 hover:opacity-90 hover:scale-105'
                      )}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Default view */}
              <div>
                <label className="block text-xs text-[--text-secondary] mb-2">Default view</label>
                <div className="flex gap-2">
                  {['Dashboard', 'Kanban', 'List'].map((v) => (
                    <button key={v}
                      onClick={() => setDefaultView(v)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs transition-all',
                        defaultView === v
                          ? 'bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-400/20'
                          : 'text-[--text-muted] hover:bg-[--bg-subtle] border border-transparent'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Account ── */}
          {active === 'account' && (
            <motion.div key="account" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h2 className="font-display font-semibold text-[--text-primary] mb-1">Account</h2>
                <p className="text-xs text-[--text-muted]">Manage your account security and data</p>
              </div>

              <div className="space-y-2">
                <SettingRow
                  label="Export data"
                  desc="Download all your tasks as JSON"
                  action={
                    <button className="btn-ghost text-xs border border-[--border]">
                      <ExternalLink size={12} /> Export
                    </button>
                  }
                />
                <SettingRow
                  label="Change password"
                  desc="Update your login password"
                  action={
                    <button
                      onClick={async () => {
                        const supabase = createClient()
                        const { data } = await supabase.auth.getUser()
                        if (data.user?.email) {
                          await supabase.auth.resetPasswordForEmail(data.user.email)
                          toast.success('Password reset email sent!')
                        }
                      }}
                      className="btn-ghost text-xs border border-[--border]"
                    >
                      Send reset email
                    </button>
                  }
                />
              </div>

              <div className="pt-2 border-t border-[--border] space-y-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm text-[--text-secondary] hover:bg-[--bg-subtle] hover:text-[--text-primary] transition-all"
                >
                  <LogOut size={14} /> Sign out of FunOps
                </button>
                <button
                  onClick={() => toast('Account deletion — coming soon', { icon: '⚠️' })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm text-rose-500/70 hover:bg-rose-500/8 hover:text-rose-500 transition-all"
                >
                  <Trash2 size={14} /> Delete account
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  )
}