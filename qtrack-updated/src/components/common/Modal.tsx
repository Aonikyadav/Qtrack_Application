import type { ReactNode } from "react"
import { X } from "lucide-react"
import { IconButton } from "./Button"
import { Text } from "./Text"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  maxWidth?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "520px",
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(17, 24, 39, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth,
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #dfe5e3",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #dfe5e3",
          }}
        >
          <div>
            <Text size="xl" weight="bold">
              {title}
            </Text>
            {subtitle && <Text tone="muted">{subtitle}</Text>}
          </div>
          <IconButton icon={X} label="Close dialog" onClick={onClose} />
        </div>
        <div style={{ padding: "24px", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  )
}
