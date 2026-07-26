import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { CardHeader, Button, TextField } from "../components/ui";

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-lg px-2 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-slate-700" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

export default function Settings() {
  const [name, setName] = useState("Abu Bakar");
  const [major, setMajor] = useState("Economics & Entrepreneurship");
  const [classYear, setClassYear] = useState("2029");
  const [saved, setSaved] = useState(false);

  const [followUpReminders, setFollowUpReminders] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [resumeReminders, setResumeReminders] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="-mx-4 -my-6 min-h-screen bg-[#F8F9FB] px-4 py-6 md:-mx-8 md:-my-8 md:px-8 md:py-8">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="text-slate-500 mt-1">Manage your profile, notifications, and app info.</p>

      <div className="mt-6 max-w-2xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader title="Profile Settings" />
          <form onSubmit={handleSave} className="px-5 pb-5 pt-3 space-y-4">
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Major" value={major} onChange={(e) => setMajor(e.target.value)} />
            <TextField
              label="Class Year"
              value={classYear}
              onChange={(e) => setClassYear(e.target.value)}
            />
            <div className="pt-1">
              <Button type="submit">{saved ? "Saved!" : "Save Changes"}</Button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader title="Notification Preferences" />
          <div className="px-5 pb-4 pt-1 divide-y divide-slate-100">
            <ToggleRow
              label="Network follow-up reminders"
              description="Get notified when a contact is overdue for a follow-up"
              checked={followUpReminders}
              onChange={setFollowUpReminders}
            />
            <ToggleRow
              label="Application status updates"
              description="Get notified about changes to your tracked applications"
              checked={applicationUpdates}
              onChange={setApplicationUpdates}
            />
            <ToggleRow
              label="Resume review reminders"
              description="Get reminded to keep your resume up to date"
              checked={resumeReminders}
              onChange={setResumeReminders}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader title="About PioneerPath" />
          <div className="px-5 pb-5 pt-1 space-y-2">
            <p className="text-sm text-slate-500">Version v1.0.0</p>
            <p className="text-sm text-slate-600">
              Built for Lewis &amp; Clark College students to track and accelerate their career
              journey
            </p>
            <a
              href="https://github.com/abakar29/lc-career-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
