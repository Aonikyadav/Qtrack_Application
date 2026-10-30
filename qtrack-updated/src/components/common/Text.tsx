import type { ReactNode, CSSProperties } from "react"

export interface TextProps {
  children: ReactNode
  tone?: "default" | "muted" | "teal" | "danger" | "inverse"
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "display"
  weight?: "regular" | "medium" | "semibold" | "bold"
  className?: string
  style?: CSSProperties
}

export function Text({
  children,
  tone = "default",
  size = "md",
  weight = "regular",
  className = "",
  style,
}: TextProps) {
  return (
    <div
      className={`text text-${tone} text-${size} weight-${weight} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
