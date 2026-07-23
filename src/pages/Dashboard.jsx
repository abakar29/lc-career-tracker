import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  GraduationCap,
  Network,
  Zap,
  FileCheck,
  Plus,
  Trash2,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { formatDate, daysSince, computeProfileCompleteness } from "../lib/utils";
import {
  Card,
  CardHeader,
  Badge,
  RadialProgress,
  Button,
  IconButton,
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

function CompactStatCard({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border-l-4 border-l-brand-orange bg-white p-4 shadow-sm">
      <div className="rounded-lg bg-orange-50 p-2.5">
        <Icon className="h-5 w-5 text-brand-orange" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function CareerReadinessHero({ score, checks, classYear, major, onReplayOnboarding }) {
  const next = checks.filter((c) => !c.done);
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#433E3C] px-6 py-8 md:px-8 md:py-10 text-white shadow-lg">
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
          <h1 className="mt-1 text-3xl font-bold">Good evening, Abu 👋</h1>
          <p className="mt-3 max-w-md text-neutral-300 text-sm">
            Your Career Readiness Score reflects how prepared you are to apply, right now,
            based on your logged experience, network, and skills.
          </p>

          {next.length === 0 ? (
            <p className="mt-4 max-w-md text-sm text-neutral-300">
              Every readiness check is complete. Keep your resume and applications current to
              stay ahead.
            </p>
          ) : (
            <ol className="mt-4 max-w-md space-y-3.5">
              {next.map((c, i) => (
                <li key={c.label} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-brand-orange">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{c.label}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{c.why}</p>
                    {c.cta && (
                      <Link
                        to={c.cta.to}
                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-orange-300"
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

          <button
            type="button"
            onClick={onReplayOnboarding}
            className="mt-4 inline-flex items-center gap-1.5 rounded text-xs font-medium text-neutral-300 underline decoration-neutral-500 underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            What is PioneerPath?
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <RadialProgress value={score} size={140} strokeWidth={12} progressColor="#f97316" />
          <p className="text-xs text-neutral-300 font-medium">Career Readiness Score</p>
        </div>
      </div>
    </div>
  );
}

function ResumeGeneratorCard() {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Resume Generator</h2>
        <p className="mt-1 text-sm text-slate-500">Paste your resume for ATS optimization</p>
      </div>
      <button
        type="button"
        className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Optimize Resume
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
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
    <Card className="border-l-4 border-l-brand-black transition-all hover:shadow-md">
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
        {sorted.map((a) => (
          <li key={a.id} className="group flex items-center justify-between gap-3 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">{a.company}</p>
              <p className="text-xs text-slate-500">
                {a.role} · Applied {formatDate(a.dateApplied)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => cycleStatus(a.id)}
                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                aria-label={`Cycle status for ${a.company}, currently ${a.status}`}
              >
                <Badge tone={STATUS_TONE[a.status] ?? "slate"}>{a.status}</Badge>
              </button>
              <IconButton
                icon={Trash2}
                label={`Delete ${a.company} application`}
                variant="danger"
                onClick={() => deleteApplication(a.id)}
                className="opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function NeedsAttentionCard({ networkConnections, resumeVersions }) {
  const items = [];

  networkConnections.forEach((c) => {
    const days = daysSince(c.last_contacted_date);
    if (days > 30) {
      items.push({
        key: `net-${c.id}`,
        text: `Follow up with ${c.contact_name} at ${c.employer_company}, ${days} days since last contact`,
      });
    }
  });

  resumeVersions.forEach((r) => {
    if (r.status === "Needs review") {
      items.push({
        key: `res-${r.id}`,
        text: `"${r.name}" resume hasn't been reviewed since ${formatDate(r.lastUpdated)}`,
      });
    }
  });

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl shadow-sm bg-[#FEF0E6] transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <h2 className="text-base font-semibold text-slate-900">Needs Your Attention</h2>
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" aria-hidden="true" />
      </div>
      <ul className="px-5 pb-5 mt-2 space-y-3">
        {items.map((item) => (
          <li key={item.key} className="flex items-start gap-2.5 text-sm text-slate-600">
            <span
              className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-orange"
              aria-hidden="true"
            />
            {item.text}
          </li>
        ))}
      </ul>
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

  function dismissOnboarding() {
    completeOnboarding();
    setShowOnboarding(false);
  }

  const { score, checks } = computeProfileCompleteness({
    experiences,
    networkConnections,
    skills,
    resumeVersions,
    applications,
  });

  return (
    <div className="space-y-6">
      <Onboarding open={showOnboarding} onDismiss={dismissOnboarding} />

      <CareerReadinessHero
        score={score}
        checks={checks}
        classYear="2029"
        major="Economics &amp; Entrepreneurship"
        onReplayOnboarding={() => setShowOnboarding(true)}
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <div className="grid grid-cols-2 gap-4">
          <CompactStatCard icon={GraduationCap} value={experiences.length} label="Experience" />
          <CompactStatCard icon={Network} value={networkConnections.length} label="Network" />
          <CompactStatCard icon={Zap} value={skills.length} label="Skills" />
          <CompactStatCard icon={FileCheck} value={applications.length} label="Applications" />
        </div>
        <ResumeGeneratorCard />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ApplicationTrackerCard applications={applications} />
        </div>
        <NeedsAttentionCard networkConnections={networkConnections} resumeVersions={resumeVersions} />
      </div>
    </div>
  );
}
