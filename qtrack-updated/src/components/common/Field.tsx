import type { ReactNode, ComponentType, ChangeEvent } from "react"
import { ChevronDown } from "lucide-react"
import { Text } from "./Text"

export interface FieldProps {
  label?: string
  placeholder?: string
  icon?: ComponentType<{ size?: number; className?: string }>
  value?: string
  defaultValue?: string
  type?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
  className?: string
}

export function Field({
  label,
  placeholder,
  icon: Icon,
  value,
  defaultValue,
  type = "text",
  onChange,
  disabled = false,
  required = false,
  className = "",
}: FieldProps) {
  return (
    <label className={`field-wrap ${className}`}>
      {label && (
        <Text size="sm" weight="medium">
          {label} {required && <span className="text-danger">*</span>}
        </Text>
      )}
      <div className="field">
        {Icon && <Icon size={19} />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
        />
      </div>
    </label>
  )
}

export interface SelectFieldProps {
  label: string
  children: ReactNode
  value?: string
  defaultValue?: string
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
  disabled?: boolean
  className?: string
}

export function SelectField({
  label,
  children,
  value,
  defaultValue,
  onChange,
  disabled = false,
  className = "",
}: SelectFieldProps) {
  return (
    <label className={`field-wrap ${className}`}>
      <Text size="sm" weight="medium">
        {label}
      </Text>
      <div className="field">
        <select
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
        >
          {children}
        </select>
        <ChevronDown size={18} />
      </div>
    </label>
  )
}

export interface TextAreaProps {
  label?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
  className?: string
}

export function TextArea({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  className = "",
}: TextAreaProps) {
  return (
    <label className={`field-wrap ${className}`}>
      {label && (
        <Text size="sm" weight="medium">
          {label}
        </Text>
      )}
      <textarea
        className="textarea"
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </label>
  )
}
