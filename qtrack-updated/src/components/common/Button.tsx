import type { ReactNode, ComponentType, CSSProperties } from "react"

export interface ButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "danger" | "ghost"
  icon?: ComponentType<{
    size?: number
    strokeWidth?: number
    className?: string
  }>
  onClick?: () => void
  full?: boolean
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  className?: string
  style?: CSSProperties
  title?: string
}

export function Button({
  children,
  variant = "primary",
  icon: Icon,
  onClick,
  full = false,
  disabled = false,
  type = "button",
  className = "",
  style,
  title,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`button button-${variant} ${
        full ? "button-full" : ""
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={title}
    >
      {Icon && <Icon size={18} strokeWidth={2} />}
      {children}
    </button>
  )
}

export interface ButtonIconProps {
  size?: number
  strokeWidth?: number
  className?: string
}

export interface IconButtonProps {
  icon: ComponentType<ButtonIconProps>
  label: string
  onClick?: () => void
  className?: string
  style?: CSSProperties
  title?: string
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  className = "",
  style,
  title,
}: IconButtonProps) {
  return (
    <button
      className={`icon-button ${className}`}
      aria-label={label}
      onClick={onClick}
      style={style}
      title={title || label}
    >
      <Icon size={20} />
    </button>
  )
}
