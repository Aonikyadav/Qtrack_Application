export type QueueStatus = "Waiting" | "Window open" | "Checked in" | "Called" | "In consultation" | "Done" | "Skipped" | "Removed" | "Priority" | "Emergency"

export interface FamilyMember {
  id: string
  name: string
  relationship: string
  age: number
}

export interface PatientProfile {
  id: string // e.g. P-8421
  referralId: string // e.g. QT-8421
  name: string
  phone: string
  password?: string
  age?: number
  gender?: string
  preferredLanguage: string
  allergies: string[]
  chronicConditions: string[]
  familyMembers: FamilyMember[]
}

export interface StaffUser {
  id: string
  staffId: string // e.g. DOC-101, REC-201, ADM-301
  name: string
  email: string
  role: "Doctor" | "Receptionist" | "Admin"
  room?: string
  specialty?: string
  password: string
}

export interface Doctor {
  id: string
  staffId: string
  name: string
  specialty: string
  qualification: string
  experienceYears: number
  photo: string
  room: string
  languages: string[]
  fee: number
  availableToday: boolean
  timings: string
  clinicName: string
  clinicAddress: string
  distanceKm: number
  activeQueueCount: number
  avgWaitMins: string
}

export interface QueueItem {
  id: string
  token: string
  patientId: string
  patientName: string
  patientPhone: string
  forWho: string // 'Myself' or family member name
  doctorId: string
  doctorName: string
  room: string
  status: QueueStatus
  isPriority: boolean
  priorityReason?: string
  joinedAt: string
  estimatedWaitMinutes: number
  windowClosesInMinutes?: number
  checkInWindowMinutes: number
  latePassUsed: boolean
  strikes: number
  reasonForVisit?: string
  calledAt?: string
  completedAt?: string
}

export interface PrescriptionItem {
  id: string
  medicine: string
  dose: string
  frequency: string
  duration: string
}

export interface ConsultationRecord {
  id: string
  tokenId: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  diagnosis: string
  clinicalNotes: string
  prescriptions: PrescriptionItem[]
  durationMinutes: number
}

export interface AuditLogEntry {
  id: string
  time: string
  actor: string
  action: string
  reason: string
  type: "priority" | "reorder" | "remove" | "checkin" | "call"
}

export interface ClinicSettings {
  checkInWindowMinutes: number
  skipDemotionPlaces: number
  maxStrikes: number
}

export type ActivePortal = "landing" | "patient" | "receptionist" | "doctor" | "admin" | "display" | "styleguide"

export type Role = "Style guide" | "Components" | "Patient" | "Receptionist" | "Doctor" | "Admin" | "Display"
