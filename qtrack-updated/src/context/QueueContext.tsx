import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import type {
  QueueItem,
  Doctor,
  PatientProfile,
  ConsultationRecord,
  AuditLogEntry,
  ClinicSettings,
  PrescriptionItem,
  StaffUser,
  ActivePortal,
} from "../types"
import {
  initialDoctors,
  initialPatients,
  initialPatient,
  initialStaffUsers,
  initialQueueItems,
  initialConsultations,
  initialAuditLogs,
  initialClinicSettings,
} from "../data/initialData"

export interface ToastNotification {
  id: string
  message: string
  type: "success" | "info" | "warning" | "danger"
}

export interface PatientLoginResult {
  success: boolean
  error?: string
  isNewUser?: boolean
}

export interface StaffLoginResult {
  success: boolean
  error?: string
  user?: StaffUser
}

interface QueueContextType {
  // Data
  queue: QueueItem[]
  doctors: Doctor[]
  patient: PatientProfile
  patients: PatientProfile[]
  currentStaff: StaffUser | null
  staffUsers: StaffUser[]
  consultations: ConsultationRecord[]
  auditLogs: AuditLogEntry[]
  settings: ClinicSettings
  activePatientToken: string | null
  latestCalledToken: QueueItem | null

  // Portal & Navigation
  portal: ActivePortal
  setPortal: (p: ActivePortal) => void
  patientPage: string
  setPatientPage: (p: string) => void
  receptionPage: string
  setReceptionPage: (p: string) => void
  doctorPage: string
  setDoctorPage: (p: string) => void
  adminPage: string
  setAdminPage: (p: string) => void
  setPage: (p: string) => void
  enterStaffView: (
    role?: "Doctor" | "Receptionist" | "Admin",
    targetPage?: string,
  ) => void
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggleSidebar: () => void

  // Authentication
  isPatientLoggedIn: boolean
  isStaffLoggedIn: boolean
  patientLogin: (params: {
    phone: string
    mode: "otp" | "password"
    otp?: string
    password?: string
  }) => PatientLoginResult
  patientRegister: (params: {
    phone: string
    name: string
    preferredLanguage: string
    password?: string
  }) => PatientProfile
  patientLogout: () => void
  setPatientPassword: (password: string) => void
  staffLogin: (params: {
    identifier: string
    password: string
    role?: "Doctor" | "Receptionist" | "Admin"
  }) => StaffLoginResult
  staffLogout: () => void

  // Queue Operations
  setActivePatientToken: (t: string | null) => void
  joinQueue: (params: {
    doctorId: string
    forWho: string
    reason?: string
    isPriority?: boolean
  }) => QueueItem
  checkInToken: (token: string) => boolean
  markArrived: (token: string) => void
  useLatePass: (token: string) => void
  callNextPatient: (doctorId: string) => QueueItem | null
  startConsultation: (token: string) => void
  completeConsultation: (params: {
    tokenId: string
    diagnosis: string
    clinicalNotes: string
    prescriptions: PrescriptionItem[]
  }) => void
  skipPatient: (token: string) => void
  removePatient: (token: string, reason: string) => void
  flagPriority: (token: string, reason: string) => void
  addWalkIn: (params: {
    patientName: string
    patientPhone: string
    doctorId: string
    reason?: string
    isPriority?: boolean
  }) => QueueItem
  updateSettings: (newSettings: Partial<ClinicSettings>) => void
  updatePatientProfile: (updated: Partial<PatientProfile>) => void
  addFamilyMember: (name: string, relationship: string, age: number) => void
  speakTokenAnnouncement: (item: QueueItem) => void
  resetToDefaults: () => void

  // Interactive Toast Notifications
  toast: ToastNotification | null
  showToast: (message: string, type?: "success" | "info" | "warning" | "danger") => void
  clearToast: () => void
}

const STORAGE_KEY = "qtrack_state_v2"

const QueueContext = createContext<QueueContextType | undefined>(undefined)

export const QueueProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Active Portal: 'landing' | 'patient' | 'receptionist' | 'doctor' | 'admin' | 'display' | 'styleguide'
  const [portal, setPortal] = useState<ActivePortal>("landing")

  // Sub-page state for each independent dashboard
  const [patientPage, setPatientPage] = useState<string>("Home")
  const [receptionPage, setReceptionPage] = useState<string>("Live queue")
  const [doctorPage, setDoctorPage] = useState<string>("Overview")
  const [adminPage, setAdminPage] = useState<string>("Clinic settings")

  // Sidebar toggle state (desktop defaults to open, mobile closed)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth > 1024
    }
    return true
  })
  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  // Interactive Toast State
  const [toast, setToast] = useState<ToastNotification | null>(null)
  const showToast = (
    message: string,
    type: "success" | "info" | "warning" | "danger" = "success",
  ) => {
    const id = Date.now().toString()
    setToast({ id, message, type })
  }
  const clearToast = () => setToast(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Patients
  const [patients, setPatients] = useState<PatientProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_patients`)
      return saved ? JSON.parse(saved) : initialPatients
    } catch {
      return initialPatients
    }
  })

  // Current Patient Session
  const [patient, setPatient] = useState<PatientProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_patient`)
      return saved ? JSON.parse(saved) : initialPatient
    } catch {
      return initialPatient
    }
  })
  const [isPatientLoggedIn, setIsPatientLoggedIn] = useState<boolean>(true)

  // Staff Users & Session
  const [staffUsers] = useState<StaffUser[]>(initialStaffUsers)
  const [currentStaff, setCurrentStaff] = useState<StaffUser | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_staff`)
      return saved ? JSON.parse(saved) : initialStaffUsers[0] // Dr. Arjun Sharma default
    } catch {
      return initialStaffUsers[0]
    }
  })
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState<boolean>(false)

  // Doctors
  const [doctors] = useState<Doctor[]>(initialDoctors)

  // Active Live Queue
  const [queue, setQueue] = useState<QueueItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_queue`)
      return saved ? JSON.parse(saved) : initialQueueItems
    } catch {
      return initialQueueItems
    }
  })

  // Consultations Record
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(
    () => {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}_consultations`)
        return saved ? JSON.parse(saved) : initialConsultations
      } catch {
        return initialConsultations
      }
    },
  )

  // Activity Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`)
      return saved ? JSON.parse(saved) : initialAuditLogs
    } catch {
      return initialAuditLogs
    }
  })

  // Clinic Settings
  const [settings, setSettings] = useState<ClinicSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`)
      return saved ? JSON.parse(saved) : initialClinicSettings
    } catch {
      return initialClinicSettings
    }
  })

  const [activePatientToken, setActivePatientToken] = useState<string | null>(
    "A-024",
  )
  const [latestCalledToken, setLatestCalledToken] = useState<QueueItem | null>(
    () => {
      return initialQueueItems.find((q) => q.status === "Called") || null
    },
  )

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_queue`, JSON.stringify(queue))
    } catch {}
  }, [queue])

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_patient`, JSON.stringify(patient))
    } catch {}
  }, [patient])

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_patients`, JSON.stringify(patients))
    } catch {}
  }, [patients])

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(currentStaff))
    } catch {}
  }, [currentStaff])

  useEffect(() => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY}_consultations`,
        JSON.stringify(consultations),
      )
    } catch {}
  }, [consultations])

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(auditLogs))
    } catch {}
  }, [auditLogs])

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings))
    } catch {}
  }, [settings])

  // Helper: Log audit activity
  const addAudit = (
    actor: string,
    action: string,
    reason: string,
    type: AuditLogEntry["type"],
  ) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      time: timeStr,
      actor,
      action,
      reason,
      type,
    }
    setAuditLogs((prev) => [entry, ...prev])
  }

  // Audio / Speech Announcement
  const speakTokenAnnouncement = (item: QueueItem) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        const text = `Token ${item.token}. Please proceed to ${item.room}. Dr. ${item.doctorName.replace("Dr. ", "")}.`
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.95
        utterance.pitch = 1.0
        window.speechSynthesis.speak(utterance)
      } catch {}
    }
  }

  // --- Authentication Handlers ---

  // Patient Login (Supports both OTP and Password modes)
  const patientLogin = ({
    phone,
    mode,
    password,
  }: {
    phone: string
    mode: "otp" | "password"
    otp?: string
    password?: string
  }) => {
    const cleanPhone = phone.trim()
    const existing = patients.find(
      (p) => p.phone.replace(/\D/g, "") === cleanPhone.replace(/\D/g, ""),
    )

    if (!existing) {
      // User does not exist yet -> trigger registration flow
      return { success: false, isNewUser: true }
    }

    if (mode === "password") {
      if (existing.password && existing.password === password) {
        setPatient(existing)
        setIsPatientLoggedIn(true)
        addAudit(
          existing.name,
          "Patient logged in (Password)",
          "Portal access",
          "checkin",
        )
        showToast(`Welcome back, ${existing.name}!`, "success")
        return { success: true }
      }
      showToast("Incorrect password. Try OTP login or enter patient123.", "danger")
      return {
        success: false,
        error: "Incorrect password. Try OTP login or enter patient123.",
      }
    }

    // OTP mode: any 6-digit verification succeeds in prototype
    setPatient(existing)
    setIsPatientLoggedIn(true)
    addAudit(
      existing.name,
      "Patient logged in (OTP verified)",
      "Portal access",
      "checkin",
    )
    showToast(`Welcome back, ${existing.name}!`, "success")
    return { success: true }
  }

  // New Patient Registration
  const patientRegister = ({
    phone,
    name,
    preferredLanguage,
    password = "patient123",
  }: {
    phone: string
    name: string
    preferredLanguage: string
    password?: string
  }) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const newPatient: PatientProfile = {
      id: `P-${randomNum}`,
      referralId: `QT-${randomNum}`,
      name: name.trim(),
      phone: phone.trim(),
      password,
      preferredLanguage,
      allergies: [],
      chronicConditions: [],
      familyMembers: [],
    }

    setPatients((prev) => [...prev, newPatient])
    setPatient(newPatient)
    setIsPatientLoggedIn(true)
    addAudit(
      newPatient.name,
      `New patient registered (${newPatient.id})`,
      "First time user onboarding",
      "checkin",
    )
    showToast(`Welcome to QTrack, ${newPatient.name}!`, "success")
    return newPatient
  }

  const patientLogout = () => {
    setIsPatientLoggedIn(false)
    setPortal("landing")
    showToast("Patient signed out successfully", "info")
  }

  const setPatientPassword = (newPassword: string) => {
    const updated = { ...patient, password: newPassword }
    setPatient(updated)
    setPatients((prev) => prev.map((p) => (p.id === patient.id ? updated : p)))
    addAudit(
      patient.name,
      "Updated account password",
      "Security settings",
      "reorder",
    )
    showToast("Password updated successfully!", "success")
  }

  // Staff Login (Doctor, Receptionist, Admin)
  const staffLogin = ({
    identifier,
    password,
    role,
  }: {
    identifier: string
    password: string
    role?: "Doctor" | "Receptionist" | "Admin"
  }) => {
    const idClean = identifier.trim().toLowerCase()
    const staffMatch = staffUsers.find(
      (s) =>
        (s.staffId.toLowerCase() === idClean ||
          s.email.toLowerCase() === idClean) &&
        (!role || s.role === role),
    )

    if (!staffMatch) {
      showToast(`Staff ID or Email not found. Try DOC-101, REC-201, or ADM-301.`, "danger")
      return {
        success: false,
        error: `Staff ID or Email '${identifier}' not found for ${role || "selected"} role. Try DOC-101, REC-201, or ADM-301.`,
      }
    }

    if (
      staffMatch.password !== password &&
      password !== "staff123" &&
      password !== "doctor123" &&
      password !== "admin123"
    ) {
      showToast("Incorrect staff password. (Default is doctor123 / staff123 / admin123)", "danger")
      return {
        success: false,
        error:
          "Incorrect staff password. (Default is doctor123 / staff123 / admin123)",
      }
    }

    setCurrentStaff(staffMatch)
    setIsStaffLoggedIn(true)
    addAudit(
      staffMatch.name,
      `Staff logged in as ${staffMatch.role} (${staffMatch.staffId})`,
      "Shift login",
      "checkin",
    )

    // Direct routing to their specific dashboard
    if (staffMatch.role === "Doctor") {
      setPortal("doctor")
      setDoctorPage("Overview")
    } else if (staffMatch.role === "Receptionist") {
      setPortal("receptionist")
      setReceptionPage("Live queue")
    } else {
      setPortal("admin")
      setAdminPage("Clinic settings")
    }

    showToast(`Signed in as ${staffMatch.name} (${staffMatch.role})`, "success")
    return { success: true, user: staffMatch }
  }

  const staffLogout = () => {
    setCurrentStaff(null)
    setIsStaffLoggedIn(false)
    setPortal("landing")
    showToast("Staff signed out successfully", "info")
  }

  // --- Queue Operations ---

  const joinQueue = ({
    doctorId,
    forWho,
    reason = "General consultation",
    isPriority = false,
  }: {
    doctorId: string
    forWho: string
    reason?: string
    isPriority?: boolean
  }): QueueItem => {
    const doc = doctors.find((d) => d.id === doctorId) || doctors[0]
    const prefix = doc.id === "doc-sharma" ? "A" : "B"

    const existingTokens = queue
      .filter((q) => q.token.startsWith(prefix))
      .map((q) => parseInt(q.token.split("-")[1], 10))
      .filter((n) => !isNaN(n))

    const nextNum =
      existingTokens.length > 0 ? Math.max(...existingTokens) + 1 : 25
    const tokenStr = `${prefix}-${String(nextNum).padStart(3, "0")}`

    const nowStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    const activeAhead = queue.filter(
      (q) =>
        q.doctorId === doc.id &&
        ["Waiting", "Window open", "Checked in"].includes(q.status),
    ).length

    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      token: tokenStr,
      patientId: patient.id,
      patientName: forWho === "Myself" ? patient.name : forWho,
      patientPhone: patient.phone,
      forWho,
      doctorId: doc.id,
      doctorName: doc.name,
      room: doc.room,
      status: "Waiting",
      isPriority,
      joinedAt: nowStr,
      estimatedWaitMinutes: Math.max(10, activeAhead * 10),
      checkInWindowMinutes: settings.checkInWindowMinutes,
      latePassUsed: false,
      strikes: 0,
      reasonForVisit: reason,
    }

    setQueue((prev) => [...prev, newItem])
    setActivePatientToken(tokenStr)
    addAudit(
      patient.name,
      `Joined queue for ${doc.name} (Token ${tokenStr})`,
      reason,
      "checkin",
    )
    showToast(`Token ${tokenStr} issued! Estimated wait: ~${newItem.estimatedWaitMinutes} mins`, "success")
    return newItem
  }

  const checkInToken = (token: string): boolean => {
    const target = queue.find((q) => q.token === token)
    if (!target) return false

    setQueue((prev) =>
      prev.map((q) =>
        q.token === token ? { ...q, status: "Checked in" as const } : q,
      ),
    )
    addAudit(
      target.patientName,
      `Checked in via clinic QR (Token ${token})`,
      "Arrived at clinic",
      "checkin",
    )
    showToast(`Arrival verified! You are checked in at the clinic lounge.`, "success")
    return true
  }

  const markArrived = (token: string) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.token === token ? { ...q, status: "Checked in" as const } : q,
      ),
    )
    const target = queue.find((q) => q.token === token)
    if (target) {
      addAudit(
        currentStaff?.name || "Sneha (Reception)",
        `Marked ${target.patientName} (${token}) as arrived`,
        "Confirmed in reception",
        "checkin",
      )
      showToast(`Arrival verified for Token ${token}!`, "success")
    }
  }

  const useLatePass = (token: string) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.token === token
          ? {
              ...q,
              latePassUsed: true,
              estimatedWaitMinutes: q.estimatedWaitMinutes + 15,
              windowClosesInMinutes: (q.windowClosesInMinutes || 10) + 15,
            }
          : q,
      ),
    )
    addAudit(
      patient.name,
      `Requested late pass (+15 min) for ${token}`,
      "Transit delay",
      "reorder",
    )
    showToast(`15-minute late pass applied! Grace window extended.`, "warning")
  }

  const callNextPatient = (doctorId: string): QueueItem | null => {
    const candidates = queue.filter(
      (q) =>
        q.doctorId === doctorId &&
        ["Checked in", "Window open", "Waiting"].includes(q.status),
    )

    if (candidates.length === 0) return null

    const checkedIn = candidates.find((q) => q.status === "Checked in")
    const target = checkedIn || candidates[0]

    const updatedItem = {
      ...target,
      status: "Called" as const,
      calledAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setQueue((prev) =>
      prev.map((q) => (q.token === target.token ? updatedItem : q)),
    )
    setLatestCalledToken(updatedItem)
    addAudit(
      target.doctorName,
      `Called token ${target.token} to ${target.room}`,
      "Ready for consultation",
      "call",
    )
    speakTokenAnnouncement(updatedItem)
    showToast(`Calling Token ${updatedItem.token} (${updatedItem.patientName}) to ${updatedItem.room}!`, "info")
    return updatedItem
  }

  const startConsultation = (token: string) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.token === token ? { ...q, status: "In consultation" as const } : q,
      ),
    )
    const target = queue.find((q) => q.token === token)
    if (target) {
      addAudit(
        target.doctorName,
        `Started consultation with ${target.patientName} (${token})`,
        "In progress",
        "call",
      )
      showToast(`Consultation in progress for Token ${token}`, "info")
    }
  }

  const completeConsultation = ({
    tokenId,
    diagnosis,
    clinicalNotes,
    prescriptions,
  }: {
    tokenId: string
    diagnosis: string
    clinicalNotes: string
    prescriptions: PrescriptionItem[]
  }) => {
    const item = queue.find((q) => q.token === tokenId)
    if (!item) return

    const now = new Date()
    const newRecord: ConsultationRecord = {
      id: `cons-${Date.now()}`,
      tokenId,
      patientId: item.patientId,
      patientName: item.patientName,
      doctorId: item.doctorId,
      doctorName: item.doctorName,
      date: now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      diagnosis,
      clinicalNotes,
      prescriptions,
      durationMinutes: 12,
    }

    setConsultations((prev) => [newRecord, ...prev])
    setQueue((prev) =>
      prev.map((q) =>
        q.token === tokenId
          ? { ...q, status: "Done" as const, completedAt: newRecord.time }
          : q,
      ),
    )
    addAudit(
      item.doctorName,
      `Completed consultation for ${item.patientName} (${tokenId})`,
      diagnosis,
      "call",
    )
    showToast(`Consultation completed for Token ${tokenId}! Prescription recorded.`, "success")
  }

  const skipPatient = (token: string) => {
    setQueue((prev) =>
      prev.map((q) => {
        if (q.token !== token) return q
        const newStrikes = q.strikes + 1
        const isRemoved = newStrikes >= settings.maxStrikes
        return {
          ...q,
          strikes: newStrikes,
          status: isRemoved ? ("Removed" as const) : ("Skipped" as const),
          estimatedWaitMinutes:
            q.estimatedWaitMinutes + settings.skipDemotionPlaces * 10,
        }
      }),
    )
    const target = queue.find((q) => q.token === token)
    if (target) {
      const nextStrikes = target.strikes + 1
      addAudit(
        "Doctor / Reception",
        `Patient ${target.patientName} (${token}) missed call`,
        `Added strike ${nextStrikes}/${settings.maxStrikes}. Moved back ${settings.skipDemotionPlaces} slots.`,
        "reorder",
      )
      showToast(
        `Token ${token} skipped (${nextStrikes}/${settings.maxStrikes} strikes)`,
        "warning",
      )
    }
  }

  const removePatient = (token: string, reason: string) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.token === token ? { ...q, status: "Removed" as const } : q,
      ),
    )
    addAudit("Staff", `Removed token ${token} from queue`, reason, "remove")
    showToast(`Token ${token} removed from queue`, "danger")
  }

  const flagPriority = (token: string, reason: string) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.token === token
          ? { ...q, isPriority: true, priorityReason: reason }
          : q,
      ),
    )
    addAudit("Staff", `Flagged token ${token} as Priority`, reason, "priority")
    showToast(`Token ${token} flagged as Priority (${reason})`, "info")
  }

  const addWalkIn = ({
    patientName,
    patientPhone,
    doctorId,
    reason = "Walk-in visit",
    isPriority = false,
  }: {
    patientName: string
    patientPhone: string
    doctorId: string
    reason?: string
    isPriority?: boolean
  }): QueueItem => {
    const doc = doctors.find((d) => d.id === doctorId) || doctors[0]
    const prefix = doc.id === "doc-sharma" ? "A" : "B"

    const existingTokens = queue
      .filter((q) => q.token.startsWith(prefix))
      .map((q) => parseInt(q.token.split("-")[1], 10))
      .filter((n) => !isNaN(n))

    const nextNum =
      existingTokens.length > 0 ? Math.max(...existingTokens) + 1 : 25
    const tokenStr = `${prefix}-${String(nextNum).padStart(3, "0")}`

    const nowStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    const activeAhead = queue.filter(
      (q) =>
        q.doctorId === doc.id &&
        ["Waiting", "Window open", "Checked in"].includes(q.status),
    ).length

    const newItem: QueueItem = {
      id: `q-walkin-${Date.now()}`,
      token: tokenStr,
      patientId: `P-walkin-${Date.now()}`,
      patientName,
      patientPhone,
      forWho: "Myself",
      doctorId: doc.id,
      doctorName: doc.name,
      room: doc.room,
      status: "Checked in",
      isPriority,
      priorityReason: isPriority ? reason : undefined,
      joinedAt: nowStr,
      estimatedWaitMinutes: Math.max(15, activeAhead * 10),
      checkInWindowMinutes: settings.checkInWindowMinutes,
      latePassUsed: false,
      strikes: 0,
      reasonForVisit: reason,
    }

    setQueue((prev) => [...prev, newItem])
    addAudit(
      currentStaff?.name || "Sneha (Reception)",
      `Issued walk-in token ${tokenStr} for ${patientName}`,
      reason,
      "checkin",
    )
    showToast(`Walk-in Token ${tokenStr} issued for ${patientName}!`, "success")
    return newItem
  }

  const updateSettings = (newSettings: Partial<ClinicSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    addAudit(
      "Admin",
      "Updated clinic queue rules",
      "Policy adjustments",
      "priority",
    )
    showToast("Clinic settings updated successfully!", "success")
  }

  const updatePatientProfile = (updated: Partial<PatientProfile>) => {
    const updatedProfile = { ...patient, ...updated }
    setPatient(updatedProfile)
    setPatients((prev) =>
      prev.map((p) => (p.id === patient.id ? updatedProfile : p)),
    )
    showToast("Patient profile updated!", "success")
  }

  const addFamilyMember = (name: string, relationship: string, age: number) => {
    const newMember = {
      id: `fam-${Date.now()}`,
      name,
      relationship,
      age,
    }
    const updatedProfile = {
      ...patient,
      familyMembers: [...patient.familyMembers, newMember],
    }
    setPatient(updatedProfile)
    setPatients((prev) =>
      prev.map((p) => (p.id === patient.id ? updatedProfile : p)),
    )
    showToast(`Family member ${name} added!`, "success")
  }

  const setPage = (p: string) => {
    if (portal === "patient") setPatientPage(p)
    else if (portal === "receptionist") setReceptionPage(p)
    else if (portal === "doctor") setDoctorPage(p)
    else if (portal === "admin") setAdminPage(p)
    else setPatientPage(p)
  }

  const enterStaffView = (
    r: "Doctor" | "Receptionist" | "Admin" = "Receptionist",
    targetPage?: string,
  ) => {
    if (r === "Doctor") {
      setPortal("doctor")
      if (targetPage) setDoctorPage(targetPage)
    } else if (r === "Admin") {
      setPortal("admin")
      if (targetPage) setAdminPage(targetPage)
    } else {
      setPortal("receptionist")
      if (targetPage) setReceptionPage(targetPage)
    }
  }

  const resetToDefaults = () => {
    setQueue(initialQueueItems)
    setPatient(initialPatient)
    setPatients(initialPatients)
    setConsultations(initialConsultations)
    setAuditLogs(initialAuditLogs)
    setSettings(initialClinicSettings)
    setActivePatientToken("A-024")
    localStorage.clear()
  }

  return (
    <QueueContext.Provider
      value={{
        queue,
        doctors,
        patient,
        patients,
        currentStaff,
        staffUsers,
        consultations,
        auditLogs,
        settings,
        activePatientToken,
        latestCalledToken,

        portal,
        setPortal,
        patientPage,
        setPatientPage,
        receptionPage,
        setReceptionPage,
        doctorPage,
        setDoctorPage,
        adminPage,
        setAdminPage,
        setPage,
        enterStaffView,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,

        isPatientLoggedIn,
        isStaffLoggedIn,
        patientLogin,
        patientRegister,
        patientLogout,
        setPatientPassword,
        staffLogin,
        staffLogout,

        setActivePatientToken,
        joinQueue,
        checkInToken,
        markArrived,
        useLatePass,
        callNextPatient,
        startConsultation,
        completeConsultation,
        skipPatient,
        removePatient,
        flagPriority,
        addWalkIn,
        updateSettings,
        updatePatientProfile,
        addFamilyMember,
        speakTokenAnnouncement,
        resetToDefaults,

        toast,
        showToast,
        clearToast,
      }}
    >
      {toast && (
        <div className="toast-float" onClick={clearToast}>
          <div className={`toast-content toast-${toast.type || "success"}`}>
            <div className="toast-icon">
              {toast.type === "warning" ? (
                <AlertCircle size={20} />
              ) : toast.type === "danger" ? (
                <AlertCircle size={20} />
              ) : toast.type === "info" ? (
                <Info size={20} />
              ) : (
                <CheckCircle2 size={20} />
              )}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button
              type="button"
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation()
                clearToast()
              }}
            >
              <X size={15} />
            </button>
            <div className="toast-progress" />
          </div>
        </div>
      )}
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = (): QueueContextType => {
  const context = useContext(QueueContext)
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider")
  }
  return context
}
