import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  HeartPulse,
  History,
  Home,
  Languages,
  LayoutDashboard,
  ListChecks,
  LocateFixed,
  LogOut,
  Menu,
  Phone,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  UserRound,
  UserRoundPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"
import type { Role } from "../../types"
import { useQueue } from "../../context/QueueContext"
import { IconButton } from "../common/Button"
import { Text } from "../common/Text"

export const rolePages: Record<Role, string[]> = {
  "Style guide": ["Foundations"],
  Components: ["Library"],
  Patient: [
    "Home",
    "Find a doctor",
    "Doctor profile",
    "Join queue",
    "My queue",
    "QR check-in",
    "Called",
    "Notices",
    "History",
    "Profile",
    "Login & OTP",
  ],
  Receptionist: [
    "Live queue",
    "Quick walk-in",
    "Arrivals",
    "Activity log",
    "Staff login",
  ],
  Doctor: ["Overview", "Live queue", "Consultation", "Completed visits"],
  Admin: ["Clinic settings", "People", "Analytics"],
  Display: ["Token board"],
}

export const roleIcons: Record<Role, LucideIcon> = {
  "Style guide": Sparkles,
  Components: LayoutDashboard,
  Patient: UserRound,
  Receptionist: ClipboardList,
  Doctor: Stethoscope,
  Admin: Settings,
  Display: Activity,
}

export const pageIcons: Record<string, LucideIcon> = {
  Home,
  "Find a doctor": Search,
  "Doctor profile": User,
  "Join queue": UserRoundPlus,
  "My queue": ListChecks,
  "QR check-in": QrCode,
  Called: Bell,
  Notices: AlertCircle,
  History,
  Profile: UserRound,
  "Login & OTP": Phone,
  "Live queue": ListChecks,
  "Quick walk-in": UserRoundPlus,
  Arrivals: LocateFixed,
  "Activity log": Activity,
  "Staff login": ShieldCheck,
  Overview: Home,
  Consultation: Stethoscope,
  "Completed visits": CheckCircle2,
  "Clinic settings": Settings,
  People: Users,
  Analytics: Activity,
  Foundations: Sparkles,
  Library: LayoutDashboard,
  "Token board": Activity,
}

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="logo">
      <span className={`logo-mark ${inverse ? "logo-mark-inverse" : ""}`}>
        <HeartPulse size={21} />
      </span>
      <Text size="lg" weight="bold" tone={inverse ? "inverse" : "default"}>
        QTrack
      </Text>
    </div>
  )
}

export function AppHeader({ mobileMenu }: { mobileMenu: () => void }) {
  const { patient, setShowLanding } = useQueue()
  const todayStr = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)

  return (
    <div className="app-header">
      <div className="header-mobile">
        <IconButton icon={Menu} label="Open menu" onClick={mobileMenu} />
      </div>
      <div>
        <Text weight="semibold">Aarogya Family Clinic</Text>
        <Text size="sm" tone="muted">
          {todayStr}
        </Text>
      </div>
      <div className="header-actions">
        <button className="language" type="button">
          <Languages size={17} /> {patient.preferredLanguage}{" "}
          <ChevronDown size={15} />
        </button>
        <IconButton icon={Bell} label="Notifications" />
        <span
          className="avatar"
          style={{ cursor: "pointer" }}
          title={`Signed in as ${patient.name}`}
          onClick={() => setShowLanding(true)}
        >
          {initials || "PS"}
        </span>
      </div>
    </div>
  )
}

export function Sidebar({ close }: { close?: () => void }) {
  const { role, page, setPage, setShowLanding } = useQueue()

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <Logo />
        {close && <IconButton icon={X} label="Close menu" onClick={close} />}
      </div>
      <Text size="xs" tone="muted" weight="semibold" className="sidebar-label">
        {role.toUpperCase()} SPACE
      </Text>
      <nav className="side-nav">
        {rolePages[role].map((item) => {
          const Icon = pageIcons[item] || Home
          return (
            <button
              key={item}
              type="button"
              className={`nav-item ${page === item ? "nav-active" : ""}`}
              onClick={() => {
                setPage(item)
                close?.()
              }}
            >
              <Icon size={19} /> <span>{item}</span>
            </button>
          )
        })}
      </nav>
      <div className="sidebar-foot">
        <div className="help-card">
          <ShieldCheck size={20} />
          <Text size="sm" weight="semibold">
            Need assistance?
          </Text>
          <Text size="xs" tone="muted">
            Call clinic support: +91 80 4455 6677
          </Text>
        </div>
        <button
          className="nav-item"
          type="button"
          onClick={() => {
            setShowLanding(true)
            close?.()
          }}
        >
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </aside>
  )
}

export function PatientBottomNav() {
  const { page, setPage } = useQueue()
  const items: [string, LucideIcon][] = [
    ["Home", Home],
    ["My queue", ListChecks],
    ["History", History],
    ["Profile", UserRound],
  ]

  return (
    <div className="bottom-nav">
      {items.map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          className={page === name ? "bottom-active" : ""}
          onClick={() => setPage(name)}
        >
          <Icon size={21} />
          <span>{name}</span>
        </button>
      ))}
    </div>
  )
}

export function PrototypeBar() {
  const { role, setRole, setPage, setShowLanding } = useQueue()
  const RoleIcon = roleIcons[role] || Sparkles

  const handleRoleChange = (r: Role) => {
    setRole(r)
    setPage(rolePages[r][0])
  }

  return (
    <div className="prototype-bar">
      <div className="prototype-title">
        <Sparkles size={16} />
        <span>QTrack UI Kit</span>
        <span className="prototype-divider" />
        <RoleIcon size={16} />
        <strong>{role}</strong>
        <button
          className="q-back-home"
          type="button"
          onClick={() => setShowLanding(true)}
        >
          <ArrowLeft size={14} /> Public site
        </button>
      </div>
      <div className="role-switcher">
        <button
          className="q-role-home"
          type="button"
          onClick={() => setShowLanding(true)}
        >
          Landing
        </button>
        {(Object.keys(rolePages) as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => handleRoleChange(r)}
            className={role === r ? "role-active" : ""}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}
