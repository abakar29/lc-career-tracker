import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  Network,
  Zap,
  FileCheck,
  Plus,
  ChevronDown,
  ChevronUp,
  Compass,
  AlertCircle,
  Clock,
  TrendingUp,
  Check,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { formatDate, daysSince, computeProfileCompleteness } from "../lib/utils";
import { networkConnections as mockNetworkConnections } from "../data/mockData";
import {
  CardHeader,
  Badge,
  RadialProgress,
  Button,
  TextField,
  SelectField,
  DateField,
} from "../components/ui";
import Onboarding from "../components/Onboarding";

const APPLICATION_STATUSES = ["Applied", "Interviewing", "Offer", "Rejected"];

const STATUS_TONE = {
  Active: "green",
  "In Progress": "amber",
  Completed: "slate",
  Offer: "green",
  Interviewing: "amber",
  Applied: "orange",
  Rejected: "red",
};

const STAT_TINTS = {
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  green: { bg: "bg-emerald-50", text: "text-emerald-600" },
};

const COMPANY_LOGOS = {
  "Portland General Electric": "/portland-ge-logo.png",
  "Nike, Inc.": "/nike-logo.png",
  "Adidas North America": "/adidas-logo.png",
  "Intel Corporation": "/intel-logo.png",
};

const LOGO_COLORS = [
  "bg-orange-600",
  "bg-slate-600",
  "bg-amber-500",
  "bg-neutral-700",
  "bg-orange-800",
  "bg-slate-800",
];

function companyInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function companyColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return LOGO_COLORS[hash % LOGO_COLORS.length];
}

function CompanyLogo({ company }) {
  const [failed, setFailed] = useState(false);
  const logoUrl = COMPANY_LOGOS[company];

  if (!logoUrl || failed) {
    return (
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${companyColor(company)}`}
        aria-hidden="true"
      >
        {companyInitials(company)}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${company} logo`}
      className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function CompactStatCard({ icon: Icon, value, label, sublabel, tint = "orange", onClick }) {
  const colors = STAT_TINTS[tint];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className={`rounded-lg ${colors.bg} p-2.5`}>
        <Icon className={`h-5 w-5 ${colors.text}`} aria-hidden="true" />
      </div>
      <div>
        <p className="text-[28px] font-bold leading-tight text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-0.5 text-xs font-medium text-emerald-600">{sublabel}</p>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  let greeting;
  if (hour >= 5 && hour < 12) greeting = "Good morning";
  else if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17 && hour < 22) greeting = "Good evening";
  else greeting = "Good night";
  return greeting;
}

function CareerReadinessHero({ score, checks, classYear, major, name, attentionCount, breakdown }) {
  const next = checks.filter((c) => !c.done);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const breakdownRef = useRef(null);

  useEffect(() => {
    if (!breakdownOpen) return;
    function handleClickOutside(e) {
      if (breakdownRef.current && !breakdownRef.current.contains(e.target)) {
        setBreakdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [breakdownOpen]);

  const statusLabel =
    attentionCount > 0
      ? `${attentionCount} task${attentionCount !== 1 ? "s" : ""} need attention`
      : "You're on track";
  const statusTone = attentionCount > 0 ? "amber" : "green";

  return (
    <div className="relative overflow-visible rounded-2xl bg-[#433E3C] px-6 py-8 md:px-8 md:py-10 text-white shadow-lg">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-10 -bottom-16 h-56 w-56 rounded-full bg-white/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex-1">
          <p className="text-orange-300 text-sm font-medium">
            Class of {classYear} · {major}
          </p>
          <h1 className="mt-1 text-[32px] font-bold">{getGreeting()}, {name}</h1>
          <p className="mt-3 max-w-md text-neutral-300 text-sm">
            Your Career Readiness Score reflects how prepared you are to apply, right now,
            based on your logged experience, network, and skills.
          </p>

          {next.length > 0 && (
            <ol className="mt-4 max-w-md space-y-3.5">
              {next.map((c, i) => (
                <li key={c.label} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-[#B85A12]">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{c.label}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{c.why}</p>
                    {c.cta && (
                      <Link
                        to={c.cta.to}
                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#B85A12] hover:text-orange-300"
                      >
                        {c.cta.label}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <RadialProgress value={score} size={140} strokeWidth={12} progressColor="#f97316" />
          <p className="text-xs text-neutral-300 font-medium">Career Readiness Score</p>

          <div ref={breakdownRef} className="relative">
            <button
              type="button"
              onClick={() => setBreakdownOpen((v) => !v)}
              className="text-[11px] font-medium text-orange-300 hover:text-orange-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            >
              View breakdown
            </button>
            {breakdownOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xl">
                <p className="text-sm font-semibold text-slate-900">Score Breakdown</p>
                <ul className="mt-3 space-y-3">
                  {breakdown.map((b) => (
                    <li key={b.label}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <span
                            className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                              b.complete ? "bg-emerald-100" : "bg-slate-100"
                            }`}
                          >
                            {b.complete && (
                              <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={3} aria-hidden="true" />
                            )}
                          </span>
                          <span className="text-sm font-medium text-slate-700">{b.label}</span>
                        </span>
                        <span className="text-sm font-semibold text-slate-900">{b.weight}</span>
                      </div>
                      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${b.complete ? "bg-emerald-500" : "bg-slate-300"}`}
                          style={{ width: b.complete ? "100%" : "0%" }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              statusTone === "amber"
                ? "bg-amber-500/15 text-amber-300"
                : "bg-emerald-500/15 text-emerald-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusTone === "amber" ? "bg-amber-400" : "bg-emerald-400"}`}
              aria-hidden="true"
            />
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplicationTrackerCard({ applications: initialApplications }) {
  const [applications, setApplications] = useState(initialApplications);
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [status, setStatus] = useState("Applied");
  const [expandedId, setExpandedId] = useState(null);

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const sorted = [...applications].sort(
    (a, b) => new Date(b.dateApplied) - new Date(a.dateApplied)
  );

  function resetForm() {
    setCompany("");
    setRole("");
    setDateApplied("");
    setStatus("Applied");
    setShowForm(false);
  }

  function handleSave() {
    setApplications((prev) => [
      ...prev,
      {
        id: `app-${Date.now()}`,
        company: company.trim(),
        role: role.trim(),
        dateApplied,
        status,
      },
    ]);
    resetForm();
  }

  function cycleStatus(id) {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const nextIndex = (APPLICATION_STATUSES.indexOf(a.status) + 1) % APPLICATION_STATUSES.length;
        return { ...a, status: APPLICATION_STATUSES[nextIndex] };
      })
    );
  }

  function deleteApplication(id) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      <CardHeader
        title="Application Tracker"
        subtitle={`${applications.length} applications`}
        action={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add Application
          </button>
        }
      />

      {showForm && (
        <div className="mx-5 mt-3 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <TextField
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Nike, Inc."
          />
          <TextField
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. UX Research Intern"
          />
          <DateField
            label="Date Applied"
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
          />
          <SelectField label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </SelectField>
          <div className="flex items-center gap-4 pt-1">
            <Button type="button" onClick={handleSave}>Save</Button>
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="mt-2 max-h-[260px] divide-y divide-slate-100 overflow-y-auto px-5 pb-5">
        {sorted.map((a) => {
          const isExpanded = expandedId === a.id;
          return (
            <li key={a.id} className="py-3">
              <div
                onClick={() => toggleExpand(a.id)}
                className="flex cursor-pointer items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <CompanyLogo company={a.company} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{a.company}</p>
                    <p className="text-xs text-slate-500">
                      {a.role} · Applied {formatDate(a.dateApplied)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cycleStatus(a.id);
                    }}
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    aria-label={`Cycle status for ${a.company}, currently ${a.status}`}
                  >
                    <Badge tone={STATUS_TONE[a.status] ?? "slate"}>{a.status}</Badge>
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 cursor-default"
                >
                  <p className="text-xs text-slate-500">
                    {a.role} at {a.company} · Applied {formatDate(a.dateApplied)}
                  </p>
                  <Button
                    type="button"
                    variant="danger"
                    className="px-3 py-1.5 text-xs"
                    onClick={() => deleteApplication(a.id)}
                  >
                    Delete Application
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function buildCompassItems(navigate) {
  const mostOverdueContact = [...mockNetworkConnections].sort(
    (a, b) => daysSince(b.last_contacted_date) - daysSince(a.last_contacted_date)
  )[0];
  const overdueDays = daysSince(mostOverdueContact.last_contacted_date);

  return [
    {
      key: "follow-up",
      borderColor: "border-l-red-500",
      icon: AlertCircle,
      iconColor: "text-red-500",
      title: `Follow up with ${mostOverdueContact.contact_name}`,
      subtitle: `${overdueDays} days since last contact — overdue`,
      actionLabel: "Follow up →",
      onAction: () => navigate("/network"),
    },
    {
      key: "resume",
      borderColor: "border-l-amber-500",
      icon: Clock,
      iconColor: "text-amber-500",
      title: "Update your Product Management resume",
      subtitle: "Last reviewed May 5 — needs attention",
      actionLabel: "Review →",
      onAction: () => navigate("/resume"),
    },
    {
      key: "skills",
      borderColor: "border-l-emerald-500",
      icon: TrendingUp,
      iconColor: "text-emerald-500",
      title: "Add more skills to your profile",
      subtitle: "You have 5 experiences but only 7 skills logged",
      actionLabel: "Add Skills →",
      onAction: () => navigate("/skills"),
    },
  ];
}

function CareerCompassCard({ items }) {
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Career Compass</h2>
          <p className="text-sm text-slate-500 mt-0.5">Your personalized next steps</p>
        </div>
        <Compass className="h-5 w-5 flex-shrink-0 text-brand-orange" aria-hidden="true" />
      </div>
      <div className="px-5 pb-5 mt-3 space-y-3">
        {items.map((item) => (
          <div
            key={item.key}
            className={`rounded-lg border border-slate-200 border-l-4 bg-slate-50/60 px-3 py-3 ${item.borderColor}`}
          >
            <div className="flex items-start gap-2.5">
              <item.icon
                className={`h-4 w-4 flex-shrink-0 mt-0.5 ${item.iconColor}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                <button
                  type="button"
                  onClick={item.onAction}
                  className="mt-2 rounded-full bg-brand-orange px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {item.actionLabel}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const {
    profile,
    experiences,
    networkConnections,
    skills,
    resumeVersions,
    applications,
    onboarded,
    completeOnboarding,
  } = useData();

  const [showOnboarding, setShowOnboarding] = useState(!onboarded);
  const [profileName] = useState(
    () => localStorage.getItem("abuve:profile:name") || "Abu"
  );
  const [profileMajor] = useState(
    () => localStorage.getItem("abuve:profile:major") || "Economics & Entrepreneurship"
  );
  const [profileClassYear] = useState(
    () => localStorage.getItem("abuve:profile:classyear") || "2029"
  );
  const navigate = useNavigate();
  const applicationTrackerRef = useRef(null);

  function dismissOnboarding() {
    completeOnboarding();
    setShowOnboarding(false);
  }

  function scrollToApplications() {
    applicationTrackerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const { score, checks } = computeProfileCompleteness({
    experiences,
    networkConnections,
    skills,
    resumeVersions,
    applications,
  });

  const compassItems = buildCompassItems(navigate);

  const scoreBreakdown = [
    { label: "Experiences", weight: "25%", complete: experiences.length > 0 },
    { label: "Skills", weight: "25%", complete: skills.length > 0 },
    { label: "Network", weight: "25%", complete: networkConnections.length > 0 },
    { label: "Applications", weight: "25%", complete: applications.length > 0 },
  ];

  return (
    <div className="space-y-6">
      <Onboarding open={showOnboarding} onDismiss={dismissOnboarding} />

      <CareerReadinessHero
        score={score}
        checks={checks}
        classYear={profileClassYear}
        major={profileMajor}
        name={profileName}
        attentionCount={compassItems.length}
        breakdown={scoreBreakdown}
      />

      <hr className="border-t border-slate-200" aria-hidden="true" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <CompactStatCard
          icon={GraduationCap}
          value={experiences.length}
          label="Experience"
          sublabel="2 active"
          tint="orange"
          onClick={() => navigate("/experience")}
        />
        <CompactStatCard
          icon={Network}
          value={networkConnections.length}
          label="Network"
          sublabel="1 overdue"
          tint="blue"
          onClick={() => navigate("/network")}
        />
        <CompactStatCard
          icon={Zap}
          value={skills.length}
          label="Skills"
          sublabel="3 advanced"
          tint="purple"
          onClick={() => navigate("/skills")}
        />
        <CompactStatCard
          icon={FileCheck}
          value={applications.length}
          label="Applications"
          sublabel="1 offer"
          tint="green"
          onClick={scrollToApplications}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2 h-full" ref={applicationTrackerRef}>
          <ApplicationTrackerCard applications={applications} />
        </div>
        <div className="h-full">
          <CareerCompassCard items={compassItems} />
        </div>
      </div>
    </div>
  );
}
