import { useState, useEffect } from "react"
import {
  Bell,
  CheckCircle2,
  Clock,
  HeartPulse,
  Maximize2,
  Minimize2,
  QrCode,
  Sparkles,
  Stethoscope,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useQueue } from "../../context/QueueContext"
import type { QueueItem } from "../../types"
import { MobilePortalHeaderButton } from "../layout/LayoutComponents"

export function DisplayBoardView({ onExit }: { onExit?: () => void }) {
  const { queue, speakTokenAnnouncement, settings } = useQueue()
  const [flash, setFlash] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Live ticking clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
        setIsFullscreen(false)
      }
    }
  }

  // Active serving/called patient for Dr. Arjun Sharma (Room 102)
  const sharmaServing: QueueItem | null =
    queue.find(
      (q) =>
        q.doctorId === "doc-sharma" &&
        (q.status === "Called" || q.status === "In consultation"),
    ) ||
    queue.find(
      (q) => q.doctorId === "doc-sharma" && q.status === "Checked in",
    ) ||
    queue.find((q) => q.doctorId === "doc-sharma" && q.status === "Waiting") ||
    null

  // Active serving/called patient for Dr. Meera Nair (Room 205)
  const nairServing: QueueItem | null =
    queue.find(
      (q) =>
        q.doctorId === "doc-nair" &&
        (q.status === "Called" || q.status === "In consultation"),
    ) ||
    queue.find((q) => q.doctorId === "doc-nair" && q.status === "Checked in") ||
    queue.find((q) => q.doctorId === "doc-nair" && q.status === "Waiting") ||
    null

  // Up next waiting list
  const nextUpcoming = queue
    .filter(
      (q) =>
        ["Waiting", "Window open", "Checked in"].includes(q.status) &&
        q.id !== sharmaServing?.id &&
        q.id !== nairServing?.id,
    )
    .slice(0, 5)

  const activeWaitingCount = queue.filter((q) =>
    ["Waiting", "Window open", "Checked in"].includes(q.status),
  ).length

  const activeInConsultCount = queue.filter(
    (q) => q.status === "In consultation" || q.status === "Called",
  ).length

  const timeFormatted = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })

  const dateFormatted = currentTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const handlePlayChime = (item: QueueItem) => {
    if (soundEnabled) {
      speakTokenAnnouncement(item)
    }
  }

  return (
    <div className="tv-display-container">
      {/* 1. TOP HOSPITAL DIGITAL SIGNAGE HEADER */}
      <header className="tv-display-header">
        {/* Clinic Identity */}
        <div className="tv-header-identity">
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#0f766e",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 4px 10px rgba(15, 118, 110, 0.3)",
            }}
          >
            <HeartPulse size={28} />
          </div>
          <div>
            <div className="tv-brand-title-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                AAROGYA MULTI-SPECIALTY CLINIC
              </h1>
              <span
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "3px 9px",
                  borderRadius: "9999px",
                  border: "1px solid #bbf7d0",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#16a34a",
                    boxShadow: "0 0 6px #16a34a",
                  }}
                />
                LIVE QUEUE SYSTEM
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                margin: "2px 0 0",
                fontWeight: 500,
              }}
            >
              आरोग्य मल्टी-स्पेशियल्टी क्लिनिक · OPD Live Token Callout Board · Room
              Directional Display
            </p>
          </div>
        </div>

        {/* Live Clock & Action Controls */}
        <div className="tv-header-controls">
          {/* Digital Clock Box */}
          <div
            className="tv-clock-box"
            style={{
              textAlign: "right",
              padding: "6px 16px",
              background: "#f1f5f9",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#0f172a",
                fontFamily: "monospace",
                letterSpacing: "-0.03em",
              }}
            >
              {timeFormatted}
            </div>
            <div
              style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}
            >
              {dateFormatted}
            </div>
          </div>

          {/* Audio Chime Button */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: soundEnabled ? "#e6fffa" : "#f1f5f9",
              color: soundEnabled ? "#0f766e" : "#64748b",
              border: soundEnabled ? "1px solid #99f6e4" : "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
            title={
              soundEnabled
                ? "Audio announcements enabled"
                : "Audio announcements muted"
            }
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundEnabled ? "Chime Active" : "Chime Muted"}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#ffffff",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            title="Toggle fullscreen presentation"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>

          {/* Exit TV View */}
          <MobilePortalHeaderButton />
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              style={{
                background: "#0f172a",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Exit TV View
            </button>
          )}
        </div>
      </header>

      {/* 2. CLINIC STATUS STRIP */}
      <div className="tv-status-strip">
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#0f172a",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#0f766e",
              }}
            />
            OPD Department:{" "}
            <span style={{ color: "#0f766e" }}>2 Doctors Active</span>
          </div>
          <div style={{ color: "#475569", fontWeight: 600 }}>
            Serving In Rooms:{" "}
            <strong style={{ color: "#0f172a" }}>
              {activeInConsultCount} Patients
            </strong>
          </div>
          <div style={{ color: "#475569", fontWeight: 600 }}>
            Waiting in Lounge:{" "}
            <strong style={{ color: "#0f172a" }}>
              {activeWaitingCount} Patients
            </strong>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          <span>Estimated Wait Time: ~12 mins/consultation</span>
          <span>·</span>
          <span>Check-in Grace: {settings.checkInWindowMinutes} mins</span>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <div className="tv-main-content">
        {/* Section Title */}
        <div
          className="tv-section-head"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Bell size={20} color="#0f766e" />
              NOW SERVING & CALLING · अभी आपकी बारी
            </h2>
            <p
              style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0" }}
            >
              Patients with these tokens please proceed immediately to the
              respective consultation room.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setFlash(!flash)}
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "5px 10px",
                borderRadius: "6px",
                background: flash ? "#e6fffa" : "#f1f5f9",
                color: flash ? "#0f766e" : "#64748b",
                border: "1px solid #cbd5e1",
                cursor: "pointer",
              }}
            >
              {flash ? "Pulse Animation: ON" : "Pulse Animation: OFF"}
            </button>
          </div>
        </div>

        {/* 4. DOCTOR ROOM CONSULTATION CARDS (LARGE, ULTRA-LEGIBLE) */}
        <div className="tv-doctor-board-grid">
          {/* ROOM 1: DR. ARJUN SHARMA */}
          <div
            className="tv-doctor-card"
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              border:
                sharmaServing?.status === "Called" && flash
                  ? "3px solid #0d9488"
                  : "2px solid #e2e8f0",
              boxShadow:
                sharmaServing?.status === "Called" && flash
                  ? "0 0 0 4px rgba(13, 148, 136, 0.18), 0 12px 28px -4px rgba(0, 0, 0, 0.08)"
                  : "0 10px 25px -4px rgba(0, 0, 0, 0.05)",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "340px",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.25s ease",
            }}
          >
            {/* Top Bar with Doctor & Room */}
            <div
              className="tv-card-top"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Dr. Arjun Sharma
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: 600,
                    marginTop: "2px",
                  }}
                >
                  Cardiology & Internal Medicine
                </div>
              </div>

              {/* Big High-Contrast Room Pill */}
              <div
                style={{
                  background: "#0f766e",
                  color: "#ffffff",
                  padding: "8px 18px",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(15, 118, 110, 0.25)",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  PLEASE ENTER
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  ROOM 102
                </div>
              </div>
            </div>

            {/* Center Giant Token Display */}
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                CURRENT TOKEN NUMBER · टोकन संख्या
              </div>
              <div
                style={{
                  fontSize: "clamp(84px, 10vw, 112px)",
                  fontWeight: 900,
                  color: "#0f766e",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  margin: "8px 0",
                  textShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                {sharmaServing ? sharmaServing.token : "A-019"}
              </div>
              <div
                style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b" }}
              >
                {sharmaServing ? sharmaServing.patientName : "Priya Sharma"}
              </div>
            </div>

            {/* Bottom Status Callout */}
            <div
              className="tv-card-foot"
              style={{
                borderTop: "1px solid #f1f5f9",
                paddingTop: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                {sharmaServing?.status === "Called" ? (
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 800,
                      border: "1px solid #bbf7d0",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#16a34a",
                      }}
                    />
                    🔔 NOW CALLING · कृपया कमरे में जाएं
                  </span>
                ) : sharmaServing?.status === "In consultation" ? (
                  <span
                    style={{
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 800,
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    👨‍⚕️ IN CONSULTATION · परामर्श जारी है
                  </span>
                ) : (
                  <span
                    style={{
                      background: "#fef3c7",
                      color: "#92400e",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 800,
                      border: "1px solid #fde68a",
                    }}
                  >
                    ⏳ WAITING IN LOUNGE · प्रतीक्षा में
                  </span>
                )}
              </div>

              {sharmaServing && (
                <button
                  type="button"
                  onClick={() => handlePlayChime(sharmaServing)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0f766e",
                    cursor: "pointer",
                  }}
                  title="Announce token over speakers"
                >
                  <Volume2 size={16} /> Chime Aloud
                </button>
              )}
            </div>
          </div>

          {/* ROOM 2: DR. MEERA NAIR */}
          <div
            className="tv-doctor-card"
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              border:
                nairServing?.status === "Called" && flash
                  ? "3px solid #7c3aed"
                  : "2px solid #e2e8f0",
              boxShadow:
                nairServing?.status === "Called" && flash
                  ? "0 0 0 4px rgba(124, 58, 237, 0.18), 0 12px 28px -4px rgba(0, 0, 0, 0.08)"
                  : "0 10px 25px -4px rgba(0, 0, 0, 0.05)",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "340px",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.25s ease",
            }}
          >
            {/* Top Bar with Doctor & Room */}
            <div
              className="tv-card-top"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Dr. Meera Nair
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: 600,
                    marginTop: "2px",
                  }}
                >
                  Pediatrics & Internal Medicine
                </div>
              </div>

              {/* Big High-Contrast Room Pill */}
              <div
                style={{
                  background: "#7c3aed",
                  color: "#ffffff",
                  padding: "8px 18px",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(124, 58, 237, 0.25)",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  PLEASE ENTER
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  ROOM 205
                </div>
              </div>
            </div>

            {/* Center Giant Token Display */}
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                CURRENT TOKEN NUMBER · टोकन संख्या
              </div>
              <div
                style={{
                  fontSize: "clamp(84px, 10vw, 112px)",
                  fontWeight: 900,
                  color: "#7c3aed",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  margin: "8px 0",
                  textShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                {nairServing ? nairServing.token : "B-011"}
              </div>
              <div
                style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b" }}
              >
                {nairServing ? nairServing.patientName : "Vikram Rao"}
              </div>
            </div>

            {/* Bottom Status Callout */}
            <div
              className="tv-card-foot"
              style={{
                borderTop: "1px solid #f1f5f9",
                paddingTop: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                {nairServing?.status === "Called" ? (
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 800,
                      border: "1px solid #bbf7d0",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#16a34a",
                      }}
                    />
                    🔔 NOW CALLING · कृपया कमरे में जाएं
                  </span>
                ) : nairServing?.status === "In consultation" ? (
                  <span
                    style={{
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 800,
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    👨‍⚕️ IN CONSULTATION · परामर्श जारी है
                  </span>
                ) : (
                  <span
                    style={{
                      background: "#fef3c7",
                      color: "#92400e",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 800,
                      border: "1px solid #fde68a",
                    }}
                  >
                    ⏳ WAITING IN LOUNGE · प्रतीक्षा में
                  </span>
                )}
              </div>

              {nairServing && (
                <button
                  type="button"
                  onClick={() => handlePlayChime(nairServing)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#7c3aed",
                    cursor: "pointer",
                  }}
                  title="Announce token over speakers"
                >
                  <Volume2 size={16} /> Chime Aloud
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5. BOTTOM SECTION: UPCOMING TOKENS & QR CHECK-IN */}
        <div className="tv-bottom-grid">
          {/* UP NEXT TOKENS TABLE / CARD */}
          <div className="tv-upcoming-card">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.01em",
                  }}
                >
                  UP NEXT IN LINE · अगली बारी (कतार में)
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Live Queue Order
                </div>
              </div>

              {nextUpcoming.length === 0 ? (
                <div
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No more patients waiting in queue right now.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {nextUpcoming.map((item, index) => {
                    const doc =
                      item.doctorId === "doc-sharma" ? "Dr. Arjun" : "Dr. Meera"
                    const room =
                      item.doctorId === "doc-sharma" ? "Rm 102" : "Rm 205"
                    const isArrived =
                      item.status === "Checked in" ||
                      item.status === "Window open"

                    return (
                      <div
                        key={item.token}
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #cbd5e1",
                          borderRadius: "12px",
                          padding: "12px",
                          textAlign: "center",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#64748b",
                            marginBottom: "4px",
                          }}
                        >
                          #{index + 1} UP NEXT
                        </div>
                        <div
                          style={{
                            fontSize: "26px",
                            fontWeight: 900,
                            color: "#0f172a",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {item.token}
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#334155",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            marginTop: "2px",
                          }}
                        >
                          {item.patientName}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#64748b",
                            marginTop: "4px",
                          }}
                        >
                          {doc} · {room}
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: isArrived ? "#dcfce7" : "#f1f5f9",
                              color: isArrived ? "#15803d" : "#64748b",
                              border: isArrived
                                ? "1px solid #bbf7d0"
                                : "1px solid #e2e8f0",
                            }}
                          >
                            {isArrived ? "✓ At Clinic" : "En Route"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: "16px",
                fontSize: "12px",
                color: "#64748b",
                borderTop: "1px solid #f1f5f9",
                paddingTop: "12px",
              }}
            >
              ℹ️ Please have your token slip or mobile phone ready. When called,
              you will hear a distinct chime.
            </div>
          </div>

          {/* QR CODE ARRIVAL CHECK-IN CARD */}
          <div className="tv-qr-box">
            <div
              style={{
                width: "100px",
                height: "100px",
                background: "#f8fafc",
                border: "2px solid #0f766e",
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
                color: "#0f766e",
                boxShadow: "0 4px 10px rgba(15, 118, 110, 0.1)",
                marginBottom: "12px",
              }}
            >
              <QrCode size={76} />
            </div>
            <div
              style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}
            >
              Quick Mobile Check-In
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginTop: "4px",
                maxWidth: "240px",
              }}
            >
              Scan with your smartphone camera to confirm your physical arrival
              at the clinic lounge.
            </div>
            <div
              style={{
                marginTop: "10px",
                background: "#e6fffa",
                color: "#0f766e",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 800,
                border: "1px solid #99f6e4",
              }}
            >
              CODE: QTRACK-ARGY-LIVE
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM MARQUEE / ANNOUNCEMENT TICKER */}
      <footer
        className="tv-footer"
        style={{
          background: "#0f172a",
          color: "#ffffff",
          padding: "12px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        <div className="tv-footer-notice" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              background: "#ef4444",
              color: "#ffffff",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            NOTICE
          </span>
          <span style={{ color: "#e2e8f0" }}>
            कृपया टोकन पुकारे जाने पर सीधे निर्धारित कक्ष में जाएं। आपातकालीन स्थिति में तुरंत
            काउंटर 1 पर सूचित करें। (Audio chime sounds for every call).
          </span>
        </div>

        <div
          className="tv-footer-meta"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#94a3b8",
            fontSize: "12px",
          }}
        >
          <span>Emergency Triage: Counter 1</span>
          <span>·</span>
          <span>Help Desk: +91 80 4455 6677</span>
        </div>
      </footer>
    </div>
  )
}
