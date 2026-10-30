import { useState } from "react"
import { QueueProvider, useQueue } from "./context/QueueContext"
import { LandingPage } from "./components/landing/LandingPage"
import { PatientAuthView, StaffAuthView } from "./components/auth/AuthViews"
import {
  PatientHeader,
  PatientSidebar,
  PatientBottomNav,
  ReceptionHeader,
  ReceptionSidebar,
  DoctorHeader,
  DoctorSidebar,
  AdminHeader,
  AdminSidebar,
  PortalSwitcher,
} from "./components/layout/LayoutComponents"

// Patient Views
import {
  PatientHome,
  DoctorSearch,
  DoctorProfileView,
  JoinQueueFlow,
  LiveQueueView,
  QRCheckinView,
  CalledPageView,
  NoticePageView,
  HistoryPageView,
  ProfilePageView,
} from "./components/patient/PatientViews"

// Reception Views
import {
  ReceptionLiveQueue,
  QuickWalkInView,
  ArrivalsPageView,
  ActivityLogView,
} from "./components/receptionist/ReceptionViews"

// Doctor Views
import {
  DoctorOverviewView,
  DoctorLiveQueueView,
  DoctorConsultationView,
  DoctorCompletedVisitsView,
} from "./components/doctor/DoctorViews"

// Admin Views
import {
  AdminClinicSettingsView,
  AdminPeopleView,
  AdminAnalyticsView,
} from "./components/admin/AdminViews"

// Display & Style Guide Views
import { DisplayBoardView } from "./components/display/DisplayViews"
import {
  FoundationPageView,
  ComponentPageView,
} from "./components/styleguide/StyleGuideViews"

// ==========================================
// 1. DEDICATED PATIENT DASHBOARD
// ==========================================
function PatientDashboard() {
  const {
    isPatientLoggedIn,
    patientPage,
    setPatientPage,
    setPortal,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
  } = useQueue()

  if (!isPatientLoggedIn) {
    return <PatientAuthView onBack={() => setPortal("landing")} />
  }

  const isFullContentPage = ["QR check-in", "Called"].includes(patientPage)

  const renderPatientContent = () => {
    switch (patientPage) {
      case "Home":
        return <PatientHome />
      case "Find a doctor":
        return <DoctorSearch />
      case "Doctor profile":
        return <DoctorProfileView />
      case "Join queue":
        return <JoinQueueFlow />
      case "My queue":
        return <LiveQueueView />
      case "QR check-in":
        return <QRCheckinView />
      case "Called":
        return <CalledPageView />
      case "Notices":
        return <NoticePageView />
      case "History":
        return <HistoryPageView />
      case "Profile":
        return <ProfilePageView />
      default:
        return <PatientHome />
    }
  }

  return (
    <div className="app">
      <div
        className={`mobile-overlay ${sidebarOpen ? "overlay-show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`sidebar-wrap ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <PatientSidebar close={() => setSidebarOpen(false)} />
      </div>

      <div
        className={`main-shell ${!sidebarOpen ? "main-shell-expanded" : ""}`}
      >
        <PatientHeader mobileMenu={toggleSidebar} />
        <main
          className={`main-content ${
            isFullContentPage ? "main-content-full" : ""
          }`}
        >
          {renderPatientContent()}
        </main>
      </div>

      {!isFullContentPage && <PatientBottomNav />}
    </div>
  )
}

// ==========================================
// 2. DEDICATED RECEPTIONIST DASHBOARD
// ==========================================
function ReceptionistDashboard() {
  const {
    currentStaff,
    isStaffLoggedIn,
    receptionPage,
    setReceptionPage,
    setPortal,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
  } = useQueue()

  // Gatekeeper: only Receptionist role can access
  if (
    !isStaffLoggedIn ||
    !currentStaff ||
    currentStaff.role !== "Receptionist"
  ) {
    return <StaffAuthView onBack={() => setPortal("landing")} />
  }

  const renderReceptionContent = () => {
    switch (receptionPage) {
      case "Live queue":
        return (
          <ReceptionLiveQueue
            onAddWalkIn={() => setReceptionPage("Quick walk-in")}
          />
        )
      case "Quick walk-in":
        return <QuickWalkInView />
      case "Arrivals":
        return <ArrivalsPageView />
      case "Activity log":
        return <ActivityLogView />
      default:
        return (
          <ReceptionLiveQueue
            onAddWalkIn={() => setReceptionPage("Quick walk-in")}
          />
        )
    }
  }

  return (
    <div className="app">
      <div
        className={`mobile-overlay ${sidebarOpen ? "overlay-show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`sidebar-wrap ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <ReceptionSidebar close={() => setSidebarOpen(false)} />
      </div>

      <div
        className={`main-shell ${!sidebarOpen ? "main-shell-expanded" : ""}`}
      >
        <ReceptionHeader mobileMenu={toggleSidebar} />
        <main className="main-content">{renderReceptionContent()}</main>
      </div>
    </div>
  )
}

// ==========================================
// 3. DEDICATED DOCTOR DASHBOARD
// ==========================================
function DoctorDashboard() {
  const {
    currentStaff,
    isStaffLoggedIn,
    doctorPage,
    setDoctorPage,
    setPortal,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
  } = useQueue()

  // Gatekeeper: only Doctor role can access
  if (!isStaffLoggedIn || !currentStaff || currentStaff.role !== "Doctor") {
    return <StaffAuthView onBack={() => setPortal("landing")} />
  }

  const renderDoctorContent = () => {
    switch (doctorPage) {
      case "Overview":
        return (
          <DoctorOverviewView
            onOpenConsultation={() => setDoctorPage("Consultation")}
            onOpenQueue={() => setDoctorPage("Live queue")}
          />
        )
      case "Live queue":
        return (
          <DoctorLiveQueueView
            onStartConsultation={() => setDoctorPage("Consultation")}
          />
        )
      case "Consultation":
        return (
          <DoctorConsultationView
            onVisitCompleted={() => setDoctorPage("Completed visits")}
          />
        )
      case "Completed visits":
      default:
        return <DoctorCompletedVisitsView />
    }
  }

  return (
    <div className="app">
      <div
        className={`mobile-overlay ${sidebarOpen ? "overlay-show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`sidebar-wrap ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <DoctorSidebar close={() => setSidebarOpen(false)} />
      </div>

      <div
        className={`main-shell ${!sidebarOpen ? "main-shell-expanded" : ""}`}
      >
        <DoctorHeader mobileMenu={toggleSidebar} />
        <main className="main-content">{renderDoctorContent()}</main>
      </div>
    </div>
  )
}

// ==========================================
// 4. DEDICATED ADMIN DASHBOARD
// ==========================================
function AdminDashboard() {
  const {
    currentStaff,
    isStaffLoggedIn,
    adminPage,
    setPortal,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
  } = useQueue()

  // Gatekeeper: only Admin role can access
  if (!isStaffLoggedIn || !currentStaff || currentStaff.role !== "Admin") {
    return <StaffAuthView onBack={() => setPortal("landing")} />
  }

  const renderAdminContent = () => {
    switch (adminPage) {
      case "Clinic settings":
        return <AdminClinicSettingsView />
      case "People":
        return <AdminPeopleView />
      case "Analytics":
      default:
        return <AdminAnalyticsView />
    }
  }

  return (
    <div className="app">
      <div
        className={`mobile-overlay ${sidebarOpen ? "overlay-show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`sidebar-wrap ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <AdminSidebar close={() => setSidebarOpen(false)} />
      </div>

      <div
        className={`main-shell ${!sidebarOpen ? "main-shell-expanded" : ""}`}
      >
        <AdminHeader mobileMenu={toggleSidebar} />
        <main className="main-content">{renderAdminContent()}</main>
      </div>
    </div>
  )
}

// ==========================================
// ROOT APP COORDINATOR
// ==========================================
function MainApp() {
  const { portal, setPortal } = useQueue()

  return (
    <>
      {portal === "landing" && <LandingPage />}
      {portal === "patient" && <PatientDashboard />}
      {portal === "receptionist" && <ReceptionistDashboard />}
      {portal === "doctor" && <DoctorDashboard />}
      {portal === "admin" && <AdminDashboard />}
      {portal === "display" && (
        <DisplayBoardView onExit={() => setPortal("landing")} />
      )}
      {portal === "styleguide" && (
        <div className="app">
          <div
            style={{
              padding: "16px 24px",
              background: "#ffffff",
              borderBottom: "1px solid #dfe5e3",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>QTrack Design System & Components</strong>
            <button
              type="button"
              onClick={() => setPortal("landing")}
              style={{
                padding: "6px 12px",
                border: "1px solid #dfe5e3",
                borderRadius: "6px",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Back to Site
            </button>
          </div>
          <main className="main-content" style={{ padding: "24px" }}>
            <FoundationPageView />
            <div style={{ margin: "32px 0" }} />
            <ComponentPageView />
          </main>
        </div>
      )}

      {/* Floating portal switcher for easy testing & review */}
      <PortalSwitcher />
    </>
  )
}

export default function App() {
  return (
    <QueueProvider>
      <MainApp />
    </QueueProvider>
  )
}
