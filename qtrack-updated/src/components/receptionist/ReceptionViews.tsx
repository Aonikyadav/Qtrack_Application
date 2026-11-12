import { useState } from "react"
import {
  Activity,
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  LogOut,
  MoreHorizontal,
  Plus,
  QrCode,
  Search,
  X,
} from "lucide-react"
import { useQueue } from "../../context/QueueContext"
import type { QueueItem } from "../../types"
import { Badge } from "../common/Badge"
import { Button, IconButton } from "../common/Button"
import { Card } from "../common/Card"
import { Field, SelectField } from "../common/Field"
import { Modal } from "../common/Modal"
import { Text } from "../common/Text"

export function ReceptionLiveQueue({
  onAddWalkIn,
}: {
  onAddWalkIn: () => void
}) {
  const { queue, markArrived, flagPriority, removePatient } = useQueue()
  const [selectedDoctorTab, setSelectedDoctorTab] =
    useState<"all" | "doc-sharma" | "doc-nair">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [actionItem, setActionItem] = useState<QueueItem | null>(null)
  const [priorityReason, setPriorityReason] = useState("")
  const [showAnnouncement, setShowAnnouncement] = useState(true)

  const activeQueue = queue.filter(
    (q) => !["Done", "Removed"].includes(q.status),
  )

  const waitingCount = queue.filter((q) =>
    ["Waiting", "Window open"].includes(q.status),
  ).length
  const checkedInCount = queue.filter((q) => q.status === "Checked in").length
  const seenTodayCount = queue.filter((q) => q.status === "Done").length

  const filteredQueue = activeQueue.filter((item) => {
    if (selectedDoctorTab !== "all" && item.doctorId !== selectedDoctorTab)
      return false
    if (statusFilter === "priority" && !item.isPriority) return false
    if (
      statusFilter !== "all" &&
      statusFilter !== "priority" &&
      item.status !== statusFilter
    )
      return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        item.token.toLowerCase().includes(q) ||
        item.patientName.toLowerCase().includes(q) ||
        item.patientPhone.includes(q)
      )
    }
    return true
  })

  return (
    <div className="content-stack">
      {showAnnouncement && (
        <div className="alert-strip" style={{ padding: "8px 12px", borderRadius: "10px" }}>
          <AlertCircle size={16} />
          <Text size="xs" style={{ flex: 1 }}>
            <strong>Clinic notice:</strong> Next consultation window opens in 5 min. Dr. Sharma & Dr. Nair on schedule.
          </Text>
          <button
            type="button"
            className="alert-dismiss-btn"
            onClick={() => setShowAnnouncement(false)}
            style={{ background: "transparent", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}
            title="Dismiss announcement"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="page-title">
        <div>
          <Text size="lg" weight="bold">
            Live receptionist queue
          </Text>
          <Text size="xs" tone="muted">
            Tuesday, 18 June · {activeQueue.length} active patients in clinic
          </Text>
        </div>
        <Button size="sm" icon={Plus} onClick={onAddWalkIn}>
          Add walk-in
        </Button>
      </div>

      {/* Streamlined Reception 4-metric strip */}
      <div className="reception-stats-strip">
        <div className="rec-stat-chip">
          <span className="rec-stat-label">WAITING</span>
          <span className="rec-stat-val text-teal">{waitingCount}</span>
        </div>
        <div className="rec-stat-chip">
          <span className="rec-stat-label">CHECKED IN</span>
          <span className="rec-stat-val text-green">{checkedInCount}</span>
        </div>
        <div className="rec-stat-chip">
          <span className="rec-stat-label">SEEN TODAY</span>
          <span className="rec-stat-val">{seenTodayCount}</span>
        </div>
        <div className="rec-stat-chip">
          <span className="rec-stat-label">AVG. WAIT</span>
          <span className="rec-stat-val">26m</span>
        </div>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={selectedDoctorTab === "doc-sharma" ? "tab-active" : ""}
          onClick={() => setSelectedDoctorTab("doc-sharma")}
        >
          Dr. Sharma{" "}
          <span>
            {activeQueue.filter((q) => q.doctorId === "doc-sharma").length}
          </span>
        </button>
        <button
          type="button"
          className={selectedDoctorTab === "doc-nair" ? "tab-active" : ""}
          onClick={() => setSelectedDoctorTab("doc-nair")}
        >
          Dr. Nair{" "}
          <span>
            {activeQueue.filter((q) => q.doctorId === "doc-nair").length}
          </span>
        </button>
        <button
          type="button"
          className={selectedDoctorTab === "all" ? "tab-active" : ""}
          onClick={() => setSelectedDoctorTab("all")}
        >
          All doctors <span>{activeQueue.length}</span>
        </button>
      </div>

      <div className="table-toolbar">
        <Field
          icon={Search}
          placeholder="Search patient name, phone or token (e.g., A-020)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {statusFilter === "all" ? "Filter" : statusFilter}{" "}
          <ChevronDown size={16} />
        </Button>
      </div>

      {showFilters && (
        <div className="mobile-filter-pills" style={{ display: "flex" }}>
          {[
            ["all", "All"],
            ["Checked in", "Checked in"],
            ["Window open", "Window open"],
            ["Waiting", "Waiting"],
            ["Skipped", "Skipped"],
            ["priority", "Priority"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`mobile-pill-btn ${statusFilter === key ? "mobile-pill-active" : ""}`}
              onClick={() => setStatusFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <Card className="table-card">
        <div className="queue-table">
          <div className="table-row table-head">
            <span>Token</span>
            <span>Patient</span>
            <span>Phone</span>
            <span>Status</span>
            <span>Wait</span>
            <span>Strikes</span>
            <span>Actions</span>
          </div>

          {filteredQueue.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <Text tone="muted">No matching patients in this view.</Text>
            </div>
          ) : (
            filteredQueue.map((item) => (
              <div className="table-row queue-card" key={item.token}>
                <span className="cell-token">
                  <strong>{item.token}</strong>
                </span>
                <span className="cell-patient">
                  <strong>{item.patientName}</strong>
                  {item.isPriority && <Badge dot={false}>Priority</Badge>}
                </span>
                <span className="cell-phone">
                  <span className="meta-label">Phone: </span>
                  {item.patientPhone}
                </span>
                <span className="mobile-only queue-submeta">
                  {item.doctorName} · {item.room}
                  {item.reasonForVisit ? ` · ${item.reasonForVisit}` : ""}
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
                  {item.status !== "Checked in" &&
                    item.status !== "Called" &&
                    item.status !== "In consultation" && (
                      <Button
                        variant="secondary"
                        onClick={() => markArrived(item.token)}
                      >
                        Mark arrived
                      </Button>
                    )}
                  <IconButton
                    icon={MoreHorizontal}
                    label="Queue actions"
                    onClick={() => setActionItem(item)}
                  />
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal
        isOpen={actionItem !== null}
        onClose={() => setActionItem(null)}
        title={`Queue Actions for ${actionItem?.token} (${actionItem?.patientName})`}
        subtitle={`Doctor: ${actionItem?.doctorName} · Current Status: ${actionItem?.status}`}
      >
        {actionItem && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Field
              label="Priority Reason (Optional)"
              placeholder="e.g. High fever, pregnant, senior citizen"
              value={priorityReason}
              onChange={(e) => setPriorityReason(e.target.value)}
            />
            <Button
              onClick={() => {
                flagPriority(
                  actionItem.token,
                  priorityReason || "Clinical urgency",
                )
                setActionItem(null)
                setPriorityReason("")
              }}
            >
              Flag as Priority
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                markArrived(actionItem.token)
                setActionItem(null)
              }}
            >
              Confirm Arrived (Checked In)
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                removePatient(actionItem.token, "Removed by front desk")
                setActionItem(null)
              }}
            >
              Remove from Queue
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export function QuickWalkInView() {
  const { doctors, addWalkIn, setPage } = useQueue()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [doctorId, setDoctorId] = useState(doctors[0].id)
  const [reason, setReason] = useState("")
  const [isPriority, setIsPriority] = useState(false)
  const [issuedToken, setIssuedToken] = useState<QueueItem | null>(null)

  const handleIssueToken = () => {
    if (!name.trim()) return
    const newItem = addWalkIn({
      patientName: name.trim(),
      patientPhone: phone.trim() || "+91 99999 00000",
      doctorId,
      reason: reason || "Walk-in consultation",
      isPriority,
    })
    setIssuedToken(newItem)
  }

  const selectedDoc = doctors.find((d) => d.id === doctorId) || doctors[0]

  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Quick walk-in token
          </Text>
          <Text tone="muted">Issue an arrival token in about 10 seconds.</Text>
        </div>
        <Button
          variant="ghost"
          className="walkin-back-btn"
          onClick={() => setPage("Live queue")}
        >
          View live queue
        </Button>
      </div>

      <div className="walkin-layout">
        <Card className="form-card">
          <div className="form-grid">
            <Field
              label="Patient name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Field
              label="Phone number"
              placeholder="+91"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <SelectField
              label="Assigned Doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty})
                </option>
              ))}
            </SelectField>
            <Field
              label="Reason for visit (optional)"
              placeholder="e.g. Fever, follow-up, dressing"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="mobile-only symptom-chip-row">
            {[
              "Walk-in consultation",
              "Fever & Cold",
              "Follow-up visit",
              "Report review",
              "Dressing / Injection",
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                className={`symptom-chip ${reason === preset ? "symptom-chip-active" : ""}`}
                onClick={() => setReason(preset)}
              >
                {preset}
              </button>
            ))}
          </div>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={isPriority}
              onChange={(e) => setIsPriority(e.target.checked)}
            />
            <span className="toggle" />
            <div>
              <Text weight="semibold">Priority patient</Text>
              <Text size="sm" tone="muted">
                Requires clinical reason; highlights with an orange badge on
                queue table.
              </Text>
            </div>
          </label>

          <Button full icon={Plus} onClick={handleIssueToken}>
            {issuedToken
              ? `Token ${issuedToken.token} Issued!`
              : "Add and issue token"}
          </Button>
        </Card>

        <Card className="ticket-preview">
          <Text size="xs" weight="bold" tone="muted">
            PRINT TICKET PREVIEW
          </Text>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Text size="lg" weight="bold">
              QTrack
            </Text>
          </div>
          <div className="ticket-token">
            {issuedToken ? issuedToken.token : "A-025"}
          </div>
          <Text weight="bold">{selectedDoc.name}</Text>
          <Text size="sm" tone="muted">
            Est. wait {issuedToken ? issuedToken.estimatedWaitMinutes : 35}{" "}
            minutes
          </Text>
          <div className="fake-qr">
            <QrCode size={80} />
          </div>
          <Text size="xs" tone="muted">
            Scan for live mobile queue updates
          </Text>
          <Button
            variant="secondary"
            onClick={() => {
              window.print()
            }}
          >
            Print token slip
          </Button>
        </Card>
      </div>
    </div>
  )
}

export function ArrivalsPageView() {
  const { queue, markArrived } = useQueue()
  const [arrivalTab, setArrivalTab] = useState<"all" | "pending" | "arrived">(
    "all",
  )

  const arrivalCandidates = queue.filter((q) =>
    ["Window open", "Checked in", "Waiting"].includes(q.status),
  )

  const filteredArrivals = arrivalCandidates.filter((item) => {
    if (arrivalTab === "pending") return item.status !== "Checked in"
    if (arrivalTab === "arrived") return item.status === "Checked in"
    return true
  })

  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Arrivals monitor
          </Text>
          <Text tone="muted">
            Patients whose check-in window is active or who are ready at
            reception.
          </Text>
        </div>
        <Badge>Window open</Badge>
      </div>

      <div className="mobile-only mobile-filter-pills">
        <button
          type="button"
          className={`mobile-pill-btn ${arrivalTab === "all" ? "mobile-pill-active" : ""}`}
          onClick={() => setArrivalTab("all")}
        >
          All ({arrivalCandidates.length})
        </button>
        <button
          type="button"
          className={`mobile-pill-btn ${arrivalTab === "pending" ? "mobile-pill-active" : ""}`}
          onClick={() => setArrivalTab("pending")}
        >
          Awaiting Check-in (
          {arrivalCandidates.filter((i) => i.status !== "Checked in").length})
        </button>
        <button
          type="button"
          className={`mobile-pill-btn ${arrivalTab === "arrived" ? "mobile-pill-active" : ""}`}
          onClick={() => setArrivalTab("arrived")}
        >
          Checked In (
          {arrivalCandidates.filter((i) => i.status === "Checked in").length})
        </button>
      </div>

      <div className="arrival-grid">
        {filteredArrivals.length === 0 ? (
          <Card>
            <Text tone="muted">No arrival candidates in queue right now.</Text>
          </Card>
        ) : (
          filteredArrivals.slice(0, 6).map((item) => {
            const isArrived = item.status === "Checked in"
            return (
              <Card className="arrival-card" key={item.token}>
                <div>
                  <Badge>{item.status}</Badge>
                  <Text size="xl" weight="bold">
                    {item.token} · {item.patientName}
                  </Text>
                  <Text tone="muted">
                    {item.doctorName} ·{" "}
                    {isArrived
                      ? "Arrived & present"
                      : `Window closes in ${item.windowClosesInMinutes || 12} min`}
                  </Text>
                </div>
                <Button
                  disabled={isArrived}
                  icon={Check}
                  onClick={() => markArrived(item.token)}
                >
                  {isArrived ? "Arrived" : "Mark arrived"}
                </Button>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export function ActivityLogView() {
  const { auditLogs } = useQueue()
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredLogs = auditLogs.filter((log) =>
    typeFilter === "all" ? true : log.type === typeFilter,
  )

  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Clinic activity log
          </Text>
          <Text tone="muted">
            A transparent audit record of all priority assignments, overrides,
            and token actions.
          </Text>
        </div>
      </div>

      <div className="mobile-only mobile-filter-pills">
        {[
          ["all", "All"],
          ["priority", "Priority"],
          ["checkin", "Check-in"],
          ["call", "Calls"],
          ["reorder", "Reorder"],
          ["remove", "Removed"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`mobile-pill-btn ${typeFilter === key ? "mobile-pill-active" : ""}`}
            onClick={() => setTypeFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <Card className="activity-log-card">
        {filteredLogs.length === 0 ? (
          <Text tone="muted">No activity recorded for this filter.</Text>
        ) : (
          filteredLogs.map((log, index) => (
            <div className="log-row" key={log.id}>
              <span className={`log-icon log-${index % 3}`}>
                <Activity size={17} />
              </span>
              <div className="log-body" style={{ flex: 1 }}>
                <Text weight="semibold">{log.action}</Text>
                <Text size="sm" tone="muted">
                  {log.actor} · {log.time}
                </Text>
                <Text size="sm">Reason: {log.reason}</Text>
              </div>
              <Badge dot={false} className="log-type-badge">
                {log.type}
              </Badge>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}

export function StaffLoginView() {
  const { enterStaffView } = useQueue()
  const [email, setEmail] = useState("sneha@aarogyaclinic.in")
  const [roleSelect, setRoleSelect] =
    useState<"Receptionist" | "Doctor" | "Admin">("Receptionist")

  const handleSignIn = () => {
    enterStaffView(
      roleSelect,
      roleSelect === "Doctor" ? "Overview" : "Live queue",
    )
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Text size="xl" weight="bold">
          QTrack Staff
        </Text>
        <div>
          <Text size="xl" weight="bold">
            Staff sign in
          </Text>
          <Text tone="muted">Aarogya Family Clinic portal</Text>
        </div>
        <SelectField
          label="Select workspace role"
          value={roleSelect}
          onChange={(e) => setRoleSelect(e.target.value as any)}
        >
          <option value="Receptionist">Receptionist Workspace</option>
          <option value="Doctor">Doctor Workspace</option>
          <option value="Admin">Admin Workspace</option>
        </SelectField>
        <Field
          label="Email or staff ID"
          placeholder="name@clinic.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          placeholder="••••••••"
          type="password"
          defaultValue="supersecret"
        />
        <Button full onClick={handleSignIn}>
          Sign in securely
        </Button>
        <Text size="sm" tone="teal">
          Need IT support or password reset?
        </Text>
      </Card>
    </div>
  )
}

export function ReceptionProfilePageView() {
  const { currentStaff, staffLogout } = useQueue()
  const [deskStatus, setDeskStatus] = useState<"online" | "break">("online")
  const [saved, setSaved] = useState(false)

  return (
    <div className="content-stack">
      {/* Profile Header Card */}
      <Card className="profile-hero-card">
        <div className="profile-hero-main">
          <div
            className="profile-hero-avatar"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
            }}
          >
            SK
          </div>
          <div className="profile-hero-info">
            <div className="profile-hero-name-row">
              <Text size="md" weight="bold">
                {currentStaff?.name || "Sneha Kapoor"}
              </Text>
              <span
                className="verified-pill"
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  borderColor: "#bfdbfe",
                }}
              >
                <CheckCircle2 size={12} /> Front Desk Head
              </span>
            </div>
            <Text size="xs" tone="muted">
              Staff ID: {currentStaff?.staffId || "REC-201"} · Aarogya Family
              Clinic
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

      {/* Desk Status Toggle */}
      <Card style={{ padding: "12px 14px" }}>
        <Text
          size="xs"
          weight="bold"
          tone="muted"
          style={{ letterSpacing: "0.06em", marginBottom: "8px" }}
        >
          FRONT DESK STATION STATUS
        </Text>
        <div
          className="status-choice-grid status-choice-grid-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          <button
            type="button"
            className={`choice status-choice-btn ${deskStatus === "online" ? "choice-active" : ""}`}
            style={{
              minHeight: "44px",
              padding: "6px",
              fontSize: "12px",
              fontWeight: 600,
            }}
            onClick={() => setDeskStatus("online")}
          >
            🟢 Desk Active (Station 1)
          </button>
          <button
            type="button"
            className={`choice status-choice-btn ${deskStatus === "break" ? "choice-active" : ""}`}
            style={{
              minHeight: "44px",
              padding: "6px",
              fontSize: "12px",
              fontWeight: 600,
            }}
            onClick={() => setDeskStatus("break")}
          >
            ☕ Shift Break
          </button>
        </div>
      </Card>

      {/* Station Information & Equipment */}
      <div className="profile-id-strip">
        <div className="profile-id-chip">
          <div className="id-chip-meta">
            <span className="id-chip-label">ASSIGNED SHIFT</span>
            <span
              className="id-chip-value"
              style={{ fontSize: "15px", color: "#1d4ed8" }}
            >
              Morning Shift
            </span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              08:30 AM – 04:30 PM (Mon-Sat)
            </span>
          </div>
        </div>

        <div className="profile-id-chip">
          <div className="id-chip-meta">
            <span className="id-chip-label">TOKEN PRINTER</span>
            <span
              className="id-chip-value"
              style={{ fontSize: "15px", color: "#166534" }}
            >
              EPSON TM-T82X
            </span>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Thermal USB Connected
            </span>
          </div>
        </div>
      </div>

      {/* Reception Details */}
      <Card>
        <Text size="md" weight="bold" style={{ marginBottom: "12px" }}>
          Staff Account & Workstation Details
        </Text>
        <div style={{ display: "grid", gap: "12px" }}>
          <Field
            label="Official Reception Email"
            value={currentStaff?.email || "reception@aarogya.in"}
            disabled
          />
          <Field
            label="Station Location"
            value="Ground Floor Lobby · Counter 1"
            disabled
          />
          <Field
            label="Assigned Doctors Today"
            value="Dr. Arjun Sharma (Room 2), Dr. Meera Nair (Room 1)"
            disabled
          />
          <Button
            size="sm"
            onClick={() => {
              setSaved(true)
              setTimeout(() => setSaved(false), 2500)
            }}
          >
            {saved ? "Station settings saved!" : "Save station settings"}
          </Button>
        </div>
      </Card>
    </div>
  )
}

