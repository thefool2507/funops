'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Zap, BarChart3, Timer, Layers, Shield } from 'lucide-react'

const features = [
  {
    icon: Layers,
    title: 'Kanban Board',
    desc: 'Drag & drop tasks across To Do, In Progress, and Done columns with elegant fluidity.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Timer,
    title: 'Pomodoro Timer',
    desc: 'Built-in focus timer to track your deep work sessions per task, automatically.',
    color: 'text-sage-400',
    bg: 'bg-sage-400/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Visual insights into your productivity trends, completion rates, and streak tracking.',
    color: 'text-coral-400',
    bg: 'bg-coral-400/10',
  },
  {
    icon: Zap,
    title: 'Quick Add',
    desc: 'Press ⌘K to instantly add tasks without interrupting your flow state.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data is protected with row-level security. Only you can see your tasks.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: CheckCircle2,
    title: 'Priority System',
    desc: 'Categorize by Low, Medium, High, and Critical to always work on what matters most.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
]

const stats = [
  { value: '4 views', label: 'Kanban · List · Calendar · Analytics' },
  { value: '5 categories', label: 'Work · Personal · Health · Learning · Other' },
  { value: '∞ tasks', label: 'No limits on your productivity' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 backdrop-blur-md bg-[--bg-base]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
              <span className="text-xs font-bold text-obsidian-950">F</span>
            </div>
            <span className="font-display font-700 text-lg tracking-tight text-[--text-primary]">FunOps</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link href="/signup" className="btn-primary text-sm">Get Started <ArrowRight size={14} /></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft" />
              Now in Beta — Free forever for early adopters
            </div>
            
            <h1 className="font-display text-5xl sm:text-7xl font-800 leading-[1.05] tracking-tight mb-6">
              <span className="text-[--text-primary]">Task management</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                redefined.
              </span>
            </h1>
            
            <p className="text-lg text-[--text-secondary] max-w-xl mx-auto mb-10 leading-relaxed">
              FunOps is a professional, elegant workspace for managing your daily operations. 
              Beautifully minimal, powerfully functional.
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Start for free <ArrowRight size={16} />
              </Link>
              <Link href="/dashboard" className="btn-ghost px-6 py-3 text-base border border-white/10">
                View demo
              </Link>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5"
          >
            {stats.map((s) => (
              <div key={s.value} className="bg-[--bg-card] px-8 py-6 text-center">
                <div className="font-display font-700 text-2xl text-amber-400 mb-1">{s.value}</div>
                <div className="text-xs text-[--text-muted]">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-[--text-primary] mb-4">
              Everything you need, nothing you don&apos;t.
            </h2>
            <p className="text-[--text-secondary] max-w-md mx-auto">
              Designed with focus in mind. Every feature serves your productivity, not distract it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card p-6 group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon size={18} className={f.color} />
                </div>
                <h3 className="font-display font-600 text-[--text-primary] mb-2">{f.title}</h3>
                <p className="text-sm text-[--text-secondary] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-sage-400/5" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-700 text-[--text-primary] mb-4">
                Ready to get focused?
              </h2>
              <p className="text-[--text-secondary] mb-8">
                Join thousands of professionals using FunOps to manage their daily operations.
              </p>
              <Link href="/signup" className="btn-primary px-8 py-3 text-base inline-flex">
                Create free account <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-400 flex items-center justify-center">
              <span className="text-[10px] font-bold text-obsidian-950">F</span>
            </div>
            <span className="text-sm text-[--text-muted]">FunOps © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[--text-muted] hover:text-[--text-secondary] transition-colors">Privacy</a>
            <a href="#" className="text-xs text-[--text-muted] hover:text-[--text-secondary] transition-colors">Terms</a>
            <a href="https://github.com" className="text-xs text-[--text-muted] hover:text-[--text-secondary] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
