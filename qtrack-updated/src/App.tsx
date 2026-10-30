import { useState } from 'react'
import { QueueProvider, useQueue } from './context/QueueContext'
import {
  AppHeader,
  PatientBottomNav,
  PrototypeBar,
  Sidebar,
} from './components/layout/LayoutComponents'
import { LandingPage } from './components/landing/LandingPage'

// Patient Views
import {
  CalledPageView,
  DoctorProfileView,
  DoctorSearch,
  HistoryPageView,
  JoinQueueFlow,
  LiveQueueView,
  LoginPageView,
  NoticePageView,
  PatientHome,
  ProfilePageView,
  QRCheckinView,
} from './components/patient/PatientViews'

// Receptionist Views
import {
  ActivityLogView,
  ArrivalsPageView,
  QuickWalkInView,
  ReceptionLiveQueue,
  StaffLoginView,
} from './components/receptionist/ReceptionViews'

// Doctor Views
import {
  DoctorCompletedVisitsView,
  DoctorConsultationView,
  DoctorLiveQueueView,
  DoctorOverviewView,
} from './components/doctor/DoctorViews'

// Admin Views
import {
  AdminAnalyticsView,
  AdminClinicSettingsView,
  AdminPeopleView,
} from './components/admin/AdminViews'

// Display & Design System Views
import { DisplayBoardView } from './components/display/DisplayViews'
import {
  ComponentPageView,
  FoundationPageView,
} from './components/styleguide/StyleGuideViews'

function PageRouter() {
  const { role, page, setPage } = useQueue()

  if (role === 'Style guide') return <FoundationPageView />
  if (role === 'Components') return <ComponentPageView />

  if (role === 'Patient') {
    switch (page) {
      case 'Home':
        return <PatientHome />
      case 'Find a doctor':
        return <DoctorSearch />
      case 'Doctor profile':
        return <DoctorProfileView />
      case 'Join queue':
        return <JoinQueueFlow />
      case 'My queue':
        return <LiveQueueView />
      case 'QR check-in':
        return <QRCheckinView />
      case 'Called':
        return <CalledPageView />
      case 'Notices':
        return <NoticePageView />
      case 'History':
        return <HistoryPageView />
      case 'Profile':
        return <ProfilePageView />
      default:
        return <LoginPageView />
    }
  }

  if (role === 'Receptionist') {
    switch (page) {
      case 'Live queue':
        return <ReceptionLiveQueue onAddWalkIn={() => setPage('Quick walk-in')} />
      case 'Quick walk-in':
        return <QuickWalkInView />
      case 'Arrivals':
        return <ArrivalsPageView />
      case 'Activity log':
        return <ActivityLogView />
      default:
        return <StaffLoginView />
    }
  }

  if (role === 'Doctor') {
    switch (page) {
      case 'Overview':
        return (
          <DoctorOverviewView
            onOpenConsultation={() => setPage('Consultation')}
            onOpenQueue={() => setPage('Live queue')}
          />
        )
      case 'Live queue':
        return (
          <DoctorLiveQueueView
            onStartConsultation={() => setPage('Consultation')}
          />
        )
      case 'Consultation':
        return (
          <DoctorConsultationView
            onVisitCompleted={() => setPage('Completed visits')}
          />
        )
      default:
        return <DoctorCompletedVisitsView />
    }
  }

  if (role === 'Admin') {
    switch (page) {
      case 'Clinic settings':
        return <AdminClinicSettingsView />
      case 'People':
        return <AdminPeopleView />
      default:
        return <AdminAnalyticsView />
    }
  }

  return <DisplayBoardView />
}

function MainApp() {
  const { role, page, showLanding } = useQueue()
  const [menuOpen, setMenuOpen] = useState(false)
  const isDisplay = role === 'Display'

  if (showLanding) {
    return <LandingPage />
  }

  const isFullContentPage = [
    'QR check-in',
    'Called',
    'Staff login',
    'Login & OTP',
  ].includes(page)

  return (
    <div className={`app ${isDisplay ? 'app-display' : ''}`}>
      {!isDisplay && <PrototypeBar />}

      {!isDisplay && (
        <>
          <div
            className={`mobile-overlay ${menuOpen ? 'overlay-show' : ''}`}
            onClick={() => setMenuOpen(false)}
          />
          <div className={`sidebar-wrap ${menuOpen ? 'sidebar-open' : ''}`}>
            <Sidebar close={() => setMenuOpen(false)} />
          </div>
        </>
      )}

      <div className={`main-shell ${isDisplay ? 'main-display' : ''}`}>
        {!isDisplay && <AppHeader mobileMenu={() => setMenuOpen(true)} />}
        <main
          className={`main-content ${
            isFullContentPage ? 'main-content-full' : ''
          }`}
        >
          <PageRouter />
        </main>
      </div>

      {role === 'Patient' && !isFullContentPage && <PatientBottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <QueueProvider>
      <MainApp />
    </QueueProvider>
  )
}
