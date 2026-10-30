import { useState } from "react"
import {
  Activity,
  AlertCircle,
  Check,
  ChevronDown,
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
  const [actionItem, setActionItem] = useState<QueueItem | null>(null)
  const [priorityReason, setPriorityReason] = useState("")

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
      <div className="alert-strip">
        <AlertCircle size={18} />
        <Text size="sm">
          <strong>Clinic announcement:</strong> Next consultation window opens
          in 5 min. Dr. Sharma and Dr. Nair are on schedule.
        </Text>
        <X size={17} style={{ cursor: "pointer" }} />
      </div>

      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Live receptionist queue
          </Text>
          <Text tone="muted">
            Tuesday, 18 June · {activeQueue.length} active patients in clinic
            queue
          </Text>
        </div>
        <Button icon={Plus} onClick={onAddWalkIn}>
          Add walk-in
        </Button>
      </div>

      <div className="stats-grid">
        <Card>
          <Text size="sm" tone="muted">
            WAITING
          </Text>
          <Text size="xl" weight="bold">
            {waitingCount}
          </Text>
        </Card>
        <Card>
          <Text size="sm" tone="muted">
            CHECKED IN
          </Text>
          <Text size="xl" weight="bold">
            {checkedInCount}
          </Text>
        </Card>
        <Card>
          <Text size="sm" tone="muted">
            SEEN TODAY
          </Text>
          <Text size="xl" weight="bold">
            {seenTodayCount}
          </Text>
        </Card>
        <Card>
          <Text size="sm" tone="muted">
            AVG. WAIT
          </Text>
          <Text size="xl" weight="bold">
            26 min
          </Text>
        </Card>
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
        <Button variant="secondary">
          Filter <ChevronDown size={16} />
        </Button>
      </div>

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
              <div className="table-row" key={item.token}>
                <span>
                  <strong>{item.token}</strong>
                </span>
                <span>
                  <strong>{item.patientName}</strong>
                  {item.isPriority && <Badge dot={false}>Priority</Badge>}
                </span>
                <span>{item.patientPhone}</span>
                <span>
                  <Badge>{item.status}</Badge>
                </span>
                <span>{item.estimatedWaitMinutes}m</span>
                <span>{item.strikes}/3</span>
                <span className="row-actions">
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
        <Button variant="ghost" onClick={() => setPage("Live queue")}>
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

  const arrivalCandidates = queue.filter((q) =>
    ["Window open", "Checked in", "Waiting"].includes(q.status),
  )

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

      <div className="arrival-grid">
        {arrivalCandidates.slice(0, 6).map((item) => {
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
        })}
      </div>
    </div>
  )
}

export function ActivityLogView() {
  const { auditLogs } = useQueue()

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

      <Card>
        {auditLogs.map((log, index) => (
          <div className="log-row" key={log.id}>
            <span className={`log-icon log-${index % 3}`}>
              <Activity size={17} />
            </span>
            <div style={{ flex: 1 }}>
              <Text weight="semibold">{log.action}</Text>
              <Text size="sm" tone="muted">
                {log.actor} · {log.time}
              </Text>
              <Text size="sm">Reason: {log.reason}</Text>
            </div>
            <Badge dot={false}>{log.type}</Badge>
          </div>
        ))}
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
