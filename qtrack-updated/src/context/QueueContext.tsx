import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type {
  QueueItem,
  Doctor,
  PatientProfile,
  ConsultationRecord,
  AuditLogEntry,
  ClinicSettings,
  Role,
  PrescriptionItem,
} from '../types'
import {
  initialDoctors,
  initialPatient,
  initialQueueItems,
  initialConsultations,
  initialAuditLogs,
  initialClinicSettings,
} from '../data/initialData'

interface QueueContextType {
  queue: QueueItem[]
  doctors: Doctor[]
  patient: PatientProfile
  consultations: ConsultationRecord[]
  auditLogs: AuditLogEntry[]
  settings: ClinicSettings
  activePatientToken: string | null
  latestCalledToken: QueueItem | null
  role: Role
  page: string
  showLanding: boolean
  setRole: (r: Role) => void
  setPage: (p: string) => void
  setShowLanding: (s: boolean) => void
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
  enterPatientView: (targetPage?: string) => void
  enterStaffView: (role?: Role, targetPage?: string) => void
  resetToDefaults: () => void
}

const STORAGE_KEY = 'qtrack_state_v1'

const QueueContext = createContext<QueueContextType | undefined>(undefined)

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage if available, or fall back to seeds
  const [queue, setQueue] = useState<QueueItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_queue`)
      return saved ? JSON.parse(saved) : initialQueueItems
    } catch {
      return initialQueueItems
    }
  })

  const [doctors] = useState<Doctor[]>(initialDoctors)

  const [patient, setPatient] = useState<PatientProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_patient`)
      return saved ? JSON.parse(saved) : initialPatient
    } catch {
      return initialPatient
    }
  })

  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_consultations`)
      return saved ? JSON.parse(saved) : initialConsultations
    } catch {
      return initialConsultations
    }
  })

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`)
      return saved ? JSON.parse(saved) : initialAuditLogs
    } catch {
      return initialAuditLogs
    }
  })

  const [settings, setSettings] = useState<ClinicSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`)
      return saved ? JSON.parse(saved) : initialClinicSettings
    } catch {
      return initialClinicSettings
    }
  })

  const [activePatientToken, setActivePatientToken] = useState<string | null>('A-024')
  const [latestCalledToken, setLatestCalledToken] = useState<QueueItem | null>(() => {
    return initialQueueItems.find((q) => q.status === 'Called') || null
  })

  // Navigation states
  const [role, setRole] = useState<Role>('Patient')
  const [page, setPage] = useState<string>('Home')
  const [showLanding, setShowLanding] = useState<boolean>(true)

  // Persist state changes
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
      localStorage.setItem(`${STORAGE_KEY}_consultations`, JSON.stringify(consultations))
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

  // Helpers
  const addAudit = (actor: string, action: string, reason: string, type: AuditLogEntry['type']) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

  const speakTokenAnnouncement = (item: QueueItem) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const text = `Token ${item.token}. Please proceed to ${item.room}. Dr. ${item.doctorName.replace('Dr. ', '')}.`
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.95
        utterance.pitch = 1.0
        window.speechSynthesis.speak(utterance)
      } catch {}
    }
  }

  const joinQueue = ({
    doctorId,
    forWho,
    reason = 'General consultation',
    isPriority = false,
  }: {
    doctorId: string
    forWho: string
    reason?: string
    isPriority?: boolean
  }): QueueItem => {
    const doc = doctors.find((d) => d.id === doctorId) || doctors[0]
    const prefix = doc.id === 'doc-sharma' ? 'A' : 'B'

    // Compute next token number
    const existingTokens = queue
      .filter((q) => q.token.startsWith(prefix))
      .map((q) => parseInt(q.token.split('-')[1], 10))
      .filter((n) => !isNaN(n))

    const nextNum = existingTokens.length > 0 ? Math.max(...existingTokens) + 1 : 25
    const tokenStr = `${prefix}-${String(nextNum).padStart(3, '0')}`

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const activeAhead = queue.filter(
      (q) => q.doctorId === doc.id && ['Waiting', 'Window open', 'Checked in'].includes(q.status)
    ).length

    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      token: tokenStr,
      patientId: patient.id,
      patientName: forWho === 'Myself' ? patient.name : forWho,
      patientPhone: patient.phone,
      forWho,
      doctorId: doc.id,
      doctorName: doc.name,
      room: doc.room,
      status: 'Waiting',
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
      'checkin'
    )
    return newItem
  }

  const checkInToken = (token: string): boolean => {
    const target = queue.find((q) => q.token === token)
    if (!target) return false

    setQueue((prev) =>
      prev.map((q) => (q.token === token ? { ...q, status: 'Checked in' as const } : q))
    )
    addAudit(target.patientName, `Checked in via clinic QR (Token ${token})`, 'Arrived at clinic', 'checkin')
    return true
  }

  const markArrived = (token: string) => {
    setQueue((prev) =>
      prev.map((q) => (q.token === token ? { ...q, status: 'Checked in' as const } : q))
    )
    const target = queue.find((q) => q.token === token)
    if (target) {
      addAudit('Sneha (Reception)', `Marked ${target.patientName} (${token}) as arrived`, 'Confirmed in reception', 'checkin')
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
          : q
      )
    )
    addAudit(patient.name, `Requested late pass (+15 min) for ${token}`, 'Transit delay', 'reorder')
  }

  const callNextPatient = (doctorId: string): QueueItem | null => {
    // Priority: Checked in patients first, then window open, then waiting
    const candidates = queue.filter(
      (q) => q.doctorId === doctorId && ['Checked in', 'Window open', 'Waiting'].includes(q.status)
    )

    if (candidates.length === 0) return null

    // Pick top checked-in first, or the first waiting
    const checkedIn = candidates.find((q) => q.status === 'Checked in')
    const target = checkedIn || candidates[0]

    const updatedItem = {
      ...target,
      status: 'Called' as const,
      calledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setQueue((prev) => prev.map((q) => (q.token === target.token ? updatedItem : q)))
    setLatestCalledToken(updatedItem)
    addAudit(target.doctorName, `Called token ${target.token} to ${target.room}`, 'Ready for consultation', 'call')
    speakTokenAnnouncement(updatedItem)
    return updatedItem
  }

  const startConsultation = (token: string) => {
    setQueue((prev) =>
      prev.map((q) => (q.token === token ? { ...q, status: 'In consultation' as const } : q))
    )
    const target = queue.find((q) => q.token === token)
    if (target) {
      addAudit(target.doctorName, `Started consultation with ${target.patientName} (${token})`, 'In progress', 'call')
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
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      diagnosis,
      clinicalNotes,
      prescriptions,
      durationMinutes: 12,
    }

    setConsultations((prev) => [newRecord, ...prev])
    setQueue((prev) => prev.map((q) => (q.token === tokenId ? { ...q, status: 'Done' as const, completedAt: newRecord.time } : q)))
    addAudit(item.doctorName, `Completed consultation for ${item.patientName} (${tokenId})`, diagnosis, 'call')
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
          status: isRemoved ? ('Removed' as const) : ('Skipped' as const),
          estimatedWaitMinutes: q.estimatedWaitMinutes + settings.skipDemotionPlaces * 10,
        }
      })
    )
    const target = queue.find((q) => q.token === token)
    if (target) {
      const nextStrikes = target.strikes + 1
      addAudit(
        'System / Doctor',
        `Patient ${target.patientName} (${token}) missed call`,
        `Added strike ${nextStrikes}/${settings.maxStrikes}. Moved back ${settings.skipDemotionPlaces} slots.`,
        'reorder'
      )
    }
  }

  const removePatient = (token: string, reason: string) => {
    setQueue((prev) =>
      prev.map((q) => (q.token === token ? { ...q, status: 'Removed' as const } : q))
    )
    const target = queue.find((q) => q.token === token)
    addAudit('Staff', `Removed token ${token} from queue`, reason, 'remove')
  }

  const flagPriority = (token: string, reason: string) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.token === token ? { ...q, isPriority: true, priorityReason: reason } : q
      )
    )
    addAudit('Staff', `Flagged token ${token} as Priority`, reason, 'priority')
  }

  const addWalkIn = ({
    patientName,
    patientPhone,
    doctorId,
    reason = 'Walk-in visit',
    isPriority = false,
  }: {
    patientName: string
    patientPhone: string
    doctorId: string
    reason?: string
    isPriority?: boolean
  }): QueueItem => {
    const doc = doctors.find((d) => d.id === doctorId) || doctors[0]
    const prefix = doc.id === 'doc-sharma' ? 'A' : 'B'

    const existingTokens = queue
      .filter((q) => q.token.startsWith(prefix))
      .map((q) => parseInt(q.token.split('-')[1], 10))
      .filter((n) => !isNaN(n))

    const nextNum = existingTokens.length > 0 ? Math.max(...existingTokens) + 1 : 25
    const tokenStr = `${prefix}-${String(nextNum).padStart(3, '0')}`

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const activeAhead = queue.filter(
      (q) => q.doctorId === doc.id && ['Waiting', 'Window open', 'Checked in'].includes(q.status)
    ).length

    const newItem: QueueItem = {
      id: `q-walkin-${Date.now()}`,
      token: tokenStr,
      patientId: `pat-walkin-${Date.now()}`,
      patientName,
      patientPhone,
      forWho: 'Myself',
      doctorId: doc.id,
      doctorName: doc.name,
      room: doc.room,
      status: 'Checked in', // Walk-ins at reception are already checked in
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
    addAudit('Sneha (Reception)', `Issued walk-in token ${tokenStr} for ${patientName}`, reason, 'checkin')
    return newItem
  }

  const updateSettings = (newSettings: Partial<ClinicSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    addAudit('Admin', 'Updated clinic queue rules', 'Policy adjustments', 'priority')
  }

  const updatePatientProfile = (updated: Partial<PatientProfile>) => {
    setPatient((prev) => ({ ...prev, ...updated }))
  }

  const addFamilyMember = (name: string, relationship: string, age: number) => {
    const newMember = {
      id: `fam-${Date.now()}`,
      name,
      relationship,
      age,
    }
    setPatient((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember],
    }))
  }

  const enterPatientView = (targetPage: string = 'Home') => {
    setRole('Patient')
    setPage(targetPage)
    setShowLanding(false)
  }

  const enterStaffView = (targetRole: Role = 'Receptionist', targetPage: string = 'Live queue') => {
    setRole(targetRole)
    setPage(targetPage)
    setShowLanding(false)
  }

  const resetToDefaults = () => {
    setQueue(initialQueueItems)
    setPatient(initialPatient)
    setConsultations(initialConsultations)
    setAuditLogs(initialAuditLogs)
    setSettings(initialClinicSettings)
    setActivePatientToken('A-024')
    localStorage.clear()
  }

  return (
    <QueueContext.Provider
      value={{
        queue,
        doctors,
        patient,
        consultations,
        auditLogs,
        settings,
        activePatientToken,
        latestCalledToken,
        role,
        page,
        showLanding,
        setRole,
        setPage,
        setShowLanding,
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
        enterPatientView,
        enterStaffView,
        resetToDefaults,
      }}
    >
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = (): QueueContextType => {
  const context = useContext(QueueContext)
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider')
  }
  return context
}
