'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export default function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirm',
  onConfirm, onCancel, danger = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="card p-6 w-full max-w-sm shadow-modal">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  danger ? 'bg-coral-400/10' : 'bg-amber-400/10'
                }`}>
                  <AlertTriangle size={16} className={danger ? 'text-coral-400' : 'text-amber-400'} />
                </div>
                <div>
                  <h3 className="font-display font-600 text-[--text-primary]">{title}</h3>
                  <p className="text-xs text-[--text-secondary] mt-1 leading-relaxed">{message}</p>
                </div>
                <button
                  onClick={onCancel}
                  className="ml-auto w-6 h-6 rounded-md flex items-center justify-center text-[--text-muted] hover:text-[--text-primary] hover:bg-white/5"
                >
                  <X size={13} />
                </button>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={onCancel} className="btn-ghost text-sm">Cancel</button>
                <button
                  onClick={() => { onConfirm(); onCancel() }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                    danger
                      ? 'bg-coral-400 text-white hover:bg-coral-300'
                      : 'bg-amber-400 text-obsidian-950 hover:bg-amber-300'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
