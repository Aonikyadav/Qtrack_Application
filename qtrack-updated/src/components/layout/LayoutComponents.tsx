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
  PanelLeftClose,
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
  Volume2,
  X,
  type LucideIcon,
} from "lucide-react"
import type { ActivePortal } from "../../types"
import { useQueue } from "../../context/QueueContext"
import { Button, IconButton } from "../common/Button"
import { Text } from "../common/Text"

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

import { useState, useRef, useEffect } from "react"

// ==========================================
// REUSABLE HEADER USER AVATAR & DROPDOWN MENU
// ==========================================
export interface UserMenuDropdownProps {
  name: string
  initials: string
  roleBadge: string
  subtext?: string
  accentColor?: string
  onProfileClick: () => void
  onSignOutClick: () => void
}

export function UserMenuDropdown({
  name,
  initials,
  roleBadge,
  subtext,
  accentColor = "#0f766e",
  onProfileClick,
  onSignOutClick,
}: UserMenuDropdownProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  return (
    <div
      ref={menuRef}
      className="user-menu-wrap"
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* Clickable Avatar Circle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`User menu for ${name}`}
        aria-expanded={open}
        className="user-avatar-btn"
        style={{
          width: "38px",
          height: "38px",
          minWidth: "38px",
          minHeight: "38px",
          borderRadius: "50%",
          background: accentColor,
          color: "#ffffff",
          border: open ? "2px solid #0f766e" : "2px solid transparent",
          boxShadow: open
            ? "0 0 0 3px rgba(15, 118, 110, 0.25)"
            : "0 1px 4px rgba(0,0,0,0.1)",
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          fontSize: "13px",
          cursor: "pointer",
          transition: "all 0.15s ease",
          outline: "none",
        }}
        title={`Click for Profile & Sign out (${name})`}
      >
        {initials}
      </button>

      {/* Dropdown Menu Popover */}
      {open && (
        <div
          className="user-menu-popover"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "250px",
            maxWidth: "calc(100vw - 24px)",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 10px 25px -4px rgba(15, 23, 42, 0.18), 0 4px 10px -2px rgba(15, 23, 42, 0.08)",
            zIndex: 1000,
            overflow: "hidden",
            animation:
              "modalDialogSpring 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            transformOrigin: "top right",
          }}
        >
          {/* Header section with user info */}
          <div
            style={{
              padding: "12px 14px",
              background: "#f8fafc",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: accentColor,
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  fontSize: "12px",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#0f172a",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    fontWeight: 600,
                    marginTop: "1px",
                  }}
                >
                  {roleBadge}
                </div>
              </div>
            </div>
            {subtext && (
              <div
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginTop: "6px",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {subtext}
              </div>
            )}
          </div>

          {/* Action List */}
          <div style={{ padding: "6px" }}>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onProfileClick()
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "8px",
                background: "transparent",
                border: "none",
                color: "#1e293b",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f1f5f9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <UserRound size={16} color="#0f766e" />
              <span>Profile</span>
            </button>

            <div
              style={{ height: "1px", background: "#f1f5f9", margin: "4px 0" }}
            />

            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onSignOutClick()
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "8px",
                background: "transparent",
                border: "none",
                color: "#b91c1c",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fef2f2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <LogOut size={16} color="#b91c1c" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 1. PATIENT DASHBOARD LAYOUT
// ==========================================

export function PatientHeader({ mobileMenu }: { mobileMenu: () => void }) {
  const { patient, patientLogout, setPatientPage, toggleSidebar } = useQueue()
  const todayStr = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })

  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="app-header">
      <div className="header-title-group">
        <div className="header-mobile">
          <IconButton
            icon={Menu}
            label="Toggle navigation"
            onClick={mobileMenu || toggleSidebar}
          />
        </div>
        <div className="header-title-text">
          <Text weight="semibold" className="header-main-title">
            Aarogya Family Clinic
          </Text>
          <Text size="sm" tone="muted" className="header-subtitle">
            {todayStr} · Patient Portal
          </Text>
        </div>
      </div>
      <div className="header-actions">
        {/* Patient ID Pill */}
        <div
          className="header-badge-pill"
          title={`Patient Identifier: ${patient.id} · Referral: ${patient.referralId}`}
        >
          <span>ID: {patient.id}</span>
        </div>

        <button className="language" type="button">
          <Languages size={17} /> {patient.preferredLanguage}{" "}
          <ChevronDown size={15} />
        </button>

        {/* Profile Avatar Popover Menu */}
        <UserMenuDropdown
          name={patient.name}
          initials={initials}
          roleBadge={`Patient · ${patient.id}`}
          subtext={`Phone: ${patient.phone} · Ref: ${patient.referralId}`}
          accentColor="#0f766e"
          onProfileClick={() => setPatientPage("Profile")}
          onSignOutClick={patientLogout}
        />
      </div>
    </div>
  )
}

export function PatientSidebar({ close }: { close?: () => void }) {
  const { patient, patientPage, setPatientPage, setSidebarOpen } = useQueue()

  // Removed 'Profile' and 'Sign out' from sidebar per user instructions
  const navItems: [string, LucideIcon][] = [
    ["Home", Home],
    ["Find a doctor", Search],
    ["My queue", ListChecks],
    ["QR check-in", QrCode],
    ["History", History],
  ]

  const handleClose = () => {
    if (close) close()
    setSidebarOpen(false)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <Logo />
        <IconButton
          icon={PanelLeftClose}
          label="Collapse sidebar"
          onClick={handleClose}
        />
      </div>

      <div style={{ padding: "0 8px 12px" }}>
        <Text size="xs" tone="teal" weight="bold">
          PATIENT PORTAL
        </Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "4px",
          }}
        >
          <Text size="sm" weight="bold">
            {patient.name}
          </Text>
          <span
            style={{
              fontSize: "11px",
              background: "#e6fffa",
              color: "#0f766e",
              padding: "2px 6px",
              borderRadius: "4px",
              fontWeight: 700,
            }}
          >
            {patient.id}
          </span>
        </div>
      </div>

      <nav className="side-nav">
        {navItems.map(([name, Icon]) => (
          <button
            key={name}
            type="button"
            className={`nav-item ${patientPage === name ? "nav-active" : ""}`}
            onClick={() => {
              setPatientPage(name)
              if (window.innerWidth <= 1024) {
                handleClose()
              }
            }}
          >
            <Icon size={19} /> <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="help-card" style={{ marginBottom: 0 }}>
          <ShieldCheck size={20} />
          <Text size="sm" weight="semibold">
            Need clinic help?
          </Text>
          <Text size="xs" tone="muted">
            Call support: +91 80 4455 6677
          </Text>
        </div>
      </div>
    </aside>
  )
}

export function PatientBottomNav() {
  const { patientPage, setPatientPage } = useQueue()
  const items: [string, LucideIcon][] = [
    ["Home", Home],
    ["Find a doctor", Search],
    ["My queue", ListChecks],
    ["History", History],
  ]

  return (
    <div className="bottom-nav">
      {items.map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          className={patientPage === name ? "bottom-active" : ""}
          onClick={() => setPatientPage(name)}
        >
          <Icon size={21} />
          <span>{name}</span>
        </button>
      ))}
    </div>
  )
}

// ==========================================
// 2. RECEPTIONIST DASHBOARD LAYOUT
// ==========================================

// ==========================================
// 2. RECEPTIONIST DASHBOARD LAYOUT
// ==========================================

export function ReceptionHeader({ mobileMenu }: { mobileMenu: () => void }) {
  const { currentStaff, staffLogout, setReceptionPage, toggleSidebar } =
    useQueue()

  const initials = currentStaff?.name
    ? currentStaff.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "SK"

  return (
    <div className="app-header">
      <div className="header-title-group">
        <div className="header-mobile">
          <IconButton
            icon={Menu}
            label="Toggle navigation"
            onClick={mobileMenu || toggleSidebar}
          />
        </div>
        <div className="header-title-text">
          <Text weight="semibold" className="header-main-title">
            Reception Desk
          </Text>
          <Text size="sm" tone="muted" className="header-subtitle">
            Staff ID: {currentStaff?.staffId || "REC-201"} · Front Desk Station
          </Text>
        </div>
      </div>
      <div className="header-actions">
        <span className="header-badge-pill front-desk-pill">
          FRONT DESK
        </span>

        {/* Profile Avatar Popover Menu */}
        <UserMenuDropdown
          name={currentStaff?.name || "Sneha Kapoor"}
          initials={initials}
          roleBadge={`Receptionist · ${currentStaff?.staffId || "REC-201"}`}
          subtext={currentStaff?.email || "reception@aarogya.in"}
          accentColor="#1d4ed8"
          onProfileClick={() => setReceptionPage("Profile")}
          onSignOutClick={staffLogout}
        />
      </div>
    </div>
  )
}

export function ReceptionSidebar({ close }: { close?: () => void }) {
  const { receptionPage, setReceptionPage, currentStaff, setSidebarOpen } =
    useQueue()

  const navItems: [string, LucideIcon][] = [
    ["Live queue", ListChecks],
    ["Quick walk-in", UserRoundPlus],
    ["Arrivals", LocateFixed],
    ["Activity log", Activity],
    ["Profile", UserRound],
  ]

  const handleClose = () => {
    if (close) close()
    setSidebarOpen(false)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <Logo />
        <IconButton
          icon={PanelLeftClose}
          label="Collapse sidebar"
          onClick={handleClose}
        />
      </div>

      <div style={{ padding: "0 8px 12px" }}>
        <Text size="xs" tone="teal" weight="bold">
          RECEPTION DESK
        </Text>
        <Text size="sm" weight="bold">
          {currentStaff?.name || "Sneha Kapoor"}
        </Text>
        <Text size="xs" tone="muted">
          Staff ID: {currentStaff?.staffId || "REC-201"}
        </Text>
      </div>

      <nav className="side-nav">
        {navItems.map(([name, Icon]) => (
          <button
            key={name}
            type="button"
            className={`nav-item ${receptionPage === name ? "nav-active" : ""}`}
            onClick={() => {
              setReceptionPage(name)
              if (window.innerWidth <= 1024) {
                handleClose()
              }
            }}
          >
            <Icon size={19} /> <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="help-card" style={{ marginBottom: 0 }}>
          <ClipboardList size={20} />
          <Text size="sm" weight="semibold">
            Front Desk Shift Active
          </Text>
          <Text size="xs" tone="muted">
            All OPD queues synced with TV display board.
          </Text>
        </div>
      </div>
    </aside>
  )
}

// ==========================================
// 3. DOCTOR DASHBOARD LAYOUT
// ==========================================

export function DoctorHeader({ mobileMenu }: { mobileMenu: () => void }) {
  const { currentStaff, staffLogout, queue, setDoctorPage, toggleSidebar } =
    useQueue()
  const currentDocId =
    currentStaff?.id === "staff-nair" ? "doc-nair" : "doc-sharma"
  const inConsultation = queue.find(
    (q) => q.doctorId === currentDocId && q.status === "In consultation",
  )

  const initials = currentStaff?.name
    ? currentStaff.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "AS"

  return (
    <div className="app-header">
      <div className="header-title-group">
        <div className="header-mobile">
          <IconButton
            icon={Menu}
            label="Toggle navigation"
            onClick={mobileMenu || toggleSidebar}
          />
        </div>
        <div className="header-title-text">
          <Text weight="semibold" className="header-main-title">
            {currentStaff?.name || "Dr. Arjun Sharma"} —{" "}
            {currentStaff?.room || "Room 2"}
          </Text>
          <Text size="sm" tone="muted" className="header-subtitle">
            Staff ID: {currentStaff?.staffId || "DOC-101"} · Clinical Workstation
          </Text>
        </div>
      </div>
      <div className="header-actions">
        {inConsultation && (
          <div className="header-badge-pill consult-pill">
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#7653a6",
                display: "inline-block",
              }}
            />
            <span>Inside: {inConsultation.token}</span>
          </div>
        )}

        {/* Profile Avatar Popover Menu */}
        <UserMenuDropdown
          name={currentStaff?.name || "Dr. Arjun Sharma"}
          initials={initials}
          roleBadge={`${currentStaff?.specialty || "Cardiology"} · ${currentStaff?.staffId || "DOC-101"}`}
          subtext={`${currentStaff?.room || "Room 2"} · ${currentStaff?.email || "doctor@aarogya.in"}`}
          accentColor="#7653a6"
          onProfileClick={() => setDoctorPage("Profile")}
          onSignOutClick={staffLogout}
        />
      </div>
    </div>
  )
}

export function DoctorSidebar({ close }: { close?: () => void }) {
  const { doctorPage, setDoctorPage, currentStaff, setSidebarOpen } = useQueue()

  const navItems: [string, LucideIcon][] = [
    ["Overview", Home],
    ["Live queue", ListChecks],
    ["Consultation", Stethoscope],
    ["Completed visits", CheckCircle2],
    ["Profile", UserRound],
  ]

  const handleClose = () => {
    if (close) close()
    setSidebarOpen(false)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <Logo />
        <IconButton
          icon={PanelLeftClose}
          label="Collapse sidebar"
          onClick={handleClose}
        />
      </div>

      <div style={{ padding: "0 8px 12px" }}>
        <Text size="xs" tone="teal" weight="bold">
          CLINICAL WORKSTATION
        </Text>
        <Text size="sm" weight="bold">
          {currentStaff?.name || "Dr. Arjun Sharma"}
        </Text>
        <Text size="xs" tone="muted">
          {currentStaff?.room || "Room 2"} · Staff ID:{" "}
          {currentStaff?.staffId || "DOC-101"}
        </Text>
      </div>

      <nav className="side-nav">
        {navItems.map(([name, Icon]) => (
          <button
            key={name}
            type="button"
            className={`nav-item ${doctorPage === name ? "nav-active" : ""}`}
            onClick={() => {
              setDoctorPage(name)
              if (window.innerWidth <= 1024) {
                handleClose()
              }
            }}
          >
            <Icon size={19} /> <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="help-card" style={{ marginBottom: 0 }}>
          <Stethoscope size={20} />
          <Text size="sm" weight="semibold">
            Clinical Support
          </Text>
          <Text size="xs" tone="muted">
            Emergency nurse dispatch: ext 102
          </Text>
        </div>
      </div>
    </aside>
  )
}

// ==========================================
// 4. ADMIN DASHBOARD LAYOUT
// ==========================================

export function AdminHeader({ mobileMenu }: { mobileMenu: () => void }) {
  const { currentStaff, staffLogout, setAdminPage, toggleSidebar } = useQueue()

  const initials = currentStaff?.name
    ? currentStaff.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "AD"

  return (
    <div className="app-header">
      <div className="header-title-group">
        <div className="header-mobile">
          <IconButton
            icon={Menu}
            label="Toggle navigation"
            onClick={mobileMenu || toggleSidebar}
          />
        </div>
        <div className="header-title-text">
          <Text weight="semibold" className="header-main-title">
            Clinic Operations Admin
          </Text>
          <Text size="sm" tone="muted" className="header-subtitle">
            Staff ID: {currentStaff?.staffId || "ADM-301"} · Master Portal
          </Text>
        </div>
      </div>
      <div className="header-actions">
        <span className="header-badge-pill admin-pill">
          ADMIN
        </span>

        {/* Profile Avatar Popover Menu */}
        <UserMenuDropdown
          name={currentStaff?.name || "Clinic Administrator"}
          initials={initials}
          roleBadge={`Administrator · ${currentStaff?.staffId || "ADM-301"}`}
          subtext={currentStaff?.email || "admin@aarogya.in"}
          accentColor="#b42318"
          onProfileClick={() => setAdminPage("Clinic settings")}
          onSignOutClick={staffLogout}
        />
      </div>
    </div>
  )
}

export function AdminSidebar({ close }: { close?: () => void }) {
  const { adminPage, setAdminPage, currentStaff, setSidebarOpen } = useQueue()

  const navItems: [string, LucideIcon][] = [
    ["Clinic settings", Settings],
    ["People", Users],
    ["Analytics", Activity],
  ]

  const handleClose = () => {
    if (close) close()
    setSidebarOpen(false)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <Logo />
        <IconButton
          icon={PanelLeftClose}
          label="Collapse sidebar"
          onClick={handleClose}
        />
      </div>

      <div style={{ padding: "0 8px 12px" }}>
        <Text size="xs" tone="danger" weight="bold">
          ADMINISTRATION
        </Text>
        <Text size="sm" weight="bold">
          {currentStaff?.name || "Clinic Administrator"}
        </Text>
        <Text size="xs" tone="muted">
          Staff ID: {currentStaff?.staffId || "ADM-301"}
        </Text>
      </div>

      <nav className="side-nav">
        {navItems.map(([name, Icon]) => (
          <button
            key={name}
            type="button"
            className={`nav-item ${adminPage === name ? "nav-active" : ""}`}
            onClick={() => {
              setAdminPage(name)
              if (window.innerWidth <= 1024) {
                handleClose()
              }
            }}
          >
            <Icon size={19} /> <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="help-card" style={{ marginBottom: 0 }}>
          <ShieldCheck size={20} />
          <Text size="sm" weight="semibold">
            System Operational
          </Text>
          <Text size="xs" tone="muted">
            QTrack Core v2.4 · All nodes healthy
          </Text>
        </div>
      </div>
    </aside>
  )
}

// ==========================================
// 5. MOBILE BOTTOM NAVIGATION BARS FOR STAFF
// ==========================================

export function ReceptionBottomNav() {
  const { receptionPage, setReceptionPage } = useQueue()
  const items: [string, LucideIcon][] = [
    ["Live queue", ListChecks],
    ["Quick walk-in", UserRoundPlus],
    ["Arrivals", LocateFixed],
    ["Activity log", Activity],
  ]

  return (
    <div className="bottom-nav staff-bottom-nav">
      {items.map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          className={receptionPage === name ? "bottom-active" : ""}
          onClick={() => setReceptionPage(name)}
        >
          <Icon size={20} />
          <span>{name === "Quick walk-in" ? "Walk-in" : name === "Activity log" ? "Activity" : name}</span>
        </button>
      ))}
    </div>
  )
}

export function DoctorBottomNav() {
  const { doctorPage, setDoctorPage } = useQueue()
  const items: [string, LucideIcon][] = [
    ["Overview", Home],
    ["Live queue", ListChecks],
    ["Consultation", Stethoscope],
    ["Completed visits", CheckCircle2],
  ]

  return (
    <div className="bottom-nav staff-bottom-nav">
      {items.map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          className={doctorPage === name ? "bottom-active" : ""}
          onClick={() => setDoctorPage(name)}
        >
          <Icon size={20} />
          <span>{name === "Completed visits" ? "Completed" : name === "Live queue" ? "Queue" : name}</span>
        </button>
      ))}
    </div>
  )
}

export function AdminBottomNav() {
  const { adminPage, setAdminPage } = useQueue()
  const items: [string, LucideIcon][] = [
    ["Clinic settings", Settings],
    ["People", Users],
    ["Analytics", Activity],
  ]

  return (
    <div className="bottom-nav staff-bottom-nav admin-bottom-nav">
      {items.map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          className={adminPage === name ? "bottom-active" : ""}
          onClick={() => setAdminPage(name)}
        >
          <Icon size={20} />
          <span>{name === "Clinic settings" ? "Settings" : name === "People" ? "Roster" : name}</span>
        </button>
      ))}
    </div>
  )
}

// ==========================================
// 6. QUICK PORTAL SWITCHER (TESTING & REVIEW)
// ==========================================

export function PortalSwitcher() {
  const { portal, setPortal } = useQueue()
  const [mobileOpen, setMobileOpen] = useState(false)

  const portals: [ActivePortal, string, string][] = [
    ["landing", "🌐 Public Site", "Patient info, clinic intro & portals gateway"],
    ["patient", "👤 Patient Portal", "Live queue status, late pass & token tracker"],
    ["receptionist", "📋 Reception Desk", "Walk-in registration & front desk queue"],
    ["doctor", "🩺 Doctor Station", "Patient callouts, notes & digital prescriptions"],
    ["admin", "⚙️ Clinic Admin", "Queue policies, grace window & staff roster"],
    ["display", "📺 TV Waiting Board", "Waiting lounge digital signage & audio chimes"],
  ]

  return (
    <>
      {/* Desktop Floating Bar (hidden on mobile <= 768px) */}
      <div className="portal-switcher-desktop">
        <span className="portal-switcher-label">PORTAL:</span>
        {portals.map(([p, label]) => (
          <button
            key={p}
            type="button"
            className={portal === p ? "portal-btn-active" : "portal-btn"}
            onClick={() => setPortal(p)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mobile Floating Action Button (visible only on <= 768px) */}
      <div className="portal-switcher-mobile">
        <button
          type="button"
          className="portal-fab"
          onClick={() => setMobileOpen(true)}
          aria-label="Switch QTrack Portal"
        >
          <Sparkles size={16} />
          <span>Switch Portal</span>
        </button>
      </div>

      {/* Mobile Slide-Up Modal / Bottom Sheet */}
      {mobileOpen && (
        <div
          className="portal-modal-overlay"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="portal-modal-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-head">
              <div>
                <strong style={{ fontSize: "16px", color: "#0f172a" }}>
                  Switch Workstation Portal
                </strong>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                  Jump to any clinic role or patient dashboard
                </p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Close portal switcher"
              >
                <X size={18} />
              </button>
            </div>

            <div className="portal-modal-list">
              {portals.map(([p, label, desc]) => (
                <button
                  key={p}
                  type="button"
                  className={`portal-choice-card ${
                    portal === p ? "portal-choice-active" : ""
                  }`}
                  onClick={() => {
                    setPortal(p)
                    setMobileOpen(false)
                  }}
                >
                  <div className="portal-choice-info">
                    <span className="portal-choice-title">{label}</span>
                    <span className="portal-choice-desc">{desc}</span>
                  </div>
                  {portal === p && (
                    <span className="portal-choice-check">
                      <CheckCircle2 size={18} color="#0f766e" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
