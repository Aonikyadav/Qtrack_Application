import { useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Download,
  FileText,
  LocateFixed,
  LogOut,
  MapPin,
  Phone,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react"
import { useQueue } from "../../context/QueueContext"
import type { Doctor } from "../../types"
import { Badge } from "../common/Badge"
import { Button, IconButton } from "../common/Button"
import { Card } from "../common/Card"
import { Field, SelectField, TextArea } from "../common/Field"
import { Modal } from "../common/Modal"
import { Text } from "../common/Text"

export function PatientHome() {
  const { queue, activePatientToken, patient, consultations, setPage } =
    useQueue()

  const activeItem =
    queue.find((q) => q.token === activePatientToken) ||
    queue.find((q) => q.status !== "Done" && q.status !== "Removed") ||
    null

  const peopleAhead = activeItem
    ? queue.filter(
        (q) =>
          q.doctorId === activeItem.doctorId &&
          ["Waiting", "Window open", "Checked in"].includes(q.status) &&
          q.token < activeItem.token,
      ).length
    : 0

  const recentConsultations = consultations.slice(0, 2)

  return (
    <div className="content-stack patient-width">
      <div className="patient-greeting">
        <div>
          <Text size="xl" weight="bold">
            Good morning, {patient.name.split(" ")[0]}
          </Text>
          <Text tone="muted">How can we help you today?</Text>
        </div>
        <span className="avatar avatar-large">
          {patient.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)}
        </span>
      </div>

      <button
        className="search-hero"
        type="button"
        onClick={() => setPage("Find a doctor")}
      >
        <Search size={21} />
        <span>Search doctor, specialty, disease or clinic</span>
      </button>

      <div className="location-row">
        <Button variant="secondary" icon={LocateFixed}>
          Use my location
        </Button>
        <Button variant="ghost" icon={MapPin}>
          Enter PIN code (560001)
        </Button>
      </div>

      <div>
        <div className="section-title">
          <Text size="lg" weight="bold">
            Your active queue
          </Text>
          {activeItem && (
            <Button variant="ghost" onClick={() => setPage("My queue")}>
              View details <ArrowRight size={16} />
            </Button>
          )}
        </div>

        {activeItem ? (
          <Card className="active-queue" onClick={() => setPage("My queue")}>
            <div className="token-box">
              <Text size="xs" weight="bold">
                YOUR TOKEN
              </Text>
              <Text size="display" weight="bold">
                {activeItem.token}
              </Text>
            </div>
            <div className="queue-summary">
              <Badge>{activeItem.status}</Badge>
              <Text size="lg" weight="bold">
                {peopleAhead} {peopleAhead === 1 ? "person" : "people"} ahead
              </Text>
              <Text tone="muted">
                Estimated {activeItem.estimatedWaitMinutes}–
                {activeItem.estimatedWaitMinutes + 10} min ·{" "}
                {activeItem.doctorName}
              </Text>
            </div>
            <ArrowRight className="card-arrow" size={22} />
          </Card>
        ) : (
          <Card
            className="empty-state"
            style={{ padding: "28px", textAlign: "center", cursor: "pointer" }}
            onClick={() => setPage("Find a doctor")}
          >
            <div className="empty-icon">
              <CalendarDays />
            </div>
            <Text weight="bold">No active queue token</Text>
            <Text size="sm" tone="muted">
              You do not have any appointments in progress. Click to find a
              doctor and join.
            </Text>
            <Button icon={Plus} style={{ marginTop: "12px" }}>
              Find a doctor
            </Button>
          </Card>
        )}
      </div>

      <div>
        <div className="section-title">
          <Text size="lg" weight="bold">
            Recent visits
          </Text>
          <Button variant="ghost" onClick={() => setPage("History")}>
            View all
          </Button>
        </div>
        {recentConsultations.map((c) => (
          <Card
            className="visit-row"
            key={c.id}
            onClick={() => setPage("History")}
            style={{ cursor: "pointer", marginBottom: "8px" }}
          >
            <span className="calendar-icon">
              <CalendarDays />
            </span>
            <div>
              <Text weight="semibold">{c.doctorName}</Text>
              <Text size="sm" tone="muted">
                {c.diagnosis} · {c.date}
              </Text>
            </div>
            <Badge>Done</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function DoctorSearch({
  onSelectDoctor,
}: {
  onSelectDoctor?: (d: Doctor) => void
}) {
  const { doctors, setPage } = useQueue()
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("Nearest")

  const filteredDoctors = doctors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.specialty.toLowerCase().includes(query.toLowerCase())
    if (activeFilter === "Available today")
      return matchesSearch && d.availableToday
    return matchesSearch
  })

  return (
    <div className="content-stack patient-width">
      <div className="back-title">
        <IconButton
          icon={ArrowLeft}
          label="Back to Home"
          onClick={() => setPage("Home")}
        />
        <div>
          <Text size="xl" weight="bold">
            Doctors near you
          </Text>
          <Text tone="muted">
            22 available today around Richmond Road (560001)
          </Text>
        </div>
      </div>

      <Field
        icon={Search}
        placeholder="Search doctor or specialty (e.g., General, Internal)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="chip-row">
        {["Nearest", "Shortest wait", "Available today", "Language", "Fee"].map(
          (chip) => (
            <button
              key={chip}
              type="button"
              className={`chip ${activeFilter === chip ? "chip-active" : ""}`}
              onClick={() => setActiveFilter(chip)}
            >
              {chip}
            </button>
          ),
        )}
      </div>

      <div className="emergency-notice">
        <AlertCircle size={21} />
        <Text size="sm">
          <strong>Emergency?</strong> If this is life-threatening, call 112 or
          visit the nearest emergency room immediately.
        </Text>
      </div>

      <div className="doctor-card-list">
        {filteredDoctors.map((doc) => (
          <Card className="doctor-card-modern" key={doc.id}>
            <div className="doctor-card-body">
              <img
                src={doc.photo}
                alt={`${doc.name}, ${doc.specialty}`}
                className="doctor-avatar"
              />
              <div className="doctor-details">
                <div className="doctor-header-row">
                  <div>
                    <Text size="md" weight="bold" className="doctor-title">
                      {doc.name}
                    </Text>
                    <Text size="xs" tone="muted">
                      {doc.specialty} · {doc.experienceYears} yrs experience
                    </Text>
                  </div>
                  <span className="doctor-fee-chip">₹{doc.fee}</span>
                </div>

                <div className="doctor-meta-line">
                  <MapPin size={13} />
                  <span>{doc.clinicName} · {doc.distanceKm} km</span>
                  <span className="meta-sep">·</span>
                  <span>{doc.languages.slice(0, 2).join(", ")}</span>
                </div>

                <div className="doctor-wait-pill">
                  <Clock3 size={13} />
                  <span className="wait-accent">Live wait: <strong>{doc.avgWaitMins}</strong></span>
                  <span className="queue-pill-count">({doc.activeQueueCount} in queue)</span>
                </div>
              </div>
            </div>

            <div className="doctor-card-actions">
              <Button
                variant="secondary"
                size="sm"
                full
                onClick={() => {
                  onSelectDoctor?.(doc)
                  setPage("Doctor profile")
                }}
              >
                Doctor profile
              </Button>
              <Button
                size="sm"
                full
                onClick={() => {
                  onSelectDoctor?.(doc)
                  setPage("Join queue")
                }}
              >
                Join queue
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function DoctorProfileView({ doctor }: { doctor?: Doctor }) {
  const { doctors, setPage } = useQueue()
  const currentDoc = doctor || doctors[0]

  return (
    <div className="content-stack patient-width">
      <div className="back-title">
        <IconButton
          icon={ArrowLeft}
          label="Back"
          onClick={() => setPage("Find a doctor")}
        />
        <Text size="xl" weight="bold">
          Doctor profile
        </Text>
      </div>

      <Card className="profile-hero">
        <img src={currentDoc.photo} alt={currentDoc.name} />
        <div>
          <Text size="xl" weight="bold">
            {currentDoc.name}
          </Text>
          <Text tone="teal" weight="semibold">
            {currentDoc.specialty}
          </Text>
          <Text tone="muted">
            {currentDoc.qualification} · {currentDoc.experienceYears} years
            experience
          </Text>
          <div className="meta-row">
            {currentDoc.languages.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <span>₹{currentDoc.fee} consultation</span>
          </div>
        </div>
      </Card>

      <div className="two-col profile-grid">
        <Card>
          <Text size="lg" weight="bold">
            Today at {currentDoc.clinicName}
          </Text>
          <div className="detail-list">
            <Text>
              <Clock3 size={18} /> {currentDoc.timings}
            </Text>
            <Text>
              <MapPin size={18} /> {currentDoc.clinicAddress}
            </Text>
          </div>
          <div className="map-placeholder">
            <MapPin />
            <Text size="sm" weight="semibold">
              Clinic map preview (Richmond Rd)
            </Text>
          </div>
        </Card>
        <Card className="queue-panel">
          <Badge>Waiting</Badge>
          <Text size="display" weight="bold">
            {currentDoc.avgWaitMins}
          </Text>
          <Text tone="muted">
            {currentDoc.activeQueueCount} patients currently in queue
          </Text>
          <Button full onClick={() => setPage("Join queue")}>
            Join queue
          </Button>
          <Text size="xs" tone="muted">
            No upfront payment needed to join. Pay upon arrival at clinic.
          </Text>
        </Card>
      </div>
    </div>
  )
}

export function JoinQueueFlow({ doctor }: { doctor?: Doctor }) {
  const { doctors, patient, joinQueue, setPage } = useQueue()
  const doc = doctor || doctors[0]
  const [who, setWho] = useState("Myself")
  const [reason, setReason] = useState("")
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRel, setNewMemberRel] = useState("Child")
  const [newMemberAge, setNewMemberAge] = useState("8")
  const { addFamilyMember } = useQueue()

  const choices = [
    "Myself",
    ...patient.familyMembers.map((f) => `${f.name} · ${f.relationship}`),
  ]

  const handleConfirm = () => {
    joinQueue({
      doctorId: doc.id,
      forWho: who,
      reason: reason || "General checkup",
    })
    setPage("My queue")
  }

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addFamilyMember(
        newMemberName.trim(),
        newMemberRel,
        parseInt(newMemberAge, 10) || 5,
      )
      setWho(`${newMemberName.trim()} · ${newMemberRel}`)
      setIsFamilyModalOpen(false)
      setNewMemberName("")
    }
  }

  return (
    <div className="content-stack narrow-page">
      <div className="back-title">
        <IconButton
          icon={ArrowLeft}
          label="Back"
          onClick={() => setPage("Doctor profile")}
        />
        <div>
          <Text size="xl" weight="bold">
            Join {doc.name}’s queue
          </Text>
          <Text tone="muted">Usually takes less than a minute.</Text>
        </div>
      </div>

      <Card className="form-card">
        <Text size="lg" weight="bold">
          Who is visiting?
        </Text>
        <div className="choice-grid">
          {choices.map((c) => (
            <button
              key={c}
              type="button"
              className={`choice ${who === c ? "choice-active" : ""}`}
              onClick={() => setWho(c)}
            >
              <UserRound size={20} />
              {c}
              {who === c && <Check size={18} />}
            </button>
          ))}
          <button
            type="button"
            className="choice"
            onClick={() => setIsFamilyModalOpen(true)}
            style={{ borderStyle: "dashed" }}
          >
            <Plus size={20} />+ Add family member
          </button>
        </div>

        <TextArea
          label="Reason for visit"
          placeholder="Briefly describe symptoms, concern, or follow-up reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="summary-line">
          <div>
            <Text weight="semibold">{doc.name}</Text>
            <Text size="sm" tone="muted">
              Today · Estimated wait {doc.avgWaitMins}
            </Text>
          </div>
          <Text weight="bold">₹{doc.fee}</Text>
        </div>

        <Button full onClick={handleConfirm}>
          Confirm and join queue
        </Button>
        <Text size="xs" tone="muted" className="center">
          By joining, you agree to arrive within your check-in window.
        </Text>
      </Card>

      <Modal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        title="Add family member"
        subtitle="Manage visit records for your dependents"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Field
            label="Full name"
            placeholder="e.g. Rohan Sharma"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            required
          />
          <SelectField
            label="Relationship"
            value={newMemberRel}
            onChange={(e) => setNewMemberRel(e.target.value)}
          >
            <option value="Child">Child (Son / Daughter)</option>
            <option value="Spouse">Spouse</option>
            <option value="Parent">Parent (Mother / Father)</option>
            <option value="Other">Other</option>
          </SelectField>
          <Field
            label="Age"
            type="number"
            placeholder="Age in years"
            value={newMemberAge}
            onChange={(e) => setNewMemberAge(e.target.value)}
          />
          <Button full onClick={handleAddMember}>
            Save family member
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export function LiveQueueView() {
  const { queue, activePatientToken, useLatePass, setPage } = useQueue()

  const currentItem =
    queue.find((q) => q.token === activePatientToken) ||
    queue.find((q) => q.patientPhone.includes("98765")) ||
    queue[0]

  const peopleAhead = currentItem
    ? queue.filter(
        (q) =>
          q.doctorId === currentItem.doctorId &&
          ["Waiting", "Window open", "Checked in"].includes(q.status) &&
          q.token < currentItem.token,
      ).length
    : 0

  if (!currentItem) {
    return (
      <div
        className="content-stack narrow-page"
        style={{ textAlign: "center", padding: "40px" }}
      >
        <Text size="xl" weight="bold">
          No queue token found
        </Text>
        <Text tone="muted">
          Please join a queue to follow your live status.
        </Text>
        <Button onClick={() => setPage("Find a doctor")}>Find a doctor</Button>
      </div>
    )
  }

  const isCalled = currentItem.status === "Called"

  return (
    <div className="content-stack queue-page patient-width">
      {isCalled && (
        <div
          className="toast toast-wide"
          style={{
            backgroundColor: "#0f766e",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setPage("Called")}
        >
          <Bell size={24} color="#ffffff" />
          <div style={{ flex: 1 }}>
            <Text weight="bold" tone="inverse">
              It’s your turn! Token {currentItem.token} has been called.
            </Text>
            <Text size="sm" tone="inverse">
              Please proceed immediately to {currentItem.room}
            </Text>
          </div>
          <Button variant="secondary" onClick={() => setPage("Called")}>
            View details
          </Button>
        </div>
      )}

      <div className="queue-top">
        <div>
          <Text size="xs" tone="muted" weight="bold">
            {currentItem.doctorName.toUpperCase()} · {currentItem.room.toUpperCase()}
          </Text>
          <Text size="lg" weight="bold">
            Your live queue
          </Text>
        </div>
        <Badge>{currentItem.status}</Badge>
      </div>

      <Card className="ticket-pass-card">
        <div className="ticket-pass-top">
          <span className="ticket-label">YOUR TOKEN</span>
          <div className="ticket-token-display">{currentItem.token}</div>
        </div>

        <div className="ticket-stats-grid">
          <div className="ticket-stat-box">
            <span className="ticket-stat-value">{peopleAhead}</span>
            <span className="ticket-stat-label">
              {peopleAhead === 1 ? "person ahead" : "people ahead"}
            </span>
          </div>
          <div className="ticket-stat-box">
            <span className="ticket-stat-value">
              {currentItem.estimatedWaitMinutes}–{currentItem.estimatedWaitMinutes + 10}
            </span>
            <span className="ticket-stat-label">minutes estimated</span>
          </div>
        </div>

        <div className="ticket-progress-wrap">
          <div className="ticket-progress-meta">
            <span>Joined at {currentItem.joinedAt}</span>
            <span className="turn-label">Your turn</span>
          </div>
          <div className="ticket-progress-bar">
            <span
              style={{
                width:
                  currentItem.status === "Called"
                    ? "100%"
                    : currentItem.status === "Checked in"
                      ? "75%"
                      : currentItem.status === "Window open"
                        ? "50%"
                        : "25%",
              }}
            />
          </div>
        </div>
      </Card>

      <div className="window-alert-card">
        <div className="window-alert-left">
          <div className="window-alert-icon">
            <Clock3 size={18} />
          </div>
          <div className="window-alert-text">
            <Text size="sm" weight="bold">
              {currentItem.status === "Checked in"
                ? "Checked in & confirmed"
                : `Check in within ${currentItem.windowClosesInMinutes || 14}:30 min`}
            </Text>
            <Text size="xs" tone="muted">
              {currentItem.status === "Checked in"
                ? "You are checked in! Dr. Sharma will call your token soon."
                : "Confirm arrival via QR scanner upon reaching clinic."}
            </Text>
          </div>
        </div>
        {currentItem.status !== "Checked in" && (
          <Button
            size="sm"
            onClick={() => setPage("QR check-in")}
            icon={QrCode}
            className="window-checkin-btn"
          >
            Check in
          </Button>
        )}
      </div>

      <div className="queue-quick-actions">
        <Button
          variant="secondary"
          size="sm"
          full
          disabled={currentItem.latePassUsed}
          onClick={() => useLatePass(currentItem.token)}
        >
          {currentItem.latePassUsed
            ? "Late pass used (+15m)"
            : "I’m running late"}
        </Button>
        <Button
          size="sm"
          full
          onClick={() => setPage("QR check-in")}
        >
          {currentItem.status === "Checked in"
            ? "View QR status"
            : "I’m at the clinic"}
        </Button>
      </div>

      <Card className="attendance-compact-card">
        <div className="attendance-head">
          <div className="attendance-title-group">
            <Text size="sm" weight="bold">Attendance record</Text>
            <span className="attendance-pill">{currentItem.strikes}/3 strikes</span>
          </div>
          <div className="strike-pills">
            <span className={`strike-chip ${currentItem.strikes >= 1 ? "strike-active" : ""}`}>
              1
            </span>
            <span className={`strike-chip ${currentItem.strikes >= 2 ? "strike-active" : ""}`}>
              2
            </span>
            <span className={`strike-chip ${currentItem.strikes >= 3 ? "strike-active" : ""}`}>
              3
            </span>
          </div>
        </div>
        <Text size="xs" tone="muted">
          Missing check-in adds a strike and demotes you 3 slots. 3 strikes cancels token.
        </Text>
      </Card>

      <Text size="xs" tone="muted" className="center auto-refresh-caption">
        ● Live sync active · Updates automatically in real time
      </Text>
    </div>
  )
}

export function QRCheckinView() {
  const { queue, activePatientToken, checkInToken, setPage } = useQueue()
  const [scanState, setScanState] = useState<"idle" | "success" | "failure">(
    "idle",
  )

  const currentItem =
    queue.find((q) => q.token === activePatientToken) ||
    queue.find((q) => q.patientPhone.includes("98765")) ||
    queue[0]

  const handleSimulateScan = () => {
    if (currentItem) {
      checkInToken(currentItem.token)
    }
    setScanState("success")
  }

  return (
    <div className="scanner-page">
      <div className="scanner-head">
        <IconButton
          icon={X}
          label="Close"
          onClick={() => setPage("My queue")}
        />
        <Text size="lg" weight="bold" tone="inverse">
          Scan clinic QR code
        </Text>
        <span />
      </div>

      {scanState === "idle" ? (
        <>
          <div className="scanner-box">
            <span className="corner corner-1" />
            <span className="corner corner-2" />
            <span className="corner corner-3" />
            <span className="corner corner-4" />
            <QrCode size={112} />
          </div>
          <Text tone="inverse" weight="semibold">
            Point your camera at the QR code displayed near reception
          </Text>
          <Text size="sm" className="scanner-muted">
            Checking in confirms your physical presence and moves you to
            priority calling.
          </Text>
          <div className="action-row" style={{ marginTop: "24px" }}>
            <Button variant="secondary" onClick={() => setScanState("failure")}>
              Preview failure
            </Button>
            <Button onClick={handleSimulateScan}>
              Simulate successful scan
            </Button>
          </div>
        </>
      ) : scanState === "success" ? (
        <Card className="scan-success">
          <span className="success-icon">
            <Check size={34} />
          </span>
          <Text size="xl" weight="bold">
            You’re checked in!
          </Text>
          <Text tone="muted">
            Please wait in the clinic waiting area. We will alert your device
            when Dr. Sharma calls token <strong>{currentItem?.token}</strong>.
          </Text>
          <Badge>Checked in</Badge>
          <Button full onClick={() => setPage("My queue")}>
            Back to live queue
          </Button>
        </Card>
      ) : (
        <Card className="scan-success">
          <span className="notice-icon notice-red">
            <X size={30} />
          </span>
          <Text size="xl" weight="bold">
            We couldn’t check you in
          </Text>
          <Text tone="muted">
            This QR code has expired or belongs to a different clinic room.
            Please ask the front-desk receptionist for assistance.
          </Text>
          <div className="action-row">
            <Button variant="secondary" onClick={() => setPage("My queue")}>
              Back
            </Button>
            <Button onClick={() => setScanState("idle")}>Try again</Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export function CalledPageView() {
  const { queue, activePatientToken, setPage } = useQueue()
  const currentItem =
    queue.find((q) => q.token === activePatientToken) ||
    queue.find((q) => q.status === "Called") ||
    queue[0]

  return (
    <div className="called-page">
      <span className="called-bell">
        <Bell size={38} />
      </span>
      <Badge>Called</Badge>
      <Text className="called-title" weight="bold">
        It’s your turn
      </Text>
      <Text size="xl">Please proceed immediately to</Text>
      <div className="room-number">{currentItem?.room || "Room 2"}</div>
      <Text tone="muted">
        {currentItem?.doctorName || "Dr. Arjun Sharma"} is waiting to see you
        now.
      </Text>
      <Button onClick={() => setPage("History")}>I’m going now</Button>
    </div>
  )
}

export function NoticePageView() {
  const { setPage } = useQueue()

  return (
    <div className="content-stack narrow-page">
      <PageTitle
        title="Queue notices"
        subtitle="Examples of penalty and strike policies."
      />
      <Card className="notice-card">
        <span className="notice-icon notice-coral">
          <Clock3 />
        </span>
        <Badge>Skipped</Badge>
        <Text size="xl" weight="bold">
          You missed your call
        </Text>
        <Text tone="muted">
          Because you did not answer the call within 3 minutes, you have been
          moved back 3 positions and added 1 strike. Your new position is 9.
        </Text>
        <Button full onClick={() => setPage("My queue")}>
          View new position
        </Button>
      </Card>
      <Card className="notice-card">
        <span className="notice-icon notice-red">
          <X />
        </span>
        <Badge>Removed</Badge>
        <Text size="xl" weight="bold">
          Removed from queue
        </Text>
        <Text tone="muted">
          You reached the clinic’s maximum limit of 3 strikes. You may rejoin if
          the doctor's queue remains open.
        </Text>
        <Button
          variant="secondary"
          full
          onClick={() => setPage("Find a doctor")}
        >
          Find another queue
        </Button>
      </Card>
    </div>
  )
}

export function HistoryPageView() {
  const { consultations } = useQueue()
  const [selectedVisit, setSelectedVisit] =
    useState<typeof consultations[0] | null>(null)

  return (
    <div className="content-stack patient-width">
      <PageTitle
        title="Medical history"
        subtitle="Your consultations, clinical diagnoses, and prescriptions."
      />
      <div className="visit-list-compact">
        {consultations.map((visit) => (
          <Card className="history-card-compact" key={visit.id}>
            <div className="history-card-top">
              <div className="history-date-chip">
                <FileText size={13} />
                <span>{visit.date} · {visit.time}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={() => setSelectedVisit(visit)}
                className="history-pdf-pill"
              >
                PDF
              </Button>
            </div>

            <div className="history-doctor-name">
              <Text size="sm" weight="bold">{visit.doctorName}</Text>
            </div>

            <div className="history-diagnosis-tag">
              <Text size="sm" weight="semibold" className="diagnosis-text">
                {visit.diagnosis}
              </Text>
            </div>

            <div className="history-rx-line">
              <Text size="xs" tone="muted">
                {visit.prescriptions.length > 0 ? (
                  <>
                    <span className="rx-label">Rx:</span>{" "}
                    {visit.prescriptions.map((p) => `${p.medicine} (${p.dose})`).join(", ")}
                  </>
                ) : (
                  "No medications prescribed"
                )}
              </Text>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={selectedVisit !== null}
        onClose={() => setSelectedVisit(null)}
        title="Consultation Summary & Prescription"
        subtitle={`Visit on ${selectedVisit?.date} · ${selectedVisit?.doctorName}`}
      >
        {selectedVisit && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                padding: "12px",
                background: "#f7f9f8",
                borderRadius: "8px",
              }}
            >
              <Text size="sm" weight="bold" tone="muted">
                DIAGNOSIS
              </Text>
              <Text weight="semibold">{selectedVisit.diagnosis}</Text>
            </div>

            <div>
              <Text size="sm" weight="bold" tone="muted">
                CLINICAL NOTES
              </Text>
              <Text>{selectedVisit.clinicalNotes}</Text>
            </div>

            <div>
              <Text
                size="sm"
                weight="bold"
                tone="muted"
                style={{ marginBottom: "8px" }}
              >
                PRESCRIBED MEDICINES
              </Text>
              {selectedVisit.prescriptions.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderBottom: "1px solid #dfe5e3",
                  }}
                >
                  <div>
                    <Text weight="semibold">{p.medicine}</Text>
                    <Text size="xs" tone="muted">
                      {p.dose} · {p.frequency}
                    </Text>
                  </div>
                  <Badge>{p.duration}</Badge>
                </div>
              ))}
            </div>

            <Button
              icon={Download}
              full
              onClick={() => {
                alert(
                  `Downloading digital prescription PDF for ${selectedVisit.patientName}...`,
                )
                setSelectedVisit(null)
              }}
            >
              Download official PDF summary
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export function ProfilePageView() {
  const {
    patient,
    updatePatientProfile,
    setPatientPassword,
    patientLogout,
    setPage,
  } = useQueue()
  const [name, setName] = useState(patient.name)
  const [phone, setPhone] = useState(patient.phone)
  const [lang, setLang] = useState(patient.preferredLanguage)
  const [newPassword, setNewPassword] = useState("")
  const [saved, setSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [copiedReferral, setCopiedReferral] = useState(false)

  const handleSave = () => {
    updatePatientProfile({ name, phone, preferredLanguage: lang })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSetPassword = () => {
    if (newPassword.trim().length >= 6) {
      setPatientPassword(newPassword.trim())
      setPasswordSaved(true)
      setNewPassword("")
      setTimeout(() => setPasswordSaved(false), 3000)
    }
  }

  return (
    <div className="content-stack patient-width">
      {/* Sleek Profile Header Card with Docked Sign Out */}
      <Card className="profile-hero-card">
        <div className="profile-hero-main">
          <div className="profile-hero-avatar">
            {patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="profile-hero-info">
            <div className="profile-hero-name-row">
              <Text size="md" weight="bold">{patient.name}</Text>
              <span className="verified-pill">
                <ShieldCheck size={13} /> Verified
              </span>
            </div>
            <Text size="xs" tone="muted">
              {patient.phone} · Aarogya Family Clinic
            </Text>
          </div>
        </div>
        <Button
          variant="danger"
          size="sm"
          icon={LogOut}
          onClick={patientLogout}
          className="profile-logout-btn"
        >
          Sign out
        </Button>
      </Card>

      {saved && (
        <div className="toast">
          <CheckCircle2 size={20} />
          <Text weight="semibold">Personal details updated successfully</Text>
        </div>
      )}

      {passwordSaved && (
        <div className="toast">
          <CheckCircle2 size={20} />
          <Text weight="semibold">
            Account password updated! You can now log in using password.
          </Text>
        </div>
      )}

      {/* Modern Compact Identifier & Referral Chips Strip */}
      <div className="profile-id-strip">
        <div className="profile-id-chip">
          <div className="id-chip-meta">
            <span className="id-chip-label">PATIENT IDENTIFIER</span>
            <span className="id-chip-value">{patient.id}</span>
          </div>
          <button
            type="button"
            className="id-copy-btn"
            title="Copy Patient ID"
            onClick={() => {
              navigator.clipboard?.writeText(patient.id)
              setCopiedId(true)
              setTimeout(() => setCopiedId(false), 2000)
            }}
          >
            {copiedId ? <Check size={14} color="#0f766e" /> : <Copy size={14} />}
            <span>{copiedId ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div className="profile-id-chip">
          <div className="id-chip-meta">
            <span className="id-chip-label">REFERRAL CODE</span>
            <span className="id-chip-value referral-badge">{patient.referralId}</span>
          </div>
          <button
            type="button"
            className="id-copy-btn"
            title="Copy Referral Code"
            onClick={() => {
              navigator.clipboard?.writeText(patient.referralId)
              setCopiedReferral(true)
              setTimeout(() => setCopiedReferral(false), 2000)
            }}
          >
            {copiedReferral ? <Check size={14} color="#0f766e" /> : <Copy size={14} />}
            <span>{copiedReferral ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      <div className="two-col">
        <div className="content-stack">
          <Card>
            <Text size="lg" weight="bold">
              Personal details
            </Text>
            <Field
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Field
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <SelectField
              label="Preferred language"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="English">English</option>
              <option value="हिन्दी">हिन्दी</option>
              <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
            </SelectField>
            <Button onClick={handleSave}>Save changes</Button>
          </Card>

          <Card>
            <Text size="lg" weight="bold">
              Password login security
            </Text>
            <Text size="sm" tone="muted">
              Set or update your password to sign in directly without waiting
              for mobile SMS OTP.
            </Text>
            <Field
              label="New account password"
              placeholder="Minimum 6 characters"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              variant="secondary"
              onClick={handleSetPassword}
              disabled={newPassword.length < 6}
            >
              Save login password
            </Button>
          </Card>
        </div>

        <div className="content-stack">
          <Card>
            <div className="section-title">
              <Text size="lg" weight="bold">
                Family members
              </Text>
              <Button
                variant="ghost"
                icon={Plus}
                onClick={() => setPage("Join queue")}
              >
                Add
              </Button>
            </div>
            {patient.familyMembers.length === 0 ? (
              <Text size="sm" tone="muted">
                No family members registered yet.
              </Text>
            ) : (
              patient.familyMembers.map((fam) => (
                <div className="person-row" key={fam.id}>
                  <span className="avatar">
                    {fam.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </span>
                  <div>
                    <Text weight="semibold">{fam.name}</Text>
                    <Text size="sm" tone="muted">
                      {fam.relationship} · {fam.age} years
                    </Text>
                  </div>
                </div>
              ))
            )}
          </Card>

          <Card>
            <Text size="lg" weight="bold">
              Health details
            </Text>
            <div className="label-block">
              <Text size="sm" tone="muted">
                DOCUMENTED ALLERGIES
              </Text>
              <div className="chip-row">
                {patient.allergies.map((a) => (
                  <span className="chip" key={a}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="label-block">
              <Text size="sm" tone="muted">
                CHRONIC CONDITIONS
              </Text>
              <div className="chip-row">
                {patient.chronicConditions.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function LoginPageView() {
  const { setPage } = useQueue()
  const [phone, setPhone] = useState("+91 98765 43210")
  const [hasSentOtp, setHasSentOtp] = useState(false)
  const [otpDigits, setOtpDigits] = useState(["4", "8", "2", "1", "9", "0"])

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Text size="xl" weight="bold">
            QTrack
          </Text>
        </div>
        <div>
          <Text size="xl" weight="bold">
            {hasSentOtp ? "Enter verification code" : "Welcome to QTrack"}
          </Text>
          <Text tone="muted">
            {hasSentOtp
              ? `We sent a 6-digit code to ${phone}`
              : "Join your clinic queue from anywhere with seamless updates."}
          </Text>
        </div>

        {hasSentOtp ? (
          <>
            <div className="otp">
              {otpDigits.map((digit, i) => (
                <span key={i} style={{ fontWeight: 600 }}>
                  {digit}
                </span>
              ))}
            </div>
            <Text size="sm" tone="muted">
              Resend code in 00:24 ·{" "}
              <button
                type="button"
                onClick={() => setHasSentOtp(false)}
                style={{
                  background: "none",
                  border: "none",
                  textDecoration: "underline",
                  color: "#0f766e",
                  cursor: "pointer",
                }}
              >
                Edit number
              </button>
            </Text>
            <Button full onClick={() => setPage("Home")}>
              Verify and continue
            </Button>
          </>
        ) : (
          <>
            <Field
              label="Mobile phone number"
              icon={Phone}
              placeholder="+91 98765 43210"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button full onClick={() => setHasSentOtp(true)}>
              Send OTP
            </Button>
            <Text size="xs" tone="muted">
              We only use your number for live queue updates and doctor
              notifications.
            </Text>
          </>
        )}
      </Card>
    </div>
  )
}

function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="page-title">
      <div>
        <Text size="xl" weight="bold">
          {title}
        </Text>
        {subtitle && <Text tone="muted">{subtitle}</Text>}
      </div>
      {action}
    </div>
  )
}
