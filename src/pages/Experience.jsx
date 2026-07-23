import { useState } from "react";
import { Briefcase, Plus, Pencil, Trash2 } from "lucide-react";
import { useData } from "../context/DataContext";
import { formatDate } from "../lib/utils";
import {
  Card,
  Badge,
  Button,
  IconButton,
  Modal,
  ConfirmDialog,
  TextField,
  SelectField,
  DateField,
} from "../components/ui";

const EXPERIENCE_TYPES = [
  "Internship",
  "Study Abroad",
  "Campus Activity",
  "Research",
  "Volunteer",
  "Other",
];

const STATUS_OPTIONS = ["Active", "In Progress", "Completed"];

const STATUS_TONE = {
  Active: "green",
  "In Progress": "amber",
  Completed: "slate",
};

const TYPE_STYLES = {
  Internship: { dot: "bg-orange-500", badge: "orange" },
  "Study Abroad": { dot: "bg-amber-500", badge: "amber" },
  "Campus Activity": { dot: "bg-slate-500", badge: "slate" },
  Research: { dot: "bg-emerald-500", badge: "green" },
  Volunteer: { dot: "bg-orange-800", badge: "orange" },
  Other: { dot: "bg-slate-400", badge: "slate" },
};

const EMPTY_FORM = {
  experience_type: "Internship",
  organization_name: "",
  location: "",
  start_date: "",
  end_date: "",
  current_status: "In Progress",
};

function validate(values) {
  const errors = {};
  if (!values.organization_name.trim()) {
    errors.organization_name = "Organization is required.";
  }
  if (!values.start_date) {
    errors.start_date = "Start date is required.";
  }
  if (values.end_date && values.start_date && values.end_date < values.start_date) {
    errors.end_date = "End date can't be before the start date.";
  }
  return errors;
}

export default function Experience() {
  const { experiences, addExperience, updateExperience, deleteExperience } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const sorted = [...experiences].sort(
    (a, b) => new Date(b.start_date) - new Date(a.start_date)
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Experience</h1>
          <p className="text-slate-500 mt-1">
            Internships, study abroad, campus activities: everything that builds your story.
          </p>
        </div>
        <Button onClick={openAddModal} className="flex-shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add experience
        </Button>
      </div>

      {sorted.length === 0 ? (
        <Card className="mt-6 flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="rounded-full bg-orange-50 p-3">
            <Briefcase className="h-8 w-8 text-orange-600" aria-hidden="true" />
          </div>
          <p className="font-medium text-slate-700">No experience logged yet</p>
          <p className="text-sm text-slate-500 max-w-sm">
            Add your first internship, study abroad term, or campus activity to start building
            your timeline.
          </p>
          <Button onClick={openAddModal} className="mt-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add experience
          </Button>
        </Card>
      ) : (
        <ol className="relative mt-6 border-l-2 border-slate-200 pl-6 space-y-6">
          {sorted.map((exp) => {
            const style = TYPE_STYLES[exp.experience_type] ?? TYPE_STYLES.Other;
            return (
              <li key={exp.id} className="relative">
                <span
                  className={`absolute -left-[1.9rem] top-5 h-3 w-3 rounded-full ring-4 ring-slate-50 ${style.dot}`}
                  aria-hidden="true"
                />
                <Card className="p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge tone={style.badge}>{exp.experience_type}</Badge>
                        <Badge tone={STATUS_TONE[exp.current_status] ?? "slate"}>
                          {exp.current_status}
                        </Badge>
                      </div>
                      <h3 className="mt-2 font-semibold text-slate-900 truncate">
                        {exp.organization_name}
                      </h3>
                      {exp.location && <p className="text-sm text-slate-500">{exp.location}</p>}
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <IconButton
                        icon={Pencil}
                        label={`Edit ${exp.organization_name}`}
                        onClick={() => openEditModal(exp)}
                      />
                      <IconButton
                        icon={Trash2}
                        label={`Delete ${exp.organization_name}`}
                        variant="danger"
                        onClick={() => setDeleteTarget(exp)}
                      />
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit experience" : "Add experience"}
      >
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
                {s}
              </option>
            ))}
          </SelectField>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingId ? "Save changes" : "Add experience"}</Button>
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
