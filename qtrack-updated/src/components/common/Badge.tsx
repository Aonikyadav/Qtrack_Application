const statusClass: Record<string, string> = {
  Waiting: 'blue',
  'Window open': 'amber',
  'Checked in': 'green',
  Called: 'teal',
  'In consultation': 'purple',
  Done: 'gray',
  Skipped: 'coral',
  Removed: 'red',
  Priority: 'orange',
  Emergency: 'red',
}

export interface BadgeProps {
  children: string
  dot?: boolean
  className?: string
}

export function Badge({ children, dot = true, className = '' }: BadgeProps) {
  const tone = statusClass[children] || 'gray'
  return (
    <span className={`badge badge-${tone} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  )
}
