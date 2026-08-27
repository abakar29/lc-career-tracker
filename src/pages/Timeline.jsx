import { useCallback, useMemo, useState } from "react";
import { Search, Plus, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { useData } from "../context/DataContext";
import { formatShortDate } from "../lib/utils";
import { buildTimelineEntries, groupByTerm, FILTER_CATEGORIES } from "../lib/timeline";
import {
  Card,
  Button,
  Modal,
  ConfirmDialog,
  TextField,
  TextArea,
  SelectField,
  DateField,
} from "../components/ui";
import TimelineDrawer from "../components/TimelineDrawer";

const EXPERIENCE_TYPES = ["Internship", "Study Abroad", "Campus Activity", "Research", "Volunteer", "Other"];
const STATUS_OPTIONS = ["Active", "In Progress", "Completed"];
const STATUS_LABELS = { Active: "Current", "In Progress": "In Progress", Completed: "Completed" };

const TYPE_BADGE_CLASSES = {
  Internship: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30",
  "Study Abroad": "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-500/30",
  "Campus Activity": "bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-200 dark:bg-pink-500/10 dark:text-pink-300 dark:ring-pink-500/30",
  Research: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/30",
  Volunteer: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-500/30",
  Other: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-white/10 dark:text-neutral-300 dark:ring-white/20",
  Skill: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
};
const DEFAULT_BADGE_CLASS =
  "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30";

function typeBadgeClass(typeLabel) {
  return TYPE_BADGE_CLASSES[typeLabel] ?? DEFAULT_BADGE_CLASS;
}

const EMPTY_FORM = {
  experience_type: "Internship",
  organization_name: "",
  location: "",
  start_date: "",
  end_date: "",
  current_status: "In Progress",
  role_description: "",
};

function loadStoredMap(prefix, items) {
  const map = {};
  items.forEach((item) => {
    const stored = localStorage.getItem(`${prefix}${item.id}`);
    if (stored) map[item.id] = stored;
  });
  return map;
}

function validate(values) {
  const errors = {};
  if (!values.organization_name.trim()) errors.organization_name = "Organization is required.";
  if (!values.start_date) errors.start_date = "Start date is required.";
  if (values.end_date && values.start_date && values.end_date < values.start_date) {
    errors.end_date = "End date can't be before the start date.";
  }
  return errors;
}

function TimelineRow({ entry, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#232428]"
    >
      <span
        className={`inline-flex flex-shrink-0 items-center rounded-full px-2 py-1 text-[10px] font-bold tracking-wide ${typeBadgeClass(entry.typeLabel)}`}
      >
        {entry.typeLabel}
      </span>

      <div className="flex min-w-0 flex-1 items-baseline gap-2">
        <span className="truncate font-semibold text-slate-900 dark:text-[#F8F9FA]">{entry.title}</span>
      </div>

      <span className="flex-shrink-0 text-xs font-medium text-slate-500 dark:text-neutral-400">
        {formatShortDate(entry.date)}
      </span>
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400 dark:text-neutral-500" aria-hidden="true" />
    </button>
  );
}

function TermAccordion({ term, isExpanded, onToggle, onOpenEntry }) {
  const presentTypes = useMemo(
    () => [...new Set(term.entries.map((e) => e.typeLabel))],
    [term.entries]
  );

  return (
    <section className="relative pl-8">
      <span
        className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-brand-orange ring-4 ring-brand-surface dark:ring-[#1A1919]"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => onToggle(term.key)}
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-2 rounded-lg py-1 text-left hover:bg-slate-100/60 dark:hover:bg-white/5"
      >
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-slate-400 dark:text-neutral-500 transition-transform ${
            isExpanded ? "" : "-rotate-90"
          }`}
          aria-hidden="true"
        />
        <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8F9FA]">{term.label}</h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-neutral-300">
          {term.entries.length} {term.entries.length === 1 ? "entry" : "entries"}
        </span>
        <div className="hidden flex-wrap gap-1.5 sm:flex">
          {presentTypes.map((type) => (
            <span key={type} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeBadgeClass(type)}`}>
              {type}
            </span>
          ))}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {term.entries.map((entry) => (
            <TimelineRow key={entry.id} entry={entry} onOpen={onOpenEntry} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Timeline() {
  const { experiences, skills, addExperience, updateExperience, deleteExperience } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [toggledTerms, setToggledTerms] = useState(() => new Set());
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [descriptions, setDescriptions] = useState(() => loadStoredMap("exp_description_", experiences));
  const [achievements, setAchievements] = useState(() => loadStoredMap("exp_achievements_", experiences));

  function toggleTerm(key) {
    setToggledTerms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function updateDescription(exp, value) {
    setDescriptions((prev) => ({ ...prev, [exp.id]: value }));
    localStorage.setItem(`exp_description_${exp.id}`, value);
  }

  function updateAchievements(exp, value) {
    setAchievements((prev) => ({ ...prev, [exp.id]: value }));
    localStorage.setItem(`exp_achievements_${exp.id}`, value);
  }

  function descriptionFor(exp) {
    return descriptions[exp.id] ?? exp.role_description ?? "";
  }

  function handleCopyBullet(exp) {
    const bulletText = `• ${exp.organization_name}: ${descriptionFor(exp)}`;
    navigator.clipboard.writeText(bulletText);
    setCopiedId(exp.id);
    setTimeout(() => setCopiedId((id) => (id === exp.id ? null : id)), 1500);
  }

  const closeModal = useCallback(() => setModalOpen(false), []);

  function openAddModal() {
    setEditingId(null);
    setFormValues(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(exp) {
    setEditingId(exp.id);
    setFormValues({
      experience_type: exp.experience_type,
      organization_name: exp.organization_name,
      location: exp.location ?? "",
      start_date: exp.start_date ?? "",
      end_date: exp.end_date ?? "",
      current_status: exp.current_status,
      role_description: exp.role_description ?? "",
    });
    setErrors({});
    setModalOpen(true);
  }

  function updateField(field, value) {
    setFormValues((v) => ({ ...v, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(formValues);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = { ...formValues, end_date: formValues.end_date || null };
    if (editingId) {
      updateExperience(editingId, payload);
    } else {
      addExperience(payload);
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (deleteTarget) deleteExperience(deleteTarget.id);
    setDeleteTarget(null);
  }

  const allEntries = useMemo(() => buildTimelineEntries({ experiences, skills }), [experiences, skills]);

  const searchedEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allEntries;
    return allEntries.filter((entry) =>
      [entry.title, entry.description, entry.sector, entry.typeLabel]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [allEntries, searchQuery]);

  const filteredEntries = useMemo(() => {
    if (categoryFilter === "all") return searchedEntries;
    return searchedEntries.filter((entry) => entry.filterCategory === categoryFilter);
  }, [searchedEntries, categoryFilter]);

  const terms = useMemo(() => groupByTerm(filteredEntries), [filteredEntries]);

  const selectedExp = selectedEntry?.kind === "EXPERIENCE" ? selectedEntry.raw : null;
  const matchedSkills = selectedExp
    ? skills.filter((s) => s.context === selectedExp.experience_type)
    : [];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F8F9FA]">
            Experience &amp; Career Timeline
          </h1>
          <p className="mt-1 text-slate-500 dark:text-neutral-400">
            Every internship, activity, and skill you've logged, laid out term by term.
          </p>
        </div>
        <Button onClick={openAddModal} className="flex-shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add experience
        </Button>
      </div>

      <div className="sticky top-[52px] z-10 -mx-4 mt-6 space-y-3 border-b border-slate-200 bg-brand-surface/95 px-4 py-3 backdrop-blur md:top-0 md:-mx-8 md:px-8 dark:border-white/10 dark:bg-[#1A1919]/95">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timeline..."
              aria-label="Search timeline"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-white/10 dark:bg-[#232428] dark:text-[#F8F9FA] dark:placeholder:text-neutral-500"
            />
          </div>
          <span className="inline-flex flex-shrink-0 items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-neutral-300">
            {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = categoryFilter === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategoryFilter(cat.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-orange text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/15"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {terms.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="rounded-full bg-orange-50 p-3 dark:bg-orange-500/10">
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-300" aria-hidden="true" />
            </div>
            <p className="font-medium text-slate-700 dark:text-neutral-200">
              {allEntries.length === 0 ? "No timeline entries yet" : "No entries match your filters"}
            </p>
            <p className="max-w-sm text-sm text-slate-500 dark:text-neutral-400">
              {allEntries.length === 0
                ? "Add an experience or log a skill and it will show up here, organized by term."
                : "Try a different search term or category."}
            </p>
            {allEntries.length === 0 && (
              <Button onClick={openAddModal} className="mt-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add experience
              </Button>
            )}
          </Card>
        ) : (
          <div className="relative">
            <div
              className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-slate-200 dark:bg-white/10"
              aria-hidden="true"
            />
            <div className="space-y-8">
              {terms.map((term, index) => (
                <TermAccordion
                  key={term.key}
                  term={term}
                  isExpanded={toggledTerms.has(term.key) ? index !== 0 : index === 0}
                  onToggle={toggleTerm}
                  onOpenEntry={setSelectedEntry}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <TimelineDrawer
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        matchedSkills={matchedSkills}
        description={selectedExp ? descriptionFor(selectedExp) : ""}
        onDescriptionChange={(value) => selectedExp && updateDescription(selectedExp, value)}
        achievements={selectedExp ? achievements[selectedExp.id] ?? "" : ""}
        onAchievementsChange={(value) => selectedExp && updateAchievements(selectedExp, value)}
        onCopyBullet={() => selectedExp && handleCopyBullet(selectedExp)}
        copied={!!selectedExp && copiedId === selectedExp.id}
        onEdit={() => {
          if (!selectedExp) return;
          setSelectedEntry(null);
          openEditModal(selectedExp);
        }}
        onDelete={() => {
          if (!selectedExp) return;
          setSelectedEntry(null);
          setDeleteTarget(selectedExp);
        }}
      />

      <Modal open={modalOpen} onClose={closeModal} title={editingId ? "Edit experience" : "Add experience"}>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <SelectField
            label="Type"
            required
            value={formValues.experience_type}
            onChange={(e) => updateField("experience_type", e.target.value)}
          >
            {EXPERIENCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Organization"
            required
            placeholder="e.g. Adidas North America"
            value={formValues.organization_name}
            error={errors.organization_name}
            onChange={(e) => updateField("organization_name", e.target.value)}
          />
          <TextField
            label="Location"
            placeholder="e.g. Portland, OR"
            value={formValues.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
          <TextArea
            label="Role Description"
            placeholder="Briefly describe what you did or are doing here"
            value={formValues.role_description}
            onChange={(e) => updateField("role_description", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <DateField
              label="Start date"
              required
              value={formValues.start_date}
              error={errors.start_date}
              onChange={(e) => updateField("start_date", e.target.value)}
            />
            <DateField
              label="End date"
              value={formValues.end_date}
              error={errors.end_date}
              onChange={(e) => updateField("end_date", e.target.value)}
            />
          </div>
          <SelectField
            label="Status"
            required
            value={formValues.current_status}
            onChange={(e) => updateField("current_status", e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] ?? s}
              </option>
            ))}
          </SelectField>
          <div className="flex items-center justify-between pt-2">
            {editingId ? (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  const target = experiences.find((exp) => exp.id === editingId);
                  setModalOpen(false);
                  setDeleteTarget(target);
                }}
              >
                Delete Experience
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingId ? "Save changes" : "Add experience"}</Button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete experience?"
        description={`This removes ${deleteTarget?.organization_name ?? "this entry"} from your timeline. This can't be undone.`}
      />
    </div>
  );
}
