import { useRef, useState } from "react"
import {
  ArrowLeft,
  CheckCircle2,
  HeartPulse,
  Languages,
  Lock,
  Phone,
  ShieldCheck,
  Stethoscope,
  User,
  UserCheck,
} from "lucide-react"
import { useQueue } from "../../context/QueueContext"
import { Button } from "../common/Button"
import { Card } from "../common/Card"
import { Field, SelectField } from "../common/Field"
import { Text } from "../common/Text"

export function PatientAuthView({ onBack }: { onBack?: () => void }) {
  const { patientLogin, patientRegister, setPortal, setPatientPage } =
    useQueue()

  const [mode, setMode] = useState<"otp" | "password">("otp")
  const [phone, setPhone] = useState("+91 98765 43210")
  const [password, setPassword] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpDigits, setOtpDigits] = useState(["4", "8", "2", "1", "9", "0"])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [errorMessage, setErrorMessage] = useState("")

  // New registration state
  const [isRegistering, setIsRegistering] = useState(false)
  const [regName, setRegName] = useState("")
  const [regLang, setRegLang] = useState("English")
  const [regPassword, setRegPassword] = useState("")

  const handleSendOtp = () => {
    if (!phone.trim()) {
      setErrorMessage("Please enter a valid mobile number")
      return
    }
    setErrorMessage("")
    setOtpSent(true)
  }

  const handleVerifyOtp = () => {
    setErrorMessage("")
    const result = patientLogin({
      phone,
      mode: "otp",
      otp: otpDigits.join(""),
    })

    if (result.success) {
      setPortal("patient")
      setPatientPage("Home")
    } else if (result.isNewUser) {
      // Prompt quick registration
      setIsRegistering(true)
    } else {
      setErrorMessage(result.error || "Verification failed. Please try again.")
    }
  }

  const handlePasswordLogin = () => {
    setErrorMessage("")
    if (!password) {
      setErrorMessage("Please enter your password")
      return
    }
    const result = patientLogin({
      phone,
      mode: "password",
      password,
    })

    if (result.success) {
      setPortal("patient")
      setPatientPage("Home")
    } else if (result.isNewUser) {
      setIsRegistering(true)
    } else {
      setErrorMessage(
        result.error || "Invalid credentials. Default password is patient123.",
      )
    }
  }

  const handleCompleteRegistration = () => {
    if (!regName.trim()) {
      setErrorMessage(
        "Please provide your full name to create your patient account.",
      )
      return
    }
    patientRegister({
      phone,
      name: regName.trim(),
      preferredLanguage: regLang,
      password: regPassword || "patient123",
    })
    setPortal("patient")
    setPatientPage("Home")
  }

  const handleQuickLogin = (demoPhone: string) => {
    setPhone(demoPhone)
    const result = patientLogin({ phone: demoPhone, mode: "otp" })
    if (result.success) {
      setPortal("patient")
      setPatientPage("Home")
    }
  }

  return (
    <div
      className="auth-page"
      style={{ minHeight: "100vh", padding: "24px 16px" }}
    >
      <div className="mobile-only mobile-auth-hero">
        <div className="mobile-auth-hero-top">
          <div className="mobile-auth-badge">
            <HeartPulse size={18} />
            <span>Aarogya Family Clinic</span>
          </div>
          {onBack && (
            <button type="button" className="mobile-auth-back" onClick={onBack}>
              <ArrowLeft size={14} /> Site
            </button>
          )}
        </div>
        <h2>Patient Care Portal</h2>
        <p>Live queue tracking, QR check-in & digital prescriptions</p>
      </div>
      <Card className="auth-card" style={{ maxWidth: "440px", width: "100%" }}>
        <div
          className="auth-card-head"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <span className="logo-mark">
              <HeartPulse size={20} />
            </span>
            <Text size="lg" weight="bold" className="auth-brand-title">
              QTrack Patient Portal
            </Text>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                color: "#64706e",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13px",
              }}
            >
              <ArrowLeft size={15} /> Site
            </button>
          )}
        </div>

        {isRegistering ? (
          <>
            <div>
              <Text size="xl" weight="bold">
                Create your patient record
              </Text>
              <Text tone="muted">
                First time visiting Aarogya Clinic? Let’s set up your profile
                for {phone}.
              </Text>
            </div>

            {errorMessage && (
              <div
                style={{
                  color: "#b42318",
                  fontSize: "14px",
                  background: "#fef3f2",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                {errorMessage}
              </div>
            )}

            <Field
              label="Full name"
              placeholder="e.g. Priya Sharma"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
            />

            <SelectField
              label="Preferred language"
              value={regLang}
              onChange={(e) => setRegLang(e.target.value)}
            >
              <option value="English">English</option>
              <option value="हिन्दी">हिन्दी (Hindi)</option>
              <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
            </SelectField>

            <Field
              label="Create password (optional)"
              placeholder="Minimum 6 characters"
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />

            <Button full onClick={handleCompleteRegistration}>
              Complete registration & enter queue
            </Button>

            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              style={{
                background: "none",
                border: "none",
                color: "#0f766e",
                cursor: "pointer",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <div>
              <Text size="xl" weight="bold">
                {otpSent ? "Enter 6-digit OTP" : "Sign in to follow your care"}
              </Text>
              <Text tone="muted">
                {otpSent
                  ? `We sent a temporary verification code to ${phone}`
                  : "Fast, secure access using your registered phone number."}
              </Text>
            </div>

            {/* Toggle Mode: OTP vs Password */}
            {!otpSent && (
              <div
                className="auth-segmented"
                style={{
                  display: "flex",
                  background: "#f1f3f2",
                  borderRadius: "8px",
                  padding: "4px",
                  gap: "4px",
                }}
              >
                <button
                  type="button"
                  className={`auth-seg-btn ${mode === "otp" ? "auth-seg-active" : ""}`}
                  onClick={() => setMode("otp")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: mode === "otp" ? "#ffffff" : "transparent",
                    fontWeight: mode === "otp" ? 600 : 400,
                    color: mode === "otp" ? "#0f766e" : "#64706e",
                    boxShadow:
                      mode === "otp" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    cursor: "pointer",
                  }}
                >
                  <Phone
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: "6px" }}
                  />
                  OTP Login
                </button>
                <button
                  type="button"
                  className={`auth-seg-btn ${mode === "password" ? "auth-seg-active" : ""}`}
                  onClick={() => setMode("password")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: mode === "password" ? "#ffffff" : "transparent",
                    fontWeight: mode === "password" ? 600 : 400,
                    color: mode === "password" ? "#0f766e" : "#64706e",
                    boxShadow:
                      mode === "password"
                        ? "0 1px 3px rgba(0,0,0,0.1)"
                        : "none",
                    cursor: "pointer",
                  }}
                >
                  <Lock
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: "6px" }}
                  />
                  Password
                </button>
              </div>
            )}

            {errorMessage && (
              <div
                style={{
                  color: "#b42318",
                  fontSize: "14px",
                  background: "#fef3f2",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                {errorMessage}
              </div>
            )}

            {mode === "otp" ? (
              otpSent ? (
                <>
                  <div className="otp">
                    {otpDigits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        aria-label={`OTP digit ${i + 1}`}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(-1)
                          const next = [...otpDigits]
                          next[i] = val
                          setOtpDigits(next)
                          if (val && i < 5) {
                            otpRefs.current[i + 1]?.focus()
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
                            otpRefs.current[i - 1]?.focus()
                          }
                        }}
                        className="otp-input-box"
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="sm" tone="muted">
                      Resend in 00:24
                    </Text>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#0f766e",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Change phone
                    </button>
                  </div>
                  <Button full onClick={handleVerifyOtp}>
                    Verify & enter patient portal
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
                  <Button full onClick={handleSendOtp}>
                    Send OTP verification code
                  </Button>
                </>
              )
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
                <Field
                  label="Password"
                  icon={Lock}
                  placeholder="Enter your account password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("otp")
                      setOtpSent(false)
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0f766e",
                      fontSize: "13px",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Forgot password? Sign in with OTP
                  </button>
                </div>
                <Button full onClick={handlePasswordLogin}>
                  Sign in with password
                </Button>
              </>
            )}

            <div style={{ borderTop: "1px solid #dfe5e3", paddingTop: "16px" }}>
              <Text
                size="xs"
                weight="bold"
                tone="muted"
                style={{ marginBottom: "8px" }}
              >
                TEST ACCOUNT SHORTCUTS
              </Text>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <button
                  type="button"
                  className="auth-shortcut-btn"
                  onClick={() => handleQuickLogin("+91 98765 43210")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #dfe5e3",
                    background: "#f7f9f8",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "13px",
                  }}
                >
                  <div>
                    <strong>Priya Sharma (ID: P-8421)</strong>
                    <div style={{ color: "#64706e", fontSize: "12px" }}>
                      +91 98765 43210 · Token A-024 active
                    </div>
                  </div>
                  <UserCheck size={16} color="#0f766e" />
                </button>

                <button
                  type="button"
                  className="auth-shortcut-btn"
                  onClick={() => handleQuickLogin("+91 98123 12010")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #dfe5e3",
                    background: "#f7f9f8",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "13px",
                  }}
                >
                  <div>
                    <strong>Vikram Rao (ID: P-1201)</strong>
                    <div style={{ color: "#64706e", fontSize: "12px" }}>
                      +91 98123 12010 · Token A-019 active
                    </div>
                  </div>
                  <UserCheck size={16} color="#0f766e" />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export function StaffAuthView({ onBack }: { onBack?: () => void }) {
  const { staffLogin, setPortal } = useQueue()

  const [role, setRole] = useState<"Doctor" | "Receptionist" | "Admin">(
    "Doctor",
  )
  const [identifier, setIdentifier] = useState("DOC-101")
  const [password, setPassword] = useState("doctor123")
  const [errorMessage, setErrorMessage] = useState("")

  const handleRoleChange = (r: "Doctor" | "Receptionist" | "Admin") => {
    setRole(r)
    setErrorMessage("")
    if (r === "Doctor") {
      setIdentifier("DOC-101")
      setPassword("doctor123")
    } else if (r === "Receptionist") {
      setIdentifier("REC-201")
      setPassword("staff123")
    } else {
      setIdentifier("ADM-301")
      setPassword("admin123")
    }
  }

  const handleSubmit = () => {
    setErrorMessage("")
    const result = staffLogin({
      identifier,
      password,
      role,
    })

    if (!result.success) {
      setErrorMessage(
        result.error || "Login failed. Please verify Staff ID and password.",
      )
    }
  }

  return (
    <div
      className="auth-page"
      style={{ minHeight: "100vh", padding: "24px 16px" }}
    >
      <div className="mobile-only mobile-auth-hero mobile-auth-hero-staff">
        <div className="mobile-auth-hero-top">
          <div className="mobile-auth-badge">
            <ShieldCheck size={18} />
            <span>Aarogya Staff Console</span>
          </div>
          {onBack && (
            <button type="button" className="mobile-auth-back" onClick={onBack}>
              <ArrowLeft size={14} /> Site
            </button>
          )}
        </div>
        <h2>Clinical & Desk Sign In</h2>
        <p>Doctor station, front desk queue & clinic operations</p>
      </div>
      <Card className="auth-card" style={{ maxWidth: "440px", width: "100%" }}>
        <div
          className="auth-card-head"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <span className="logo-mark">
              <ShieldCheck size={20} />
            </span>
            <Text size="lg" weight="bold" className="auth-brand-title">
              QTrack Staff Workspace
            </Text>
          </div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                color: "#64706e",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13px",
              }}
            >
              <ArrowLeft size={15} /> Site
            </button>
          )}
        </div>

        <div>
          <Text size="xl" weight="bold">
            Staff Portal Sign In
          </Text>
          <Text tone="muted">
            Dedicated workspace for clinicians, reception teams, and clinic
            administrators.
          </Text>
        </div>

        {/* Role Selector Tabs */}
        <div
          className="auth-segmented"
          style={{
            display: "flex",
            background: "#f1f3f2",
            borderRadius: "8px",
            padding: "4px",
            gap: "4px",
          }}
        >
          <button
            type="button"
            className={`auth-seg-btn ${role === "Doctor" ? "auth-seg-active" : ""}`}
            onClick={() => handleRoleChange("Doctor")}
            style={{
              flex: 1,
              padding: "8px 8px",
              borderRadius: "6px",
              border: "none",
              background: role === "Doctor" ? "#ffffff" : "transparent",
              fontWeight: role === "Doctor" ? 600 : 400,
              color: role === "Doctor" ? "#0f766e" : "#64706e",
              boxShadow:
                role === "Doctor" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            <Stethoscope
              size={14}
              style={{ verticalAlign: "middle", marginRight: "4px" }}
            />
            Doctor
          </button>
          <button
            type="button"
            className={`auth-seg-btn ${role === "Receptionist" ? "auth-seg-active" : ""}`}
            onClick={() => handleRoleChange("Receptionist")}
            style={{
              flex: 1,
              padding: "8px 8px",
              borderRadius: "6px",
              border: "none",
              background: role === "Receptionist" ? "#ffffff" : "transparent",
              fontWeight: role === "Receptionist" ? 600 : 400,
              color: role === "Receptionist" ? "#0f766e" : "#64706e",
              boxShadow:
                role === "Receptionist" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            <User
              size={14}
              style={{ verticalAlign: "middle", marginRight: "4px" }}
            />
            Reception
          </button>
          <button
            type="button"
            className={`auth-seg-btn ${role === "Admin" ? "auth-seg-active" : ""}`}
            onClick={() => handleRoleChange("Admin")}
            style={{
              flex: 1,
              padding: "8px 8px",
              borderRadius: "6px",
              border: "none",
              background: role === "Admin" ? "#ffffff" : "transparent",
              fontWeight: role === "Admin" ? 600 : 400,
              color: role === "Admin" ? "#0f766e" : "#64706e",
              boxShadow:
                role === "Admin" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            <ShieldCheck
              size={14}
              style={{ verticalAlign: "middle", marginRight: "4px" }}
            />
            Admin
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              color: "#b42318",
              fontSize: "14px",
              background: "#fef3f2",
              padding: "8px 12px",
              borderRadius: "8px",
            }}
          >
            {errorMessage}
          </div>
        )}

        <Field
          label="Staff ID or Clinic Email"
          placeholder="e.g. DOC-101 or arjun@aarogya.in"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <Field
          label="Password"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button full onClick={handleSubmit}>
          Sign in to {role} Workspace
        </Button>

        {/* Quick Staff Selectors for easy testing */}
        <div style={{ borderTop: "1px solid #dfe5e3", paddingTop: "16px" }}>
          <Text
            size="xs"
            weight="bold"
            tone="muted"
            style={{ marginBottom: "8px" }}
          >
            ONE-CLICK STAFF TEST LOGINS
          </Text>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button
              type="button"
              className="auth-shortcut-btn"
              onClick={() => {
                handleRoleChange("Doctor")
                staffLogin({
                  identifier: "DOC-101",
                  password: "doctor123",
                  role: "Doctor",
                })
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #dfe5e3",
                background: "#f7f9f8",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
              }}
            >
              <div>
                <strong>Dr. Arjun Sharma (DOC-101)</strong>
                <div style={{ color: "#64706e", fontSize: "12px" }}>
                  General Physician · Room 2
                </div>
              </div>
              <Stethoscope size={16} color="#0f766e" />
            </button>

            <button
              type="button"
              className="auth-shortcut-btn"
              onClick={() => {
                handleRoleChange("Doctor")
                staffLogin({
                  identifier: "DOC-102",
                  password: "doctor123",
                  role: "Doctor",
                })
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #dfe5e3",
                background: "#f7f9f8",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
              }}
            >
              <div>
                <strong>Dr. Meera Nair (DOC-102)</strong>
                <div style={{ color: "#64706e", fontSize: "12px" }}>
                  Internal Medicine · Room 4
                </div>
              </div>
              <Stethoscope size={16} color="#0f766e" />
            </button>

            <button
              type="button"
              className="auth-shortcut-btn"
              onClick={() => {
                handleRoleChange("Receptionist")
                staffLogin({
                  identifier: "REC-201",
                  password: "staff123",
                  role: "Receptionist",
                })
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #dfe5e3",
                background: "#f7f9f8",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
              }}
            >
              <div>
                <strong>Sneha Kapoor (REC-201)</strong>
                <div style={{ color: "#64706e", fontSize: "12px" }}>
                  Front Desk Receptionist
                </div>
              </div>
              <UserCheck size={16} color="#0f766e" />
            </button>

            <button
              type="button"
              className="auth-shortcut-btn"
              onClick={() => {
                handleRoleChange("Admin")
                staffLogin({
                  identifier: "ADM-301",
                  password: "admin123",
                  role: "Admin",
                })
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #dfe5e3",
                background: "#f7f9f8",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
              }}
            >
              <div>
                <strong>Clinic Administrator (ADM-301)</strong>
                <div style={{ color: "#64706e", fontSize: "12px" }}>
                  System & Queue Rules Manager
                </div>
              </div>
              <ShieldCheck size={16} color="#0f766e" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
