import { useState } from "react"
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Menu,
  QrCode,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
  MapPin,
} from "lucide-react"
import { useQueue } from "../../context/QueueContext"
import { Text } from "../common/Text"

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="logo">
      <span className={`logo-mark ${inverse ? "logo-mark-inverse" : ""}`}>
        <HeartPulse size={21} />
      </span>
      <Text size="lg" weight="bold" tone={inverse ? "inverse" : "default"}>
        QTrack
      </Text>
    </div>
  )
}

export function LandingPage() {
  const [mobileNav, setMobileNav] = useState(false)
  const {
    queue,
    activePatientToken,
    setPortal,
    setPatientPage,
    isPatientLoggedIn,
  } = useQueue()

  // Find active patient's queue item or default
  const activeItem =
    queue.find((q) => q.token === activePatientToken) ||
    queue.find((q) => q.token === "A-024") ||
    queue[0]

  // Count people ahead
  const peopleAhead = activeItem
    ? queue.filter(
        (q) =>
          q.doctorId === activeItem.doctorId &&
          ["Waiting", "Window open", "Checked in"].includes(q.status) &&
          q.token < activeItem.token,
      ).length
    : 4

  const waitingCount = queue.filter((q) =>
    ["Waiting", "Window open"].includes(q.status),
  ).length
  const checkedInCount = queue.filter((q) => q.status === "Checked in").length

  const handleBook = () => {
    setPortal("patient")
    setPatientPage("Find a doctor")
  }
  const handleTrack = () => {
    setPortal("patient")
    setPatientPage("My queue")
  }
  const handlePatientPortal = () => {
    setPortal("patient")
    setPatientPage("Home")
  }
  const handleStaff = () => {
    setPortal("receptionist")
  }
  const handleDisplay = () => {
    setPortal("display")
  }

  const features = [
    {
      icon: CalendarDays,
      title: "Simple appointment booking",
      description:
        "Find the right doctor and plan your visit without the back-and-forth.",
    },
    {
      icon: Activity,
      title: "A queue you can follow",
      description:
        "See your token, people ahead, and an estimated wait at a glance.",
    },
    {
      icon: QrCode,
      title: "Quick QR check-in",
      description:
        "Arrive, scan, and check in with fewer steps at the front desk.",
    },
    {
      icon: HeartPulse,
      title: "Care teams in sync",
      description:
        "Give receptionists and clinicians a shared view of the day.",
    },
  ]

  return (
    <div className="q-landing">
      <header className="q-nav">
        <a href="#top" className="q-brand" aria-label="QTrack home">
          <Logo />
          <span className="q-brand-note">Care, without the wait.</span>
        </a>
        <button
          className="q-mobile-toggle"
          aria-label="Toggle navigation"
          aria-expanded={mobileNav}
          onClick={() => setMobileNav(!mobileNav)}
        >
          {mobileNav ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav
          className={`q-nav-links ${mobileNav ? "q-nav-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#features" onClick={() => setMobileNav(false)}>
            Features
          </a>
          <a href="#how-it-works" onClick={() => setMobileNav(false)}>
            How it works
          </a>
          <a href="#for-clinics" onClick={() => setMobileNav(false)}>
            For clinics
          </a>
          <button
            className="q-nav-signin"
            type="button"
            onClick={() => {
              setMobileNav(false)
              handleDisplay()
            }}
          >
            TV Token Board
          </button>
          <button
            className="q-nav-signin"
            type="button"
            onClick={() => {
              setMobileNav(false)
              handleStaff()
            }}
          >
            Staff sign in
          </button>
          <button
            className="q-button q-button-primary q-nav-cta"
            type="button"
            onClick={() => {
              setMobileNav(false)
              handleBook()
            }}
          >
            Book appointment <ArrowRight size={17} />
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="q-hero">
          <div className="q-hero-copy">
            <div className="q-eyebrow">
              <span className="q-eyebrow-dot" /> A calmer way to visit your
              clinic
            </div>
            <h1>
              Less waiting.
              <br />
              <span>More caring.</span>
            </h1>
            <p className="q-hero-lede">
              Healthcare visits should be about you, not the wait. Book ahead,
              follow your queue, and arrive with a little more peace of mind.
            </p>
            <div className="q-hero-actions">
              <button
                className="q-button q-button-primary"
                onClick={handleBook}
              >
                Book an appointment <ArrowRight size={18} />
              </button>
              <button
                className="q-button q-button-secondary"
                onClick={handleTrack}
              >
                <QrCode size={18} /> Track my queue
              </button>
            </div>
            <div className="q-hero-trust">
              <span className="q-trust-icon">
                <ShieldCheck size={17} />
              </span>
              <span>Clear updates. Thoughtful care. Less uncertainty.</span>
            </div>
          </div>
          <div
            className="q-hero-visual"
            aria-label="Preview of the QTrack patient queue dashboard"
          >
            <div className="q-visual-orbit q-orbit-one" />
            <div className="q-visual-orbit q-orbit-two" />
            <div className="q-float-pill q-float-top">
              <span className="q-live-dot" /> Queue status updates
            </div>
            <div className="q-preview-window">
              <div className="q-preview-top">
                <div className="q-preview-brand">
                  <span className="q-mini-mark">
                    <HeartPulse size={17} />
                  </span>
                  <span>QTrack</span>
                </div>
                <span className="q-preview-avatar">PS</span>
              </div>
              <div className="q-preview-welcome">
                <span>YOUR VISIT, AT A GLANCE</span>
                <strong>Good morning, Priya</strong>
                <small>Aarogya Family Clinic</small>
              </div>
              <div className="q-appointment-card">
                <div className="q-doctor-avatar">
                  <Stethoscope size={23} />
                </div>
                <div className="q-doctor-details">
                  <strong>
                    {activeItem?.doctorName || "Dr. Arjun Sharma"}
                  </strong>
                  <span>
                    {activeItem?.doctorId === "doc-nair"
                      ? "Internal Medicine"
                      : "General Medicine"}
                  </span>
                  <small>
                    <MapPin size={13} /> Aarogya Family Clinic
                  </small>
                </div>
                <span className="q-confirmed">
                  <Check size={13} /> Booked
                </span>
              </div>
              <div className="q-token-card">
                <div className="q-token-heading">
                  <span>YOUR QUEUE TOKEN</span>
                  <span className="q-status">
                    <span className="q-live-dot" /> In progress
                  </span>
                </div>
                <div className="q-token-main">
                  <strong>{activeItem?.token || "A-024"}</strong>
                  <div>
                    <span>Estimated wait</span>
                    <b>
                      {activeItem?.estimatedWaitMinutes || 25}–
                      {Math.max(
                        35,
                        (activeItem?.estimatedWaitMinutes || 25) + 10,
                      )}{" "}
                      min
                    </b>
                  </div>
                </div>
                <div className="q-progress">
                  <span />
                </div>
                <div className="q-progress-foot">
                  <span>
                    <Users size={14} /> {peopleAhead} people ahead
                  </span>
                  <span>Updated just now</span>
                </div>
              </div>
              <div
                className="q-preview-bottom"
                onClick={handleTrack}
                style={{ cursor: "pointer" }}
              >
                <span className="q-preview-check">
                  <CheckCircle2 size={17} />
                </span>
                <span>
                  <strong>You're all set</strong>
                  <small>Click to open your live queue screen</small>
                </span>
                <ArrowRight size={17} />
              </div>
            </div>
            <div className="q-float-pill q-float-bottom">
              <span className="q-float-icon">
                <Clock3 size={17} />
              </span>
              <span>
                <strong>Know before you go</strong>
                <small>Queue updates in one place</small>
              </span>
            </div>
          </div>
          <div className="q-hero-bottom">
            <span>MADE FOR BETTER CLINIC VISITS</span>
            <div>
              <span>
                <CheckCircle2 size={16} /> Easy to use
              </span>
              <span>
                <CheckCircle2 size={16} /> Patient-first
              </span>
              <span>
                <CheckCircle2 size={16} /> Clinic-friendly
              </span>
            </div>
          </div>
        </section>

        <section className="q-section q-features" id="features">
          <div className="q-section-heading">
            <span className="q-section-kicker">THE QTRACK DIFFERENCE</span>
            <h2>
              Every step, a little <span>simpler.</span>
            </h2>
            <p>
              Small improvements to the visit experience can make a meaningful
              difference to patients and care teams.
            </p>
          </div>
          <div className="q-feature-grid">
            {features.map(({ icon: Icon, title, description }, i) => (
              <article className="q-feature-card" key={title}>
                <div className={`q-feature-icon q-feature-icon-${i}`}>
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="q-feature-number">0{i + 1}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="q-how-section" id="how-it-works">
          <div className="q-how-inner">
            <div className="q-section-heading q-how-heading">
              <span className="q-section-kicker">THREE SIMPLE STEPS</span>
              <h2>
                From booking to <span>being seen.</span>
              </h2>
              <p>
                Know what happens next, from the moment you plan a visit to the
                moment you're called.
              </p>
              <button
                className="q-button q-button-primary"
                onClick={handleBook}
              >
                Plan your visit <ArrowRight size={17} />
              </button>
            </div>
            <div className="q-steps">
              <article className="q-step">
                <div className="q-step-icon">
                  <CalendarDays size={23} />
                </div>
                <span className="q-step-num">STEP 01</span>
                <h3>Book your visit</h3>
                <p>
                  Choose a doctor and join the queue through a straightforward
                  flow.
                </p>
              </article>
              <div className="q-step-connector" />
              <article className="q-step">
                <div className="q-step-icon">
                  <QrCode size={23} />
                </div>
                <span className="q-step-num">STEP 02</span>
                <h3>Check in with ease</h3>
                <p>
                  Use the QR check-in flow or follow the clinic's arrival
                  instructions.
                </p>
              </article>
              <div className="q-step-connector" />
              <article className="q-step">
                <div className="q-step-icon">
                  <Bell size={23} />
                </div>
                <span className="q-step-num">STEP 03</span>
                <h3>Follow your queue</h3>
                <p>
                  Keep your token and estimated wait handy while you wait to be
                  called.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="q-clinic-section" id="for-clinics">
          <div className="q-clinic-panel">
            <div className="q-clinic-copy">
              <span className="q-section-kicker">
                FOR THE PEOPLE BEHIND THE CARE
              </span>
              <h2>
                A smoother day for your <span>whole clinic.</span>
              </h2>
              <p>
                Bring daily queue activity into one clear workspace, so
                front-desk teams and clinicians can focus on the next
                patient—not the paperwork.
              </p>
              <ul>
                <li>
                  <CheckCircle2 size={18} /> Manage scheduled visits and
                  walk-ins
                </li>
                <li>
                  <CheckCircle2 size={18} /> Keep queue status clear across the
                  team
                </li>
                <li>
                  <CheckCircle2 size={18} /> See daily activity in one place
                </li>
              </ul>
              <button className="q-button q-button-dark" onClick={handleStaff}>
                Explore staff workspace <ArrowRight size={17} />
              </button>
            </div>
            <div className="q-clinic-art">
              <div className="q-clinic-window">
                <div className="q-clinic-window-head">
                  <span>
                    <span className="q-live-dot" /> TODAY'S QUEUE
                  </span>
                  <span className="q-clinic-window-date">Clinic overview</span>
                </div>
                <div className="q-clinic-metrics">
                  <div>
                    <small>Waiting</small>
                    <strong>{waitingCount}</strong>
                    <span>{checkedInCount} checked in</span>
                  </div>
                  <div>
                    <small>Average wait</small>
                    <strong>
                      28 <i>min</i>
                    </strong>
                    <span>Estimated today</span>
                  </div>
                </div>
                <div className="q-clinic-list-head">
                  <span>UP NEXT</span>
                  <span>STATUS</span>
                </div>
                {queue
                  .filter((q) =>
                    ["Waiting", "Window open", "Checked in"].includes(q.status),
                  )
                  .slice(0, 3)
                  .map((item) => (
                    <div className="q-clinic-row" key={item.token}>
                      <span className="q-clinic-token">{item.token}</span>
                      <span className="q-clinic-patient">
                        {item.patientName}
                        <small>{item.doctorName}</small>
                      </span>
                      <span
                        className={`q-clinic-status ${
                          item.status === "Checked in" ? "q-status-checked" : ""
                        }`}
                      >
                        <span />
                        {item.status}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="q-clinic-stamp">
                <HeartPulse size={19} />
                <span>
                  Care teams,
                  <br />
                  <strong>connected.</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="q-final-cta">
          <div className="q-final-icon">
            <HeartPulse size={25} />
          </div>
          <span className="q-section-kicker">YOUR NEXT VISIT STARTS HERE</span>
          <h2>
            Make room for <span>better care.</span>
          </h2>
          <p>
            Spend less time wondering what's next—and more time focused on
            feeling better.
          </p>
          <div className="q-hero-actions">
            <button className="q-button q-button-white" onClick={handleBook}>
              Book an appointment <ArrowRight size={18} />
            </button>
            <button
              className="q-button q-button-outline-light"
              onClick={handleTrack}
            >
              Track my queue
            </button>
          </div>
        </section>
      </main>

      <footer className="q-footer">
        <div className="q-footer-main">
          <div>
            <a href="#top" className="q-brand">
              <Logo />
              <span className="q-brand-note">Care, without the wait.</span>
            </a>
            <p>A clearer, calmer clinic visit starts with QTrack.</p>
          </div>
          <div className="q-footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#for-clinics">For clinics</a>
            <button onClick={handleStaff}>Staff sign in</button>
          </div>
        </div>
        <div className="q-footer-bottom">
          <span>
            © {new Date().getFullYear()} QTrack. Designed around better clinic
            visits.
          </span>
          <span>
            <ShieldCheck size={15} /> Patient-first by design
          </span>
        </div>
      </footer>
    </div>
  )
}
