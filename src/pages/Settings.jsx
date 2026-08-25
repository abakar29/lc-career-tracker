import { useState } from "react";
import { ExternalLink, Plus, X } from "lucide-react";
import { CardHeader, Button, TextField, SelectField, RemovablePill } from "../components/ui";
import { useData } from "../context/DataContext";
import { LC_MAJORS, LC_MINORS, formatAcademicSummary } from "../data/academics";

function AcademicsFields({ profile, updateAcademics }) {
  const primaryMajor = profile.primaryMajor ?? "";
  const secondaryMajor = profile.secondaryMajor ?? null;
  const minors = profile.minors ?? [];
  const [addingSecondMajor, setAddingSecondMajor] = useState(false);

  function setPrimaryMajor(value) {
    const patch = { primaryMajor: value };
    if (secondaryMajor === value) patch.secondaryMajor = null;
    updateAcademics(patch);
  }

  function removeSecondMajor() {
    updateAcademics({ secondaryMajor: null });
    setAddingSecondMajor(false);
  }

  function addMinor(name) {
    if (!name || minors.includes(name)) return;
    updateAcademics({ minors: [...minors, name] });
  }

  function removeMinor(name) {
    updateAcademics({ minors: minors.filter((m) => m !== name) });
  }

  const secondMajorOptions = LC_MAJORS.filter((m) => m !== primaryMajor);
  const availableMinors = LC_MINORS.filter((m) => !minors.includes(m));
  const showSecondMajorField = addingSecondMajor || !!secondaryMajor;

  return (
    <div className="space-y-4">
      <SelectField
        label="Primary Major"
        required
        value={primaryMajor}
        onChange={(e) => setPrimaryMajor(e.target.value)}
      >
        {!primaryMajor && (
          <option value="" disabled>
            Select your major
          </option>
        )}
        {LC_MAJORS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </SelectField>

      {showSecondMajorField ? (
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300">
              Second Major
            </label>
            <button
              type="button"
              onClick={removeSecondMajor}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Remove second major
            </button>
          </div>
          <select
            value={secondaryMajor ?? ""}
            onChange={(e) => updateAcademics({ secondaryMajor: e.target.value || null })}
            aria-label="Second major"
            className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] px-3 py-2 text-sm text-slate-900 dark:text-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select second major</option>
            {secondMajorOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddingSecondMajor(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-orange hover:text-orange-700 dark:hover:text-orange-300"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Second Major
        </button>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
          Minors
        </label>
        {minors.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {minors.map((m) => (
              <RemovablePill key={m} label={m} onRemove={() => removeMinor(m)} />
            ))}
          </div>
        )}
        <select
          value=""
          onChange={(e) => addMinor(e.target.value)}
          aria-label="Add a minor"
          disabled={availableMinors.length === 0}
          className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] px-3 py-2 text-sm text-slate-500 dark:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        >
          <option value="">
            {availableMinors.length === 0 ? "All minors added" : "+ Add a minor..."}
          </option>
          {availableMinors.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <p className="rounded-lg bg-orange-50 dark:bg-orange-500/10 px-3 py-2 text-sm font-medium text-orange-800 dark:text-orange-300">
        {formatAcademicSummary({ primaryMajor, secondaryMajor, minors })}
      </p>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-lg px-2 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-neutral-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5 dark:text-neutral-400">{description}</p>}
      </div>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-brand-orange" : "bg-slate-300 dark:bg-white/15"
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
  const { profile, updateAcademics } = useData();
  const [name, setName] = useState(() => localStorage.getItem('abuve:profile:name') || 'Abu Bakar');
  const [classYear, setClassYear] = useState(() => localStorage.getItem('abuve:profile:classyear') || 'Class of 2029');
  const [saved, setSaved] = useState(false);

  const [followUpReminders, setFollowUpReminders] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [resumeReminders, setResumeReminders] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    localStorage.setItem("abuve:profile:name", name);
    localStorage.setItem("abuve:profile:classyear", classYear);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="-mx-4 -my-6 min-h-screen bg-brand-surface dark:bg-[#1A1919] px-4 py-6 md:-mx-8 md:-my-8 md:px-8 md:py-8 transition-colors">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F8F9FA]">Settings</h1>
      <p className="text-slate-500 dark:text-neutral-400 mt-1">Manage your profile, notifications, and app info.</p>

      <div className="mt-6 max-w-2xl space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#232428] shadow-sm">
          <CardHeader title="Profile Settings" />
          <form onSubmit={handleSave} className="px-5 pb-5 pt-3 space-y-4">
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <AcademicsFields profile={profile} updateAcademics={updateAcademics} />
            <TextField
              label="Class Year"
              value={classYear}
              onChange={(e) => setClassYear(e.target.value)}
            />
            <div className="pt-1 flex items-center gap-3">
              <Button type="submit">Save Changes</Button>
              {saved && (
                <span className="text-sm font-medium text-orange-600 dark:text-orange-300">Profile saved</span>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#232428] shadow-sm">
          <CardHeader title="Notification Preferences" />
          <div className="px-5 pb-4 pt-1 divide-y divide-slate-100 dark:divide-white/10">
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

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#232428] shadow-sm">
          <CardHeader title="About Abuve" />
          <div className="px-5 pb-5 pt-1 space-y-2">
            <p className="text-sm text-slate-500 dark:text-neutral-400">Version v1.0.0</p>
            <p className="text-sm text-slate-600 dark:text-neutral-400">
              Built for Lewis &amp; Clark College students to track and accelerate their career
              journey
            </p>
            <a
              href="https://github.com/abakar29/lc-career-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:underline"
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
