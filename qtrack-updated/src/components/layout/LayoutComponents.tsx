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
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* Clickable Avatar Circle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`User menu for ${name}`}
        aria-expanded={open}
        style={{
          width: "38px",
          height: "38px",
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
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "240px",
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
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div className="header-mobile">
          <IconButton
            icon={Menu}
            label="Toggle navigation"
            onClick={mobileMenu || toggleSidebar}
          />
        </div>
        <div>
          <Text weight="semibold">Aarogya Family Clinic</Text>
          <Text size="sm" tone="muted">
            {todayStr} · Patient Portal
          </Text>
        </div>
      </div>
      <div className="header-actions">
        {/* Patient ID Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#e6fffa",
            color: "#0f766e",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 700,
            border: "1px solid #99f6e4",
          }}
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
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div className="header-mobile">
          <IconButton
            icon={Menu}
            label="Toggle navigation"
            onClick={mobileMenu || toggleSidebar}
          />
        </div>
        <div>
          <Text weight="semibold">Reception Desk — Aarogya Family Clinic</Text>
          <Text size="sm" tone="muted">
            Staff ID: {currentStaff?.staffId || "REC-201"} · Front Desk Token
            Station
          </Text>
        </div>
      </div>
      <div className="header-actions">
        <span
          style={{
            background: "#eff6ff",
            color: "#1d4ed8",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 700,
            border: "1px solid #bfdbfe",
          }}
        >
          FRONT DESK
        </span>

        {/* Profile Avatar Popover Menu */}
        <UserMenuDropdown
          name={currentStaff?.name || "Sneha Kapoor"}
          initials={initials}
          roleBadge={`Receptionist · ${currentStaff?.staffId || "REC-201"}`}
          subtext={currentStaff?.email || "reception@aarogya.in"}
          accentColor="#1d4ed8"
          onProfileClick={() => setReceptionPage("Activity log")}
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
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div className="header-mobile">
          <IconButton
            icon={Menu}
            label="Toggle navigation"
            onClick={mobileMenu || toggleSidebar}
          />
        </div>
        <div>
          <Text weight="semibold">
            {currentStaff?.name || "Dr. Arjun Sharma"} —{" "}
            {currentStaff?.room || "Room 2"}
          </Text>
          <Text size="sm" tone="muted">
            Staff ID: {currentStaff?.staffId || "DOC-101"} · Clinical Consultation
            Station
          </Text>
        </div>
      </div>
      <div className="header-actions">
        {inConsultation && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#f4effb",
              color: "#7653a6",
              padding: "4px 10px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#7653a6",
              }}
            />
            Inside: {inConsultation.token}
          </div>
        )}

        {/* Profile Avatar Popover Menu */}
        <UserMenuDropdown
          name={currentStaff?.name || "Dr. Arjun Sharma"}
          initials={initials}
          roleBadge={`${currentStaff?.specialty || "Cardiology"} · ${currentStaff?.staffId || "DOC-101"}`}
          subtext={`${currentStaff?.room || "Room 2"} · ${currentStaff?.email || "doctor@aarogya.in"}`}
          accentColor="#7653a6"
          onProfileClick={() => setDoctorPage("Overview")}
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
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div className="header-mobile">
          <IconButton
            icon={Menu}
            label="Toggle navigation"
            onClick={mobileMenu || toggleSidebar}
          />
        </div>
        <div>
          <Text weight="semibold">
            Hospital & Clinic Operations Administration
          </Text>
          <Text size="sm" tone="muted">
            Staff ID: {currentStaff?.staffId || "ADM-301"} · Master Control Portal
          </Text>
        </div>
      </div>
      <div className="header-actions">
        <span
          style={{
            background: "#fef3f2",
            color: "#b42318",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 700,
            border: "1px solid #fecdca",
          }}
        >
          ADMINISTRATOR
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
// 5. QUICK PORTAL SWITCHER (TESTING & REVIEW)
// ==========================================

export function PortalSwitcher() {
  const { portal, setPortal } = useQueue()

  const portals: [ActivePortal, string][] = [
    ["landing", "🌐 Public Site"],
    ["patient", "👤 Patient"],
    ["receptionist", "📋 Reception"],
    ["doctor", "🩺 Doctor"],
    ["admin", "⚙️ Admin"],
    ["display", "📺 TV Board"],
  ]

  return (
    <div
      style={{
        position: "fixed",
        bottom: "12px",
        right: "12px",
        zIndex: 9999,
        background: "#102624",
        border: "1px solid #294541",
        borderRadius: "30px",
        padding: "4px 6px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
      }}
    >
      <span
        style={{
          color: "#5eead4",
          fontSize: "11px",
          fontWeight: 700,
          paddingLeft: "8px",
          paddingRight: "4px",
        }}
      >
        PORTAL:
      </span>
      {portals.map(([p, label]) => (
        <button
          key={p}
          type="button"
          onClick={() => setPortal(p)}
          style={{
            background: portal === p ? "#0f766e" : "transparent",
            color: portal === p ? "#ffffff" : "#b7c9c6",
            border: "none",
            borderRadius: "20px",
            padding: "5px 10px",
            fontSize: "12px",
            fontWeight: portal === p ? 700 : 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
