'use client'

import toast from 'react-hot-toast'
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'

export const notify = {
  success: (msg: string) =>
    toast.custom(
      (t) => (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/8 bg-[--bg-card] shadow-lg transition-all ${
            t.visible ? 'animate-slide-up' : 'opacity-0'
          }`}
        >
          <CheckCircle2 size={15} className="text-sage-400 flex-shrink-0" />
          <span className="text-sm text-[--text-primary]">{msg}</span>
        </div>
      ),
      { duration: 3000 }
    ),

  error: (msg: string) =>
    toast.custom(
      (t) => (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/8 bg-[--bg-card] shadow-lg ${
            t.visible ? 'animate-slide-up' : 'opacity-0'
          }`}
        >
          <XCircle size={15} className="text-coral-400 flex-shrink-0" />
          <span className="text-sm text-[--text-primary]">{msg}</span>
        </div>
      ),
      { duration: 4000 }
    ),

  warning: (msg: string) =>
    toast.custom(
      (t) => (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border border-amber-400/15 bg-amber-400/5 shadow-lg ${
            t.visible ? 'animate-slide-up' : 'opacity-0'
          }`}
        >
          <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
          <span className="text-sm text-amber-300">{msg}</span>
        </div>
      ),
      { duration: 4000 }
    ),

  info: (msg: string) =>
    toast.custom(
      (t) => (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/8 bg-[--bg-card] shadow-lg ${
            t.visible ? 'animate-slide-up' : 'opacity-0'
          }`}
        >
          <Info size={15} className="text-blue-400 flex-shrink-0" />
          <span className="text-sm text-[--text-primary]">{msg}</span>
        </div>
      ),
      { duration: 3000 }
    ),
}
