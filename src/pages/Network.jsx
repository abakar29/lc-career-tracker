import { useState } from "react";
import { Users, Plus, Pencil, Trash2, Camera } from "lucide-react";
import { useData } from "../context/DataContext";
import { formatDate, daysSince } from "../lib/utils";
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
  TextArea,
} from "../components/ui";

const CONNECTION_SOURCES = [
  "Career Center Event",
  "LC Alumni Network",
  "LinkedIn",
  "Class/Club",
  "Family/Friend",
  "Other",
];

const AVATAR_COLORS = [
  "bg-orange-600",
  "bg-slate-600",
  "bg-amber-500",
  "bg-neutral-700",
  "bg-orange-800",
  "bg-slate-800",
];

function LinkedinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function urgency(days) {
  if (days <= 0) return { tone: "green", label: "Contacted today" };
  if (days <= 14) return { tone: "green", label: `${days}d since contact` };
  if (days <= 30) return { tone: "amber", label: `${days}d since contact, follow up soon` };
  return { tone: "red", label: `${days}d since contact, overdue` };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm() {
  return {
    contact_name: "",
    employer_company: "",
    job_title: "",
    last_contacted_date: todayISO(),
    connection_source: CONNECTION_SOURCES[0],
    interaction_notes: "",
  };
}

function validate(values) {
  const errors = {};
  if (!values.contact_name.trim()) errors.contact_name = "Contact name is required.";
  if (!values.employer_company.trim()) errors.employer_company = "Employer is required.";
  if (!values.job_title.trim()) errors.job_title = "Job title is required.";
  if (!values.last_contacted_date) errors.last_contacted_date = "Last contacted date is required.";
  return errors;
}

function loadStoredMap(prefix, contacts) {
  const map = {};
  contacts.forEach((c) => {
    const stored = localStorage.getItem(`${prefix}${c.contact_name}`);
    if (stored) map[c.contact_name] = stored;
  });
  return map;
}

export default function Network() {
  const { networkConnections, addContact, updateContact, deleteContact } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState(() =>
    loadStoredMap("photo_", networkConnections)
  );
  const [linkedinUrls, setLinkedinUrls] = useState(() =>
    loadStoredMap("linkedin_", networkConnections)
  );
  const [linkedinEditingId, setLinkedinEditingId] = useState(null);
  const [linkedinDraft, setLinkedinDraft] = useState("");

  function handlePhotoChange(contact, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      localStorage.setItem(`photo_${contact.contact_name}`, base64);
      setUploadedPhotos((p) => ({ ...p, [contact.contact_name]: base64 }));
    };
    reader.readAsDataURL(file);
  }

  function openLinkedinEditor(c) {
    setLinkedinEditingId(c.id);
    setLinkedinDraft(linkedinUrls[c.contact_name] ?? "");
  }

  function saveLinkedinUrl(contact) {
    const trimmed = linkedinDraft.trim();
    if (trimmed) {
      localStorage.setItem(`linkedin_${contact.contact_name}`, trimmed);
      setLinkedinUrls((u) => ({ ...u, [contact.contact_name]: trimmed }));
    }
    setLinkedinEditingId(null);
    setLinkedinDraft("");
  }

  function openAddModal() {
    setEditingId(null);
    setFormValues(emptyForm());
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(c) {
    setEditingId(c.id);
    setFormValues({
      contact_name: c.contact_name,
      employer_company: c.employer_company,
      job_title: c.job_title,
      last_contacted_date: c.last_contacted_date,
      connection_source: c.connection_source,
      interaction_notes: c.interaction_notes ?? "",
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

    if (editingId) {
      updateContact(editingId, formValues);
    } else {
      addContact(formValues);
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (deleteTarget) deleteContact(deleteTarget.id);
    setDeleteTarget(null);
  }

  const sorted = [...networkConnections].sort(
    (a, b) => daysSince(b.last_contacted_date) - daysSince(a.last_contacted_date)
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Network</h1>
          <p className="text-slate-500 mt-1">
            Alumni, recruiters, and Career Center contacts, with reminders so nobody goes cold.
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add contact
        </Button>
      </div>

      {sorted.length === 0 ? (
        <Card className="mt-6 flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="rounded-full bg-orange-50 p-3">
            <Users className="h-8 w-8 text-orange-600" aria-hidden="true" />
          </div>
          <p className="font-medium text-slate-700">No contacts saved yet</p>
          <p className="text-sm text-slate-500 max-w-sm">
            Save the people you meet at Career Center events, alumni panels, or on LinkedIn so
            you know exactly when to follow up.
          </p>
          <Button onClick={openAddModal} className="mt-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add contact
          </Button>
        </Card>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((c) => {
            const days = daysSince(c.last_contacted_date);
            const status = urgency(days);
            return (
              <Card key={c.id} className="p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      {uploadedPhotos[c.contact_name] ? (
                        <img
                          src={uploadedPhotos[c.contact_name]}
                          alt={c.contact_name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColor(c.contact_name)}`}
                          aria-hidden="true"
                        >
                          {initials(c.contact_name)}
                        </div>
                      )}
                      <label
                        htmlFor={`photo-upload-${c.id}`}
                        title={`Upload photo for ${c.contact_name}`}
                        className="absolute -bottom-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
                      >
                        <Camera className="h-3 w-3" aria-hidden="true" />
                        <span className="sr-only">Upload photo for {c.contact_name}</span>
                      </label>
                      <input
                        id={`photo-upload-${c.id}`}
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={(e) => handlePhotoChange(c, e)}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{c.contact_name}</h3>
                      <p className="text-sm text-slate-500 truncate">
                        {c.job_title} · {c.employer_company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <IconButton
                      icon={LinkedinIcon}
                      label={
                        linkedinUrls[c.contact_name]
                          ? `View ${c.contact_name} on LinkedIn`
                          : `Add LinkedIn URL for ${c.contact_name}`
                      }
                      style={{ color: linkedinUrls[c.contact_name] ? "#0077B5" : "#cbd5e1" }}
                      onClick={() => {
                        if (linkedinUrls[c.contact_name]) {
                          window.open(linkedinUrls[c.contact_name], "_blank", "noopener,noreferrer");
                        } else {
                          openLinkedinEditor(c);
                        }
                      }}
                    />
                    {linkedinUrls[c.contact_name] && linkedinEditingId !== c.id && (
                      <button
                        type="button"
                        onClick={() => openLinkedinEditor(c)}
                        className="text-xs text-slate-500 hover:text-slate-700 underline"
                      >
                        Edit
                      </button>
                    )}
                    <IconButton
                      icon={Pencil}
                      label={`Edit ${c.contact_name}`}
                      onClick={() => openEditModal(c)}
                    />
                    <IconButton
                      icon={Trash2}
                      label={`Delete ${c.contact_name}`}
                      variant="danger"
                      onClick={() => setDeleteTarget(c)}
                    />
                  </div>
                </div>

                {linkedinEditingId === c.id && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Paste LinkedIn URL..."
                      value={linkedinDraft}
                      onChange={(e) => setLinkedinDraft(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Button
                      type="button"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => saveLinkedinUrl(c)}
                    >
                      Save
                    </Button>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge tone="slate">{c.connection_source}</Badge>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>

                {c.interaction_notes && (
                  <p className="mt-3 text-sm text-slate-600 line-clamp-2">{c.interaction_notes}</p>
                )}
                <p className="mt-2 text-xs text-slate-400">
                  Last contacted {formatDate(c.last_contacted_date)}
                </p>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit contact" : "Add contact"}
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextField
            label="Contact name"
            required
            placeholder="e.g. Maya Okonkwo"
            value={formValues.contact_name}
            error={errors.contact_name}
            onChange={(e) => updateField("contact_name", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Job title"
              required
              placeholder="e.g. Product Manager"
              value={formValues.job_title}
              error={errors.job_title}
              onChange={(e) => updateField("job_title", e.target.value)}
            />
            <TextField
              label="Employer"
              required
              placeholder="e.g. Nike, Inc."
              value={formValues.employer_company}
              error={errors.employer_company}
              onChange={(e) => updateField("employer_company", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DateField
              label="Last contacted"
              required
              value={formValues.last_contacted_date}
              error={errors.last_contacted_date}
              onChange={(e) => updateField("last_contacted_date", e.target.value)}
            />
            <SelectField
              label="Met through"
              required
              value={formValues.connection_source}
              onChange={(e) => updateField("connection_source", e.target.value)}
            >
              {CONNECTION_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectField>
          </div>
          <TextArea
            label="Notes"
            placeholder="What did you talk about? Any follow-up you promised?"
            value={formValues.interaction_notes}
            onChange={(e) => updateField("interaction_notes", e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingId ? "Save changes" : "Add contact"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete contact?"
        description={`This removes ${deleteTarget?.contact_name ?? "this contact"} from your network. This can't be undone.`}
      />
    </div>
  );
}
