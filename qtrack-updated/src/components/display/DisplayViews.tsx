import { useState } from "react"
import { CheckCircle2, QrCode, Volume2 } from "lucide-react"
import { useQueue } from "../../context/QueueContext"
import { Logo } from "../layout/LayoutComponents"
import { Text } from "../common/Text"

export function DisplayBoardView() {
  const { queue, speakTokenAnnouncement } = useQueue()
  const [flash, setFlash] = useState(true)
  const [empty, setEmpty] = useState(false)

  // Find serving or called patient for Dr. Sharma
  const sharmaServing =
    queue.find(
      (q) =>
        q.doctorId === "doc-sharma" &&
        (q.status === "Called" || q.status === "In consultation"),
    ) ||
    queue.find(
      (q) => q.doctorId === "doc-sharma" && q.status === "Checked in",
    ) ||
    null

  // Find serving or called patient for Dr. Nair
  const nairServing =
    queue.find(
      (q) =>
        q.doctorId === "doc-nair" &&
        (q.status === "Called" || q.status === "In consultation"),
    ) ||
    queue.find((q) => q.doctorId === "doc-nair") ||
    null

  const nextUpcoming = queue
    .filter((q) => ["Waiting", "Window open", "Checked in"].includes(q.status))
    .slice(0, 4)

  const currentTimeStr = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
  const todayDateStr = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="display-board">
      <div className="display-head">
        <Logo inverse />
        <Text size="lg" tone="inverse">
          आरोग्य फैमिली क्लिनिक · Aarogya Family Clinic
        </Text>
        <div className="display-time">
          <Text size="xl" weight="bold" tone="inverse">
            {currentTimeStr}
          </Text>
          <Text size="sm">{todayDateStr}</Text>
        </div>
      </div>

      <div className="serving-label">
        <Text size="lg" weight="bold">
          NOW SERVING · अभी आपकी बारी
        </Text>
        <div className="display-controls">
          <button type="button" onClick={() => setFlash(!flash)}>
            {flash ? "Pause highlight" : "Highlight call"}
          </button>
          <button type="button" onClick={() => setEmpty(!empty)}>
            {empty ? "Show live queue" : "Simulate empty"}
          </button>
          {sharmaServing && (
            <button
              type="button"
              onClick={() => speakTokenAnnouncement(sharmaServing)}
              title="Announce token aloud"
            >
              <Volume2
                size={15}
                style={{ verticalAlign: "middle", marginRight: "4px" }}
              />
              Chime {sharmaServing.token}
            </button>
          )}
        </div>
      </div>

      {empty ? (
        <div className="display-empty">
          <CheckCircle2 size={72} />
          <Text size="display" weight="bold" tone="inverse">
            No patients waiting
          </Text>
          <Text size="lg">The next token will appear here automatically.</Text>
          <Text size="lg">कोई मरीज़ प्रतीक्षा में नहीं है</Text>
        </div>
      ) : (
        <>
          <div className="doctor-board-grid">
            <div
              className={`serving-card ${
                flash && sharmaServing?.status === "Called"
                  ? "serving-flash"
                  : ""
              }`}
            >
              <div>
                <Text size="lg" weight="bold">
                  Dr. Arjun Sharma
                </Text>
                <Text>General Medicine</Text>
              </div>
              <div className="display-token">
                {sharmaServing ? sharmaServing.token : "A-019"}
              </div>
              <div className="room">
                <Text size="sm">PLEASE GO TO</Text>
                <Text size="xl" weight="bold">
                  Room 2
                </Text>
              </div>
            </div>

            <div
              className={`serving-card ${
                flash && nairServing?.status === "Called" ? "serving-flash" : ""
              }`}
            >
              <div>
                <Text size="lg" weight="bold">
                  Dr. Meera Nair
                </Text>
                <Text>Internal Medicine</Text>
              </div>
              <div className="display-token">
                {nairServing ? nairServing.token : "B-011"}
              </div>
              <div className="room">
                <Text size="sm">PLEASE GO TO</Text>
                <Text size="xl" weight="bold">
                  Room 4
                </Text>
              </div>
            </div>
          </div>

          <div className="next-row">
            <div>
              <Text size="sm">NEXT UP · अगली बारी</Text>
              <div className="next-tokens">
                {nextUpcoming.map((item) => (
                  <span key={item.token}>{item.token}</span>
                ))}
              </div>
            </div>
            <div className="display-qr">
              <QrCode size={72} />
              <div>
                <Text weight="bold">Scan to check in</Text>
                <Text size="sm">Check-in code refreshes every 30s</Text>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
