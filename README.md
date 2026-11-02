# QTrack Frontend: Full Architecture & Execution Blueprint

> [!NOTE]
> This blueprint decomposes the monolithic template into a modular, production-grade frontend architecture. It defines the synchronized reactive state model, UX workflows, component hierarchy, and an actionable step-by-step checklist.

---

## 1. System Architecture & Reactive Data Flow

Although the backend and database will be integrated later by teammates, the frontend will implement a **Unified Reactive State Engine** backed by `localStorage`. This ensures that when an action happens anywhere (e.g. Doctor calls a token, Reception issues a walk-in, Patient checks in via QR), **every view immediately reacts in real-time**.

```mermaid
graph TD
    subgraph Shared State Layer ["Core State & Sync Engine (QueueContext + LocalStorage)"]
        StateDB[("Active Queue State: Tokens, Patients, Doctors, Audits, Settings")]
    end

    subgraph User Surfaces ["Role Surfaces & Views"]
        Landing["Public Landing Page"]
        PatientApp["Patient Portal (11 Screens: Search, Queue, QR, Called, History)"]
        ReceptionApp["Reception Workspace (Live Queue, Walk-In, Arrivals, Audit Log)"]
        DoctorApp["Doctor Workspace (Overview, Live Calling, Consultation, History)"]
        AdminApp["Admin Workspace (Queue Rules, People, Analytics)"]
        DisplayApp["Clinic TV Board (Bilingual Token Board & Audio Chime)"]
    end

    Landing -->|"Book or Track"| PatientApp
    Landing -->|"Staff Sign In"| ReceptionApp

    PatientApp <-->|"Join Queue / QR Check-in / Cancel"| StateDB
    ReceptionApp <-->|"Issue Walk-In / Mark Arrived / Override"| StateDB
    DoctorApp <-->|"Call Next / Prescribe / Complete Visit"| StateDB
    AdminApp <-->|"Update Timing & Strike Rules"| StateDB
    StateDB -->|"Real-time Token Broadcast & Audio Alert"| DisplayApp
```

---

## 2. Global State & Interaction Model

```mermaid
sequenceDiagram
    autonumber
    actor P as Patient
    actor R as Receptionist
    actor D as Doctor
    actor TV as Clinic Display Board

    P->>R: Joins Queue via Web or Walk-In
    R-->>P: Generates Token (e.g., A-024)
    Note over P,TV: Token A-024 added to Live Queue State (Status: Waiting)

    P->>P: Arrives & Scans Clinic QR (Check-in)
    Note over P,TV: Token A-024 status updated to "Checked in"
    R-->>R: Arrivals Dashboard highlights A-024 as "Arrived"

    D->>D: Clicks "Call Next Patient"
    Note over D,TV: Token A-024 status becomes "Called" -> Room 2
    TV-->>TV: Flashes Token A-024 with Room 2 & Bilingual Audio/Chime
    P-->>P: Screen transitions automatically to "Called: Please go to Room 2"

    D->>D: Enters Clinical Notes & Prescription -> Completes Visit
    Note over D,TV: Token A-024 archived to "Completed"
    P-->>P: Visit record & prescription available in Patient History
```

---

## 3. Project Directory Reorganization

We will transition from the single monolithic [App.tsx](file:///c:/Users/AONAK%20YADAV/Downloads/qtrack-updated-source/qtrack-updated/src/App.tsx) into a clean, modular folder structure:

```
src/
├── types/
│   ├── queue.ts            # QueueItem, Patient, Doctor, Status, Priority
│   ├── consultation.ts     # Prescriptions, ClinicalNotes, MedicalHistory
│   ├── settings.ts         # CheckInWindow, StrikeLimit, DemotionRules
│   └── audit.ts            # AuditLogEntry, ActionTypes
├── context/
│   ├── QueueContext.tsx    # Unified reactive state engine & localStorage sync
│   └── AudioContext.tsx    # Audio cues & speech synthesizer for TV announcements
├── data/
│   ├── initialData.ts      # Realistic seed data for doctors, patients, queues
│   └── clinicConstants.ts  # Department rules, specialties, fees
├── components/
│   ├── common/             # Button, Badge, Card, Field, Select, Modal, Toast
│   ├── layout/             # AppHeader, Sidebar, PatientBottomNav, PrototypeBar
│   ├── landing/            # Hero, Features, Steps, ClinicSection, Footer
│   ├── patient/            # PatientHome, DoctorSearch, DoctorProfile, QueueTracker,
│   │                       # QRScannerModal, CalledAlert, HistoryView, ProfileView
│   ├── receptionist/       # LiveQueueTable, WalkInModal, ArrivalsList, ActivityLog
│   ├── doctor/             # DoctorOverview, CallingQueue, ConsultationRoom, CompletedTable
│   ├── admin/              # ClinicSettings, StaffManager, AnalyticsCharts
│   └── display/            # TVTokenBoard, FlashServingCard, NextTokensBar
├── App.tsx                 # Clean role router & top-level layout coordinator
└── index.css               # Existing design system preserved and extended
```
