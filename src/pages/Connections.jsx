import { useCallback, useState } from "react";
import { Users, Plus, Pencil, Camera, Coffee, Search, X } from "lucide-react";
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
  RemovablePill,
} from "../components/ui";

const CONNECTION_SOURCES = [
  "Career Center Event",
  "LC Alumni Network",
  "LinkedIn",
  "Class/Club",
  "Family/Friend",
  "Other",
];

const DEFAULT_CONTACT_PHOTOS = {
  "Maya Okonkwo": "/Maya.jpg",
  "Daniel Ferreira": "/Daniel.jpg",
  "James Lim": "/James.jpg",
  "Sarah Whitmore": "/Sarah-Whitmore.png",
};

const DEFAULT_LINKEDIN_URLS = {
  "Maya Okonkwo": "https://linkedin.com/search/results/people/?keywords=maya-okonkwo",
  "Daniel Ferreira": "https://linkedin.com/search/results/people/?keywords=daniel-ferreira",
  "Sarah Whitmore": "https://linkedin.com/search/results/people/?keywords=sarah-whitmore",
  "James Lim": "https://linkedin.com/search/results/people/?keywords=james-lim",
};

const EMPLOYER_INDUSTRIES = {
  "Adidas North America": "Apparel & Footwear",
  "Nike, Inc.": "Apparel & Footwear",
  "Portland General Electric": "Energy & Utilities",
  "Intel Corporation": "Technology",
};

function industryFor(employer) {
  return EMPLOYER_INDUSTRIES[employer] ?? employer;
}

// Relationship type: what this person is to the student. "Mentor" isn't a
// standalone type here - a mentor relationship is captured through the
// functional tags below (e.g. Career advice, Industry introductions).
const RELATIONSHIP_TYPES = [
  "Faculty",
  "Alumni",
  "Staff / Career Services",
  "Industry Professional",
  "Peer / Student",
  "Community Partner",
];

const STATUS_OPTIONS = ["Overdue", "Follow Up Soon", "Active"];

// Actionable "who can I turn to for..." functional tags. `question` is the
// phrasing used on the quick-filter pills; `label` is the shorter phrasing
// used on tag chips and the add-tag picker.
const FUNCTIONAL_TAGS = [
  {
    key: "recommendation-letters",
    emoji: "📝",
    label: "Recommendation letters",
    question: "Who can I turn to for recommendation letters?",
  },
  {
    key: "industry-intros",
    emoji: "🚪",
    label: "Industry introductions",
    question: "Who can I turn to for industry introductions?",
  },
  {
    key: "career-advice",
    emoji: "💡",
    label: "Career advice",
    question: "Who can I turn to for career advice?",
  },
  {
    key: "grad-school-insights",
    emoji: "🎓",
    label: "Grad school insights",
    question: "Who can I turn to for grad school insights?",
  },
];

function buildCoffeeChatMessage(contact) {
  return `Hi ${contact.contact_name}, I'd love to connect for a quick coffee chat to learn more about your experience at ${contact.employer_company}. Would you be available for 15-20 minutes?`;
}

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

function ConnectionsInsights({ contacts }) {
  const total = contacts.length;
  const overdueCount = contacts.filter((c) => daysSince(c.last_contacted_date) > 30).length;
  const industryCount = new Set(contacts.map((c) => industryFor(c.employer_company))).size;

  return (
    <div className="mt-4 inline-flex flex-wrap items-center gap-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-800 dark:text-orange-300">
      <span>
        {total} connection{total !== 1 ? "s" : ""}
      </span>
      <span className="text-orange-300 dark:text-orange-500/60" aria-hidden="true">
        ·
      </span>
      <span>{overdueCount} overdue</span>
      <span className="text-orange-300 dark:text-orange-500/60" aria-hidden="true">
        ·
      </span>
      <span>
        {industryCount} industr{industryCount !== 1 ? "ies" : "y"} represented
      </span>
    </div>
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
  if (days > 30) return { tone: "red", label: "Overdue" };
  if (days > 14) return { tone: "amber", label: "Follow Up Soon" };
  return { tone: "success", label: "Active" };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm() {
  return {
    contact_name: "",
    employer_company: "",
    job_title: "",
    linkedin_url: "",
    last_contacted_date: todayISO(),
    connection_source: CONNECTION_SOURCES[0],
    interaction_notes: "",
    relationship_purpose: "",
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

function loadStoredListMap(prefix, contacts) {
  const map = {};
  contacts.forEach((c) => {
    const stored = localStorage.getItem(`${prefix}${c.contact_name}`);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) map[c.contact_name] = parsed;
    } catch {
      // ignore malformed entries from an older format
    }
  });
  return map;
}

export default function Connections() {
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
  const [relationshipType, setRelationshipType] = useState(() =>
    loadStoredMap("relationship_", networkConnections)
  );
  const [functionalTags, setFunctionalTags] = useState(() =>
    loadStoredListMap("functional_tags_", networkConnections)
  );
  const [customTags, setCustomTags] = useState(() =>
    loadStoredListMap("custom_tags_", networkConnections)
  );
  const [tagMenuOpenId, setTagMenuOpenId] = useState(null);
  const [customTagDraft, setCustomTagDraft] = useState("");
  const [coffeeChatOpenId, setCoffeeChatOpenId] = useState(null);
  const [coffeeChatMessage, setCoffeeChatMessage] = useState("");
  const [coffeeChatSentId, setCoffeeChatSentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [functionalFilter, setFunctionalFilter] = useState("");

  const closeModal = useCallback(() => setModalOpen(false), []);

  function openCoffeeChatForm(contact) {
    setCoffeeChatOpenId(contact.id);
    setCoffeeChatMessage(buildCoffeeChatMessage(contact));
    setCoffeeChatSentId((id) => (id === contact.id ? null : id));
  }

  function closeCoffeeChatForm() {
    setCoffeeChatOpenId(null);
    setCoffeeChatMessage("");
  }

  function handleSendCoffeeChat(contactId) {
    setCoffeeChatSentId(contactId);
  }

  function updateRelationshipType(contact, value) {
    if (value) {
      localStorage.setItem(`relationship_${contact.contact_name}`, value);
    } else {
      localStorage.removeItem(`relationship_${contact.contact_name}`);
    }
    setRelationshipType((prev) => ({ ...prev, [contact.contact_name]: value }));
  }

  function toggleFunctionalTag(contact, tagKey) {
    setFunctionalTags((prev) => {
      const current = prev[contact.contact_name] ?? [];
      const next = current.includes(tagKey)
        ? current.filter((k) => k !== tagKey)
        : [...current, tagKey];
      localStorage.setItem(`functional_tags_${contact.contact_name}`, JSON.stringify(next));
      return { ...prev, [contact.contact_name]: next };
    });
  }

  function addCustomTag(contact, rawText) {
    const trimmed = rawText.trim();
    if (!trimmed) return;
    const tag = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    setCustomTags((prev) => {
      const current = prev[contact.contact_name] ?? [];
      if (current.some((t) => t.toLowerCase() === tag.toLowerCase())) return prev;
      const next = [...current, tag];
      localStorage.setItem(`custom_tags_${contact.contact_name}`, JSON.stringify(next));
      return { ...prev, [contact.contact_name]: next };
    });
    setCustomTagDraft("");
  }

  function removeCustomTag(contact, tag) {
    setCustomTags((prev) => {
      const next = (prev[contact.contact_name] ?? []).filter((t) => t !== tag);
      localStorage.setItem(`custom_tags_${contact.contact_name}`, JSON.stringify(next));
      return { ...prev, [contact.contact_name]: next };
    });
  }

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
      linkedin_url: linkedinUrls[c.contact_name] || DEFAULT_LINKEDIN_URLS[c.contact_name] || "",
      last_contacted_date: c.last_contacted_date,
      connection_source: c.connection_source,
      interaction_notes: c.interaction_notes ?? "",
      relationship_purpose: relationshipType[c.contact_name] ?? "",
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

    const { linkedin_url, relationship_purpose, ...contactFields } = formValues;
    if (editingId) {
      updateContact(editingId, contactFields);
    } else {
      addContact(contactFields);
    }

    const trimmedLinkedin = linkedin_url.trim();
    const key = formValues.contact_name.trim();
    if (trimmedLinkedin && key) {
      localStorage.setItem(`linkedin_${key}`, trimmedLinkedin);
      setLinkedinUrls((u) => ({ ...u, [key]: trimmedLinkedin }));
    }

    if (key) {
      updateRelationshipType({ contact_name: key }, relationship_purpose.trim());
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

  const filtered = sorted.filter((c) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      c.contact_name.toLowerCase().includes(query) ||
      c.employer_company.toLowerCase().includes(query) ||
      c.job_title.toLowerCase().includes(query);
    const matchesRelationship =
      !relationshipFilter || relationshipType[c.contact_name] === relationshipFilter;
    const matchesStatus =
      !statusFilter || urgency(daysSince(c.last_contacted_date)).label === statusFilter;
    const matchesFunctional =
      !functionalFilter || (functionalTags[c.contact_name] ?? []).includes(functionalFilter);
    return matchesQuery && matchesRelationship && matchesStatus && matchesFunctional;
  });

  return (
    <div className="px-4 sm:px-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F8F9FA]">Connections</h1>
          <p className="text-slate-500 dark:text-neutral-400 mt-1">
            Alumni, recruiters, and Career Center contacts, with reminders so nobody goes cold.
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add contact
        </Button>
      </div>

      {sorted.length > 0 && <ConnectionsInsights contacts={sorted} />}

      {sorted.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
            Who can I turn to for...
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {FUNCTIONAL_TAGS.map((tag) => {
              const active = functionalFilter === tag.key;
              return (
                <button
                  key={tag.key}
                  type="button"
                  onClick={() => setFunctionalFilter((prev) => (prev === tag.key ? "" : tag.key))}
                  aria-pressed={active}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-brand-orange text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/15"
                  }`}
                >
                  {tag.emoji} {tag.question}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              aria-label="Search contacts"
              className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#232428] py-2 pl-9 pr-3 text-sm text-slate-700 dark:text-neutral-200 placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={relationshipFilter}
            onChange={(e) => setRelationshipFilter(e.target.value)}
            aria-label="Filter by relationship type"
            className="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#232428] px-3 py-2 text-sm text-slate-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All relationship types</option>
            {RELATIONSHIP_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#232428] px-3 py-2 text-sm text-slate-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {sorted.length === 0 ? (
        <Card className="mt-6 flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="rounded-full bg-orange-50 dark:bg-orange-500/10 p-3">
            <Users className="h-8 w-8 text-orange-600 dark:text-orange-300" aria-hidden="true" />
          </div>
          <p className="font-medium text-slate-700 dark:text-neutral-200">No contacts saved yet</p>
          <p className="text-sm text-slate-500 dark:text-neutral-400 max-w-sm">
            Save the people you meet at Career Center events, alumni panels, or on LinkedIn so
            you know exactly when to follow up.
          </p>
          <Button onClick={openAddModal} className="mt-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add contact
          </Button>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="mt-6 flex flex-col items-center justify-center gap-2 py-12 text-center">
          <p className="font-medium text-slate-700 dark:text-neutral-200">No contacts match your search</p>
          <p className="text-sm text-slate-500 dark:text-neutral-400 max-w-sm">
            Try a different search term or clear the filters.
          </p>
        </Card>
      ) : (
        <div className="mt-6 grid mx-auto max-w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const days = daysSince(c.last_contacted_date);
            const status = urgency(days);
            const contactLinkedin = linkedinUrls[c.contact_name] || DEFAULT_LINKEDIN_URLS[c.contact_name];
            const contactRelationship = relationshipType[c.contact_name];
            const contactFunctionalTags = functionalTags[c.contact_name] ?? [];
            const contactCustomTags = customTags[c.contact_name] ?? [];
            const tagMenuOpen = tagMenuOpenId === c.id;
            return (
              <Card key={c.id} className="p-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-1 items-start gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      {uploadedPhotos[c.contact_name] || DEFAULT_CONTACT_PHOTOS[c.contact_name] ? (
                        <img
                          src={uploadedPhotos[c.contact_name] || DEFAULT_CONTACT_PHOTOS[c.contact_name]}
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
                        className="absolute -bottom-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#232428] text-slate-600 dark:text-neutral-300 shadow-sm hover:bg-slate-50 dark:hover:bg-white/10"
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
                      <h3 className="font-semibold text-slate-900 dark:text-[#F8F9FA] truncate">{c.contact_name}</h3>
                      <p className="text-sm text-slate-500 dark:text-neutral-400 truncate">
                        {c.job_title} · {c.employer_company}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 flex-shrink-0">
                    <IconButton
                      icon={LinkedinIcon}
                      label={
                        contactLinkedin
                          ? `View ${c.contact_name} on LinkedIn`
                          : `Add LinkedIn URL for ${c.contact_name}`
                      }
                      style={{ color: contactLinkedin ? "#0077B5" : "#cbd5e1" }}
                      className="p-2! sm:p-3!"
                      onClick={() => {
                        if (contactLinkedin) {
                          window.open(contactLinkedin, "_blank", "noopener,noreferrer");
                        } else {
                          openLinkedinEditor(c);
                        }
                      }}
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
                      className="flex-1 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] px-2 py-1.5 text-sm text-slate-900 dark:text-[#F8F9FA] placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  {contactRelationship && (
                    <RemovablePill
                      label={contactRelationship}
                      onRemove={() => updateRelationshipType(c, "")}
                    />
                  )}
                  {contactFunctionalTags.map((key) => {
                    const tag = FUNCTIONAL_TAGS.find((t) => t.key === key);
                    if (!tag) return null;
                    return (
                      <RemovablePill
                        key={key}
                        label={`${tag.emoji} ${tag.label}`}
                        onRemove={() => toggleFunctionalTag(c, key)}
                      />
                    );
                  })}
                  {contactCustomTags.map((tag) => (
                    <RemovablePill key={tag} label={tag} onRemove={() => removeCustomTag(c, tag)} />
                  ))}
                </div>

                <div className="mt-2">
                  {tagMenuOpen ? (
                    <div className="space-y-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {FUNCTIONAL_TAGS.map((tag) => {
                          const active = contactFunctionalTags.includes(tag.key);
                          return (
                            <button
                              key={tag.key}
                              type="button"
                              onClick={() => toggleFunctionalTag(c, tag.key)}
                              aria-pressed={active}
                              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                                active
                                  ? "bg-brand-orange text-white"
                                  : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 dark:bg-[#232428] dark:text-neutral-300 dark:ring-white/10 dark:hover:bg-white/10"
                              }`}
                            >
                              {tag.emoji} {tag.label}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          autoFocus
                          value={customTagDraft}
                          onChange={(e) => setCustomTagDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomTag(c, customTagDraft);
                            }
                          }}
                          placeholder="#CustomTag"
                          aria-label={`Add a custom tag for ${c.contact_name}`}
                          className="flex-1 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#232428] px-2 py-1 text-xs text-slate-900 dark:text-[#F8F9FA] placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => addCustomTag(c, customTagDraft)}
                          className="flex-shrink-0 text-xs font-semibold text-brand-orange hover:text-orange-700 dark:hover:text-orange-300"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setTagMenuOpenId(null)}
                          aria-label="Done adding tags"
                          className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTagMenuOpenId(c.id);
                        setCustomTagDraft("");
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand-orange hover:text-orange-700 dark:hover:text-orange-300"
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                      Add Tag
                    </button>
                  )}
                </div>

                {c.interaction_notes && (
                  <p className="mt-3 text-sm text-slate-600 dark:text-neutral-300 line-clamp-2">{c.interaction_notes}</p>
                )}
                <p className="mt-2 text-xs text-slate-400 dark:text-neutral-500">
                  Last contacted {formatDate(c.last_contacted_date)}
                </p>

                <div className="mt-3 space-y-2 border-t border-slate-100 dark:border-white/10 pt-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        coffeeChatOpenId === c.id ? closeCoffeeChatForm() : openCoffeeChatForm(c)
                      }
                      className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-90"
                      style={{
                        background: "#EA580C",
                        color: "#ffffff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      <Coffee className="h-3.5 w-3.5" aria-hidden="true" />
                      Request Coffee Chat
                    </button>
                    <IconButton
                      icon={Pencil}
                      label={`Edit ${c.contact_name}`}
                      className="p-2!"
                      onClick={() => openEditModal(c)}
                    />
                  </div>

                  {coffeeChatOpenId === c.id && (
                    <div className="space-y-2">
                      {coffeeChatSentId === c.id ? (
                        <p className="rounded-lg bg-orange-50 dark:bg-orange-500/10 px-3 py-2 text-xs font-medium text-orange-700 dark:text-orange-300">
                          Request sent!
                        </p>
                      ) : (
                        <>
                          <textarea
                            rows={3}
                            value={coffeeChatMessage}
                            onChange={(e) => setCoffeeChatMessage(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] px-2 py-1.5 text-xs text-slate-700 dark:text-neutral-200 placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              className="px-3 py-1.5 text-xs"
                              onClick={() => handleSendCoffeeChat(c.id)}
                            >
                              Send Request
                            </Button>
                            <button
                              type="button"
                              onClick={closeCoffeeChatForm}
                              className="text-xs font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
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
          <TextField
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/username"
            value={formValues.linkedin_url}
            onChange={(e) => updateField("linkedin_url", e.target.value)}
          />
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
          <SelectField
            label="Relationship type"
            value={formValues.relationship_purpose}
            onChange={(e) => updateField("relationship_purpose", e.target.value)}
          >
            <option value="">Select relationship type</option>
            {RELATIONSHIP_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </SelectField>
          <TextArea
            label="Notes"
            placeholder="What did you talk about? Any follow-up you promised?"
            value={formValues.interaction_notes}
            onChange={(e) => updateField("interaction_notes", e.target.value)}
          />
          <div className="flex items-center justify-between pt-2">
            {editingId ? (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  const target = networkConnections.find((c) => c.id === editingId);
                  setModalOpen(false);
                  setDeleteTarget(target);
                }}
              >
                Delete Contact
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingId ? "Save changes" : "Add contact"}</Button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete contact?"
        description={`This removes ${deleteTarget?.contact_name ?? "this contact"} from your connections. This can't be undone.`}
      />
    </div>
  );
}
