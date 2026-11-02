import { useState } from "react"
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock3,
  HeartPulse,
  LogOut,
  MoreHorizontal,
  Plus,
  Stethoscope,
  X,
} from "lucide-react"
import { useQueue } from "../../context/QueueContext"
import type { PrescriptionItem, QueueItem } from "../../types"
import { Badge } from "../common/Badge"
import { Button, IconButton } from "../common/Button"
import { Card } from "../common/Card"
import { Field, TextArea } from "../common/Field"
import { Text } from "../common/Text"

export function DoctorOverviewView({
  onOpenConsultation,
  onOpenQueue,
}: {
  onOpenConsultation: () => void
  onOpenQueue: () => void
}) {
  const { queue, consultations } = useQueue()

  const currentDoctorId = "doc-sharma"
  const doctorQueue = queue.filter((q) => q.doctorId === currentDoctorId)
  const waitingPatients = doctorQueue.filter((q) =>
    ["Waiting", "Window open", "Checked in"].includes(q.status),
  )
  const checkedInCount = doctorQueue.filter(
    (q) => q.status === "Checked in",
  ).length
  const completedToday = consultations.filter(
    (c) => c.doctorId === currentDoctorId,
  ).length

  const inConsultationPatient =
    doctorQueue.find((q) => q.status === "In consultation") ||
    doctorQueue.find((q) => q.status === "Called") ||
    null

  const upNextPatient =
    doctorQueue.find((q) => q.status === "Checked in") ||
    doctorQueue.find((q) => q.status === "Waiting") ||
    null

  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Good morning, Dr. Sharma
          </Text>
          <Text tone="muted">
            Room 2 · General Physician · Here’s your clinic at a glance.
          </Text>
        </div>
      </div>

      <div className="doctor-stats-strip">
        <div className="doc-stat-pill">
          <span className="doc-stat-label">WAITING</span>
          <span className="doc-stat-val text-teal">{waitingPatients.length}</span>
          <span className="doc-stat-sub">{checkedInCount} checked in</span>
        </div>
        <div className="doc-stat-pill">
          <span className="doc-stat-label">SEEN TODAY</span>
          <span className="doc-stat-val">{completedToday + 14}</span>
          <span className="doc-stat-sub">consultations</span>
        </div>
        <div className="doc-stat-pill">
          <span className="doc-stat-label">AVG. TIME</span>
          <span className="doc-stat-val">11 min</span>
          <span className="doc-stat-sub">per visit</span>
        </div>
      </div>

      {inConsultationPatient ? (
        <Card className="current-patient-compact">
          <div className="current-patient-header">
            <Badge>{inConsultationPatient.status}</Badge>
            <span className="active-room-subtag">ROOM 2 · ACTIVE PATIENT</span>
          </div>
          <div className="current-patient-identity">
            <span className="token-chip-pill">{inConsultationPatient.token}</span>
            <div className="current-patient-text">
              <Text size="md" weight="bold">
                {inConsultationPatient.patientName}
              </Text>
              <Text size="xs" tone="muted">
                {inConsultationPatient.reasonForVisit || "Follow-up consultation"}
              </Text>
            </div>
          </div>
          <Button size="sm" icon={Stethoscope} full onClick={onOpenConsultation}>
            Open consultation workspace
          </Button>
        </Card>
      ) : (
        <Card className="current-patient-compact">
          <div className="current-patient-header">
            <Badge>Ready</Badge>
            <span className="active-room-subtag">CONSULTATION ROOM 2</span>
          </div>
          <div className="current-patient-identity">
            <div className="current-patient-text">
              <Text size="md" weight="bold">
                No patient currently inside
              </Text>
              <Text size="xs" tone="muted">
                Call the next patient in queue to begin consultation.
              </Text>
            </div>
          </div>
          <Button size="sm" icon={Bell} full onClick={onOpenQueue}>
            Call next patient
          </Button>
        </Card>
      )}

      <div className="two-col">
        <Card>
          <div className="section-title">
            <Text size="lg" weight="bold">
              Up next in line
            </Text>
            <Badge>{upNextPatient?.status || "Waiting"}</Badge>
          </div>
          {upNextPatient ? (
            <div className="patient-next">
              <span className="token-chip">{upNextPatient.token}</span>
              <div>
                <Text weight="bold">{upNextPatient.patientName}</Text>
                <Text size="sm" tone="muted">
                  {upNextPatient.reasonForVisit} · Waiting{" "}
                  {upNextPatient.estimatedWaitMinutes}m
                </Text>
              </div>
            </div>
          ) : (
            <Text tone="muted">Queue is currently clear.</Text>
          )}
          <Button full onClick={onOpenQueue}>
            View full queue table
          </Button>
        </Card>

        <Card>
          <Text size="lg" weight="bold">
            Queue health metrics
          </Text>
          <div className="health-row">
            <span>On-time arrivals</span>
            <strong>88%</strong>
          </div>
          <div className="health-row">
            <span>Average wait time</span>
            <strong>26 min</strong>
          </div>
          <div className="health-row">
            <span>No-shows / skips today</span>
            <strong>2</strong>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function DoctorLiveQueueView({
  onStartConsultation,
}: {
  onStartConsultation: (item: QueueItem) => void
}) {
  const { queue, callNextPatient, skipPatient } = useQueue()
  const [calledItem, setCalledItem] = useState<QueueItem | null>(null)

  const currentDoctorId = "doc-sharma"
  const doctorQueue = queue.filter(
    (q) =>
      q.doctorId === currentDoctorId && !["Done", "Removed"].includes(q.status),
  )

  const handleCallNext = () => {
    const called = callNextPatient(currentDoctorId)
    if (called) {
      setCalledItem(called)
    }
  }

  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Dr. Sharma’s Live Queue
          </Text>
          <Text tone="muted">
            Checked-in patients are automatically prioritized for calling.
          </Text>
        </div>
        <Button icon={Bell} onClick={handleCallNext}>
          Call next patient
        </Button>
      </div>

      {calledItem && (
        <div className="toast toast-wide">
          <CheckCircle2 size={24} color="#0f766e" />
          <div style={{ flex: 1 }}>
            <Text weight="semibold">
              {calledItem.patientName} · Token {calledItem.token} called to Room
              2
            </Text>
            <Text size="sm" tone="muted">
              Display board and patient mobile screen were automatically
              notified with audio chime.
            </Text>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              onStartConsultation(calledItem)
            }}
          >
            Start consultation
          </Button>
        </div>
      )}

      <Card className="table-card">
        <div className="queue-table">
          <div className="table-row table-head">
            <span>Token</span>
            <span>Patient</span>
            <span>Status</span>
            <span>Wait</span>
            <span>Strikes</span>
            <span>Actions</span>
          </div>

          {doctorQueue.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <Text tone="muted">No active patients in queue right now.</Text>
            </div>
          ) : (
            doctorQueue.map((item) => (
              <div className="table-row queue-card" key={item.token}>
                <span className="cell-token">
                  <strong>{item.token}</strong>
                </span>
                <span className="cell-patient">
                  <strong>{item.patientName}</strong>
                  {item.isPriority && <Badge dot={false}>Priority</Badge>}
                </span>
                <span className="cell-status">
                  <Badge>{item.status}</Badge>
                </span>
                <span className="cell-wait">
                  <span className="meta-label">Wait: </span>
                  {item.estimatedWaitMinutes}m
                </span>
                <span className="cell-strikes">
                  <span className="meta-label">Strikes: </span>
                  {item.strikes}/3
                </span>
                <span className="row-actions cell-actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onStartConsultation(item)}
                  >
                    Examine
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipPatient(item.token)}
                    title="Move back 3 positions and add 1 strike"
                  >
                    Skip
                  </Button>
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

export function DoctorConsultationView({
  onVisitCompleted,
}: {
  onVisitCompleted: () => void
}) {
  const { queue, completeConsultation, flagPriority } = useQueue()

  // Find active patient in consultation or fallback to first active
  const activeConsultationItem =
    queue.find((q) => q.status === "In consultation") ||
    queue.find((q) => q.status === "Called") ||
    queue.find((q) => q.doctorId === "doc-sharma" && q.status !== "Done") ||
    queue[0]

  const [diagnosis, setDiagnosis] = useState(
    "Acute Upper Respiratory Tract Infection",
  )
  const [clinicalNotes, setClinicalNotes] = useState(
    "Fever (101°F), congested pharynx, no wheeze. Clear chest on auscultation. Advised warm fluids and hydration.",
  )
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: "rx-new-1",
      medicine: "Paracetamol 650mg",
      dose: "1 tab",
      frequency: "TDS (Thrice daily)",
      duration: "3 days",
    },
    {
      id: "rx-new-2",
      medicine: "Amoxicillin-Clav 625mg",
      dose: "1 tab",
      frequency: "BD (Twice daily)",
      duration: "5 days",
    },
  ])

  const handleAddMedicine = () => {
    const newRx: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicine: "",
      dose: "1 tab",
      frequency: "BD",
      duration: "3 days",
    }
    setPrescriptions([...prescriptions, newRx])
  }

  const handleUpdateMedicine = (
    id: string,
    key: keyof PrescriptionItem,
    value: string,
  ) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === id ? { ...rx, [key]: value } : rx)),
    )
  }

  const handleRemoveMedicine = (id: string) => {
    setPrescriptions((prev) => prev.filter((rx) => rx.id !== id))
  }

  const handleSaveAndComplete = () => {
    if (activeConsultationItem) {
      completeConsultation({
        tokenId: activeConsultationItem.token,
        diagnosis,
        clinicalNotes,
        prescriptions,
      })
      onVisitCompleted()
    }
  }

  return (
    <div className="consult-page">
      <div className="consult-top">
        <div>
          <Badge>In consultation</Badge>
          <Text size="xl" weight="bold">
            {activeConsultationItem?.token} ·{" "}
            {activeConsultationItem?.patientName}
          </Text>
          <Text tone="muted">
            {activeConsultationItem?.forWho} ·{" "}
            {activeConsultationItem?.patientPhone}
          </Text>
        </div>
        <Text size="lg" weight="semibold">
          <Clock3 size={18} /> 09:14 consultation timer
        </Text>
      </div>

      <div className="clinical-alerts">
        <div>
          <AlertCircle />
          <Text>
            <strong>Documented Allergy:</strong> Penicillin & Dust
          </Text>
        </div>
        <div>
          <HeartPulse />
          <Text>
            <strong>Chronic Condition:</strong> Asthma (mild intermittent)
          </Text>
        </div>
      </div>

      <div className="consult-grid">
        <div className="content-stack">
          <Card>
            <Text size="lg" weight="bold">
              Today’s concern
            </Text>
            <Text>
              {activeConsultationItem?.reasonForVisit ||
                "Fever, cough, and body ache"}
            </Text>
          </Card>
          <Card>
            <Text size="lg" weight="bold">
              Previous visits at clinic
            </Text>
            <div className="timeline">
              <div>
                <strong>04 Jun 2025</strong>
                <span>Seasonal viral fever · Dr. Nair</span>
              </div>
              <div>
                <strong>22 Mar 2025</strong>
                <span>Migraine without aura · Dr. Sharma</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="consult-form">
          <Field
            label="Diagnosis"
            placeholder="Search or enter clinical diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
          <TextArea
            label="Clinical notes"
            placeholder="Symptoms, physical observations, vitals, and dietary advice"
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
          />

          <div>
            <div className="section-title">
              <Text weight="bold">Digital Prescription</Text>
              <Button variant="ghost" icon={Plus} onClick={handleAddMedicine}>
                Add medicine
              </Button>
            </div>
            {prescriptions.map((rx) => (
              <div className="medicine-card-modern" key={rx.id}>
                <div className="medicine-top-row">
                  <input
                    className="medicine-input-main"
                    placeholder="Medicine name (e.g. Paracetamol 650mg)"
                    value={rx.medicine}
                    onChange={(e) =>
                      handleUpdateMedicine(rx.id, "medicine", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="medicine-remove-btn"
                    onClick={() => handleRemoveMedicine(rx.id)}
                    title="Remove medicine"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="medicine-triplet-row">
                  <div className="medicine-subfield">
                    <span className="subfield-tag">DOSE</span>
                    <input
                      className="medicine-input-sub"
                      placeholder="1 tab"
                      value={rx.dose}
                      onChange={(e) =>
                        handleUpdateMedicine(rx.id, "dose", e.target.value)
                      }
                    />
                  </div>
                  <div className="medicine-subfield">
                    <span className="subfield-tag">FREQ</span>
                    <input
                      className="medicine-input-sub"
                      placeholder="TDS (3x)"
                      value={rx.frequency}
                      onChange={(e) =>
                        handleUpdateMedicine(rx.id, "frequency", e.target.value)
                      }
                    />
                  </div>
                  <div className="medicine-subfield">
                    <span className="subfield-tag">DURATION</span>
                    <input
                      className="medicine-input-sub"
                      placeholder="3 days"
                      value={rx.duration}
                      onChange={(e) =>
                        handleUpdateMedicine(rx.id, "duration", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="consult-actions">
            <Button
              variant="secondary"
              onClick={() => {
                if (activeConsultationItem) {
                  flagPriority(
                    activeConsultationItem.token,
                    "Flagged urgent by Doctor",
                  )
                }
              }}
            >
              Flag priority
            </Button>
            <Button onClick={handleSaveAndComplete}>
              Save and complete visit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function DoctorCompletedVisitsView() {
  const { consultations } = useQueue()

  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Completed consultations
          </Text>
          <Text tone="muted">
            {consultations.length} patient visits successfully concluded today.
          </Text>
        </div>
      </div>

      <Card className="table-card">
        <div className="queue-table">
          <div className="table-row completed-head">
            <span>Token</span>
            <span>Patient</span>
            <span>Completed</span>
            <span>Diagnosis</span>
            <span>Prescription Summary</span>
          </div>

          {consultations.map((c) => (
            <div className="table-row completed-head" key={c.id}>
              <span>
                <strong>{c.tokenId}</strong>
              </span>
              <span>{c.patientName}</span>
              <span>{c.time}</span>
              <span>{c.diagnosis}</span>
              <span>
                {c.prescriptions.map((p) => p.medicine).join(", ") ||
                  "Advised rest"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function DoctorProfilePageView() {
  const { currentStaff, staffLogout, doctors } = useQueue()
  const doc =
    doctors.find((d) => d.name === currentStaff?.name) ||
    doctors[0]
  const [opdStatus, setOpdStatus] = useState<"active" | "break" | "concluded">(
    "active",
  )
  const [fee, setFee] = useState(doc.fee || 600)
  const [saved, setSaved] = useState(false)

  return (
    <div className="content-stack">
      {/* Profile Header Card */}
      <Card className="profile-hero-card">
        <div className="profile-hero-main">
          <img
            src={doc.photo}
            alt={doc.name}
            className="doctor-avatar"
            style={{ width: "52px", height: "56px" }}
          />
          <div className="profile-hero-info">
            <div className="profile-hero-name-row">
              <Text size="md" weight="bold">
                {doc.name}
              </Text>
              <span className="verified-pill">
                <CheckCircle2 size={12} /> Verified Doctor
              </span>
            </div>
            <Text size="xs" tone="muted">
              {doc.specialty} · {doc.experienceYears} yrs experience ·{" "}
              {currentStaff?.staffId || "DOC-101"}
            </Text>
          </div>
        </div>
        <Button
          variant="danger"
          size="sm"
          icon={LogOut}
          onClick={staffLogout}
          className="profile-logout-btn"
        >
          Sign out
        </Button>
      </Card>

      {/* OPD Session Status Pill Selector */}
      <Card style={{ padding: "12px 14px" }}>
        <Text
          size="xs"
          weight="bold"
          tone="muted"
          style={{ letterSpacing: "0.06em", marginBottom: "8px" }}
        >
          CLINICAL OPD SESSION STATUS
        </Text>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
          }}
        >
          <button
            type="button"
            className={`choice ${opdStatus === "active" ? "choice-active" : ""}`}
            style={{
              minHeight: "44px",
              padding: "6px",
              fontSize: "12px",
              fontWeight: 600,
            }}
            onClick={() => setOpdStatus("active")}
          >
            🟢 Active OPD
          </button>
          <button
            type="button"
            className={`choice ${opdStatus === "break" ? "choice-active" : ""}`}
            style={{
              minHeight: "44px",
              padding: "6px",
              fontSize: "12px",
              fontWeight: 600,
            }}
            onClick={() => setOpdStatus("break")}
          >
            ☕ 15m Break
          </button>
          <button
            type="button"
            className={`choice ${opdStatus === "concluded" ? "choice-active" : ""}`}
            style={{
              minHeight: "44px",
              padding: "6px",
              fontSize: "12px",
              fontWeight: 600,
            }}
            onClick={() => setOpdStatus("concluded")}
          >
            🏁 Concluded
          </button>
        </div>
      </Card>

      {/* Doctor Credentials & Clinic Practice Strip */}
      <div className="profile-id-strip">
        <div className="profile-id-chip">
          <div className="id-chip-meta">
            <span className="id-chip-label">MEDICAL COUNCIL REG. NO.</span>
            <span className="id-chip-value" style={{ fontSize: "15px" }}>
              KMC-48291
            </span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Karnataka Medical Council
            </span>
          </div>
        </div>

        <div className="profile-id-chip">
          <div className="id-chip-meta">
            <span className="id-chip-label">ASSIGNED ROOM & CLINIC</span>
            <span className="id-chip-value" style={{ fontSize: "15px" }}>
              Room 2 · Richmond Rd
            </span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Aarogya Family Clinic
            </span>
          </div>
        </div>
      </div>

      {/* OPD Schedule & Queue Preferences */}
      <Card>
        <Text size="md" weight="bold" style={{ marginBottom: "12px" }}>
          Consultation & Queue Settings
        </Text>
        <div style={{ display: "grid", gap: "12px" }}>
          <Field
            label="OPD Consultation Fee (₹)"
            type="number"
            value={fee.toString()}
            onChange={(e) => setFee(parseInt(e.target.value, 10) || 0)}
          />
          <Field
            label="Doctor Qualifications & Degrees"
            value={doc.qualification}
            disabled
          />
          <Field
            label="Languages Spoken"
            value={doc.languages.join(", ")}
            disabled
          />
          <Field
            label="Standard Consultation Timings"
            value={doc.timings}
            disabled
          />
          <Button
            size="sm"
            onClick={() => {
              setSaved(true)
              setTimeout(() => setSaved(false), 2500)
            }}
          >
            {saved ? "Settings saved!" : "Save preferences"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
