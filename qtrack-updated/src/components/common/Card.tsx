import type { ReactNode, CSSProperties } from "react"

export interface CardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
  hoverable?: boolean
}

export function Card({
  children,
  className = "",
  style,
  onClick,
  hoverable = false,
}: CardProps) {
  const isInteractive = Boolean(onClick) || hoverable
  return (
    <div
      className={`card ${isInteractive ? "card-interactive" : ""} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
