import {
  Check,
  CheckCircle2,
  ListChecks,
  MoreHorizontal,
  Phone,
  Search,
  WifiOff,
} from "lucide-react"
import { Badge } from "../common/Badge"
import { Button, IconButton } from "../common/Button"
import { Card } from "../common/Card"
import { Field } from "../common/Field"
import { Logo } from "../layout/LayoutComponents"
import { Text } from "../common/Text"

export function FoundationPageView() {
  const colors = [
    ["Primary teal", "color-teal", "#0F766E"],
    ["Waiting", "color-blue", "Blue (#2563EB)"],
    ["Window open", "color-amber", "Amber (#9A6700)"],
    ["Checked in", "color-green", "Green (#197546)"],
    ["Consultation", "color-purple", "Purple (#7653A6)"],
    ["Skipped", "color-coral", "Coral (#BA5742)"],
    ["Emergency", "color-red", "Red (#B42318)"],
    ["Neutral", "color-gray", "Gray (#66706E)"],
  ]

  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            QTrack design foundations
          </Text>
          <Text tone="muted">
            A calm, accessible healthcare design system engineered for
            high-pressure clinic moments.
          </Text>
        </div>
      </div>

      <Card className="hero-foundation">
        <div>
          <Text size="xs" weight="bold" tone="teal">
            DESIGN PRINCIPLE 01
          </Text>
          <Text size="display" weight="bold">
            Clarity before complexity.
          </Text>
          <Text tone="muted">
            One primary action per view, readable at a glance, high contrast
            WCAG AA compliant, and intuitive across English and हिन्दी.
          </Text>
        </div>
        <div className="foundation-logo">
          <Logo />
          <Text size="sm" tone="muted">
            Healthcare queues, made human.
          </Text>
        </div>
      </Card>

      <div className="section-block">
        <Text size="lg" weight="bold">
          Colour system
        </Text>
        <div className="swatch-grid">
          {colors.map(([name, cls, code]) => (
            <div className="swatch" key={name}>
              <div className={`swatch-color ${cls}`} />
              <Text weight="semibold">{name}</Text>
              <Text size="sm" tone="muted">
                {code}
              </Text>
            </div>
          ))}
        </div>
      </div>

      <div className="two-col">
        <Card>
          <Text size="lg" weight="bold">
            Typography hierarchy
          </Text>
          <Text size="display" weight="bold">
            32 — Display / Token
          </Text>
          <Text size="xl" weight="bold">
            24 — Page title
          </Text>
          <Text size="lg" weight="semibold">
            20 — Section title
          </Text>
          <Text size="md">16 — Body copy, minimum standard size</Text>
          <Text size="sm" tone="muted">
            14 — Supporting labels and captions
          </Text>
        </Card>
        <Card>
          <Text size="lg" weight="bold">
            Spacing, accessibility & shape
          </Text>
          <div className="spacing-demo">
            <span />
            <span />
            <span />
            <span />
          </div>
          <Text tone="muted">
            8px rhythm · 8px controls · 12px cards · soft 1px borders
          </Text>
          <div className="principle-list">
            <Text>
              <Check size={17} /> 44px minimum touch targets
            </Text>
            <Text>
              <Check size={17} /> 30% text expansion safe for Devanagari
            </Text>
            <Text>
              <Check size={17} /> Colour always paired with text badges
            </Text>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function ComponentPageView() {
  const statusList = [
    "Waiting",
    "Window open",
    "Checked in",
    "Called",
    "In consultation",
    "Done",
    "Skipped",
    "Removed",
    "Priority",
  ]

  return (
    <div className="content-stack">
      <div className="page-title">
        <div>
          <Text size="xl" weight="bold">
            Component library
          </Text>
          <Text tone="muted">
            Reusable React-ready patterns, accessible inputs, and state
            primitives.
          </Text>
        </div>
      </div>

      <Card>
        <Text size="lg" weight="bold">
          Action buttons
        </Text>
        <div className="component-row">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Remove / Cancel</Button>
          <Button disabled>Disabled</Button>
          <IconButton icon={MoreHorizontal} label="More options" />
        </div>
      </Card>

      <div className="two-col">
        <Card>
          <Text size="lg" weight="bold">
            Inputs & verification
          </Text>
          <Field
            label="Phone number"
            icon={Phone}
            placeholder="+91 98765 43210"
          />
          <div>
            <Text size="sm" weight="medium">
              6-digit OTP verification
            </Text>
            <div className="otp">
              {["4", "8", "2", "", "", ""].map((val, i) => (
                <span key={i}>{val || "·"}</span>
              ))}
            </div>
          </div>
          <Field
            icon={Search}
            placeholder="Search doctor, specialty or clinic"
          />
        </Card>

        <Card>
          <Text size="lg" weight="bold">
            Queue status badges
          </Text>
          <div className="component-row">
            {statusList.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
          <div className="toast">
            <CheckCircle2 size={20} />
            <div>
              <Text weight="semibold">Patient checked in</Text>
              <Text size="sm" tone="muted">
                Token A-024 is ready to be called.
              </Text>
            </div>
          </div>
        </Card>
      </div>

      <div className="three-col">
        <Card>
          <Text size="sm" tone="muted">
            WAITING
          </Text>
          <Text size="display" weight="bold">
            12
          </Text>
          <Text size="sm" tone="teal">
            4 checked in
          </Text>
        </Card>
        <Card>
          <Text size="sm" tone="muted">
            AVERAGE WAIT
          </Text>
          <Text size="display" weight="bold">
            26m
          </Text>
          <Text size="sm" tone="muted">
            ↓ 6m from yesterday
          </Text>
        </Card>
        <Card className="empty-state">
          <div className="empty-icon">
            <ListChecks />
          </div>
          <Text weight="bold">Queue is clear</Text>
          <Text size="sm" tone="muted">
            New patients will appear here automatically.
          </Text>
        </Card>
      </div>

      <Card>
        <Text size="lg" weight="bold">
          Loading & connectivity resilience
        </Text>
        <div className="two-col">
          <div className="skeleton-card">
            <span />
            <span />
            <span />
          </div>
          <div className="offline">
            <WifiOff size={22} />
            <div>
              <Text weight="semibold">You’re offline</Text>
              <Text size="sm" tone="muted">
                Showing the last update from 2 minutes ago.
              </Text>
            </div>
            <Button variant="secondary">Retry</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
