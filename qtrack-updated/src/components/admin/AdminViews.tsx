import { useState } from "react"
import { MoreHorizontal, Plus } from "lucide-react"
import { useQueue } from "../../context/QueueContext"
import { Button, IconButton } from "../common/Button"
import { Card } from "../common/Card"
import { Field } from "../common/Field"
import { Modal } from "../common/Modal"
import { Text } from "../common/Text"

export function AdminClinicSettingsView() {
  const { settings, updateSettings } = useQueue()
  const [windowMins, setWindowMins] = useState(
    String(settings.checkInWindowMinutes),
  )
  const [skipPlaces, setSkipPlaces] = useState(
    String(settings.skipDemotionPlaces),
  )
  const [maxStrikes, setMaxStrikes] = useState(String(settings.maxStrikes))
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateSettings({
      checkInWindowMinutes: parseInt(windowMins, 10) || 15,
      skipDemotionPlaces: parseInt(skipPlaces, 10) || 3,
      maxStrikes: parseInt(maxStrikes, 10) || 3,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Clinic queue settings
          </Text>
          <Text tone="muted">
            Configure rules that govern patient check-in windows, penalties, and
            cancellations.
          </Text>
        </div>
      </div>

      {saved && (
        <div className="toast">
          <Text weight="semibold">
            Queue rules saved and applied across clinic displays!
          </Text>
        </div>
      )}

      <Card className="settings-card">
        <div className="setting-row">
          <div>
            <Text weight="bold">Check-in arrival window</Text>
            <Text size="sm" tone="muted">
              How many minutes patients have to arrive and scan QR once their
              window opens.
            </Text>
          </div>
          <div className="number-input">
            <input
              type="number"
              value={windowMins}
              onChange={(e) => setWindowMins(e.target.value)}
              style={{
                width: "48px",
                border: "none",
                textAlign: "center",
                font: "inherit",
                fontWeight: "bold",
              }}
            />
            <span>minutes</span>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <Text weight="bold">Skip penalty demotion</Text>
            <Text size="sm" tone="muted">
              Number of positions a patient moves back when they miss their
              first call.
            </Text>
          </div>
          <div className="number-input">
            <input
              type="number"
              value={skipPlaces}
              onChange={(e) => setSkipPlaces(e.target.value)}
              style={{
                width: "48px",
                border: "none",
                textAlign: "center",
                font: "inherit",
                fontWeight: "bold",
              }}
            />
            <span>places</span>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <Text weight="bold">Maximum strikes before removal</Text>
            <Text size="sm" tone="muted">
              Patient is removed from active queue after this many consecutive
              missed calls.
            </Text>
          </div>
          <div className="number-input">
            <input
              type="number"
              value={maxStrikes}
              onChange={(e) => setMaxStrikes(e.target.value)}
              style={{
                width: "48px",
                border: "none",
                textAlign: "center",
                font: "inherit",
                fontWeight: "bold",
              }}
            />
            <span>strikes</span>
          </div>
        </div>

        <Button onClick={handleSave}>Save queue rules</Button>
      </Card>
    </div>
  )
}

export function AdminPeopleView() {
  const [people, setPeople] = useState([
    {
      name: "Dr. Arjun Sharma",
      role: "Doctor (Room 2)",
      status: "Active today",
    },
    { name: "Dr. Meera Nair", role: "Doctor (Room 4)", status: "Active today" },
    {
      name: "Sneha Kapoor",
      role: "Receptionist (Desk 1)",
      status: "Full access",
    },
    {
      name: "Aman Singh",
      role: "Receptionist (Desk 2)",
      status: "Full access",
    },
  ])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("Doctor (Room 3)")

  const handleAddPerson = () => {
    if (newName.trim()) {
      setPeople([
        ...people,
        { name: newName.trim(), role: newRole, status: "Active" },
      ])
      setNewName("")
      setIsAddModalOpen(false)
    }
  }

  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Doctors & staff roster
          </Text>
          <Text tone="muted">
            Manage clinic access permissions and duty schedules.
          </Text>
        </div>
        <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add person
        </Button>
      </div>

      <div className="people-grid">
        {people.map((person) => {
          const initials = person.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")

          return (
            <Card className="person-card" key={person.name}>
              <span className="avatar">{initials}</span>
              <div style={{ flex: 1 }}>
                <Text weight="bold">{person.name}</Text>
                <Text size="sm" tone="muted">
                  {person.role} · {person.status}
                </Text>
              </div>
              <IconButton icon={MoreHorizontal} label="Manage staff member" />
            </Card>
          )
        })}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add staff member"
        subtitle="Grant doctor or receptionist workspace access"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Field
            label="Full name"
            placeholder="e.g. Dr. Rajesh Verma"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Field
            label="Role & Assignment"
            placeholder="e.g. Doctor (Room 3) or Receptionist"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <Button full onClick={handleAddPerson}>
            Add staff member
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export function AdminAnalyticsView() {
  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Clinic operational analytics
          </Text>
          <Text tone="muted">
            Insights and queue performance metrics for the last 30 days.
          </Text>
        </div>
      </div>

      <div className="stats-grid">
        <Card>
          <Text size="sm" tone="muted">
            AVG. WAIT
          </Text>
          <Text size="xl" weight="bold">
            24 min
          </Text>
          <Text size="sm" tone="teal">
            ↓ 14% improvement this month
          </Text>
        </Card>
        <Card>
          <Text size="sm" tone="muted">
            PATIENTS / DAY
          </Text>
          <Text size="xl" weight="bold">
            86
          </Text>
          <Text size="sm" tone="muted">
            +8 from prior week
          </Text>
        </Card>
        <Card>
          <Text size="sm" tone="muted">
            NO-SHOW RATE
          </Text>
          <Text size="xl" weight="bold">
            4.8%
          </Text>
          <Text size="sm" tone="teal">
            Within healthy threshold
          </Text>
        </Card>
      </div>

      <Card>
        <Text size="lg" weight="bold">
          Hourly patient traffic distribution
        </Text>
        <Text size="sm" tone="muted" style={{ marginBottom: "16px" }}>
          Peak clinic hours occur between 11:00 AM and 1:00 PM.
        </Text>
        <div className="bar-chart">
          {[32, 46, 70, 92, 76, 48, 35, 58].map((val, i) => (
            <div key={i} title={`${9 + i}:00 — ${val} patients`}>
              <span
                className={`bar-height-${i}`}
                style={{ height: `${val}%` }}
              />
              <small>{9 + i}:00</small>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
