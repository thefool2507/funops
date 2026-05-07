import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  emoji?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export default function EmptyState({
  icon: Icon, emoji, title, description, action, className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center px-4', className)}>
      <div className="mb-4">
        {emoji ? (
          <span className="text-4xl">{emoji}</span>
        ) : Icon ? (
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
            <Icon size={24} className="text-[--text-muted]" />
          </div>
        ) : null}
      </div>
      <h3 className="font-display font-600 text-[--text-primary] mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-[--text-muted] max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-5"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
