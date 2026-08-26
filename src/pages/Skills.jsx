import { useCallback, useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Plus,
  Target,
  BarChart3,
  CheckCircle2,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { careerPaths, careerPathGroups, getMissingSkills } from "../data/careerPaths";
import {
  Card,
  CardHeader,
  Button,
  IconButton,
  Modal,
  ConfirmDialog,
  TextField,
  SelectField,
} from "../components/ui";

const BAR_CONTEXTS = ["Internship", "Campus Activity", "Study Abroad"];
const PROFICIENCY_LEVELS = ["Advanced", "Intermediate", "Beginner"];
const PROFICIENCY_DOT = {
  Advanced: "bg-orange-600",
  Intermediate: "bg-amber-500",
  Beginner: "bg-gray-400",
};
const PROFICIENCY_WEIGHT = { Advanced: 1, Intermediate: 0.65, Beginner: 0.35 };

const ORANGE = "#E87722";

const PROFICIENCY_OPTIONS = [
  { level: "Beginner", description: "Just started learning" },
  { level: "Intermediate", description: "Can work independently" },
  { level: "Advanced", description: "Can teach others" },
];

const PROFICIENCY_DEFINITIONS = {
  Beginner: "I understand the basics and need guidance",
  Intermediate: "I can use this skill independently in real projects",
  Advanced: "I can handle complex problems and teach others",
};

const SKILL_CATEGORIES = {
  Python: "Technical",
  "Data Visualization": "Technical",
  "Project Management": "Professional",
  "Event Planning": "Professional",
  "Qualitative Research": "Research",
  "Public Speaking": "Communication",
  "French (B2)": "Language",
};

const CATEGORY_ORDER = ["Technical", "Professional", "Research", "Communication", "Language", "Other"];
const CATEGORY_FILTER_OPTIONS = [
  "All Categories",
  "Technical",
  "Professional",
  "Research",
  "Communication",
  "Language",
];
const LEVEL_FILTER_OPTIONS = ["All Levels", ...PROFICIENCY_LEVELS];

const SOURCE_INSIGHTS = {
  Internship: "Your strongest source",
  "Campus Activity": "Growing fast",
  "Study Abroad": "Unique advantage",
};

function categoryFor(skillName) {
  return SKILL_CATEGORIES[skillName] ?? "Other";
}

const BUILD_CONTEXTS = [
  "Internship",
  "Study Abroad",
  "Campus Activity",
  "Coursework",
  "Employment",
  "Research",
  "Other",
];

const OTHER_EXPERIENCE_VALUE = "__other__";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm() {
  return {
    skill_name: "",
    proficiency_level: "",
    context: "",
    experience_id: "",
    other_experience_description: "",
    resume_description: "",
    date_added: todayISO(),
  };
}

function validate(values) {
  const errors = {};
  if (!values.skill_name.trim()) errors.skill_name = "Skill name is required.";
  if (!values.proficiency_level) errors.proficiency_level = "Select a proficiency level.";
  if (!values.context) errors.context = "Select where you built this skill.";
  if (!values.experience_id) errors.experience_id = "Select the related experience.";
  if (!values.resume_description.trim()) errors.resume_description = "Add a one-line description.";
  return errors;
}

function computeSkillSourceBreakdown(skills) {
  const counts = BAR_CONTEXTS.map((c) => skills.filter((s) => s.context === c).length);
  const total = counts.reduce((sum, c) => sum + c, 0) || 1;
  const percents = counts.map((c) => Math.round((c / total) * 100));
  const diff = 100 - percents.reduce((sum, p) => sum + p, 0);
  percents[percents.length - 1] += diff;
  return BAR_CONTEXTS.map((label, i) => ({ label, count: counts[i], percent: percents[i] }));
}

function computeProfileStrength(skills) {
  if (skills.length === 0) return 0;
  const coreCategories = CATEGORY_ORDER.filter((c) => c !== "Other");
  const categoriesCovered = new Set(
    skills.map((s) => categoryFor(s.skill_name)).filter((c) => c !== "Other")
  ).size;
  const proficiencyScore =
    skills.reduce((sum, s) => sum + (PROFICIENCY_WEIGHT[s.proficiency_level] ?? 0), 0) /
    skills.length;
  const breadthScore = Math.min(1, skills.length / 10);
  const categoryScore = categoriesCovered / coreCategories.length;
  return Math.round((proficiencyScore * 0.4 + breadthScore * 0.3 + categoryScore * 0.3) * 100);
}

function StatPill({ label }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1 text-xs font-medium text-gray-600 dark:text-neutral-300">
      {label}
    </span>
  );
}

function SkillSourceBars({ data }) {
  return (
    <div className="w-full space-y-2.5">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-neutral-300">{d.label}</span>
            <span className="text-xs text-slate-500 dark:text-neutral-400">
              {d.count} skill{d.count !== 1 ? "s" : ""} · {d.percent}%
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full"
              style={{ width: `${d.percent}%`, backgroundColor: ORANGE }}
            />
          </div>
          {SOURCE_INSIGHTS[d.label] && (
            <p className="mt-1 text-[11px] text-slate-400 dark:text-neutral-500">{SOURCE_INSIGHTS[d.label]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillCard({ skill, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="group relative rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#232428] p-3 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 flex-shrink-0 rounded-full ${PROFICIENCY_DOT[skill.proficiency_level] ?? "bg-gray-400"}`}
              aria-hidden="true"
            />
            <p className="truncate text-base font-semibold text-slate-900 dark:text-[#F8F9FA]">{skill.skill_name}</p>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
            {skill.proficiency_level} · {skill.context}
          </p>
        </div>

        <div ref={menuRef} className="relative flex-shrink-0">
          <IconButton
            icon={MoreHorizontal}
            label={`More actions for ${skill.skill_name}`}
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          />
          {menuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#2B2C31] shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="block w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-white/10"
              >
                Edit skill
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="block w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                Delete skill
              </button>
            </div>
          )}
        </div>
      </div>

      <span className="mt-2 inline-flex items-center rounded-full bg-gray-100 dark:bg-white/10 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:text-neutral-300">
        {skill.context}
      </span>
    </div>
  );
}

export default function Skills() {
  const { skills, profile, experiences, setTargetCareerPath, addSkill, updateSkill, deleteSkill } =
    useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [levelFilter, setLevelFilter] = useState("All Levels");

  const closeModal = useCallback(() => setModalOpen(false), []);

  function handleAddToMySkills(name) {
    addSkill({
      skill_name: name,
      proficiency_level: "Beginner",
      context: "Coursework",
      resume_description: `Developing ${name} skills at Lewis & Clark`,
      date_added: todayISO(),
    });
  }

  const selectedPathId = profile.targetCareerPath ?? careerPaths[0].id;
  const selectedPath = careerPaths.find((p) => p.id === selectedPathId) ?? careerPaths[0];
  const missingSkills = getMissingSkills(
    selectedPathId,
    skills.map((s) => s.skill_name)
  );

  function openAddModal(prefillName = "") {
    setEditingId(null);
    setFormValues({ ...emptyForm(), skill_name: prefillName });
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(skill) {
    setEditingId(skill.id);
    setFormValues({
      skill_name: skill.skill_name,
      proficiency_level: skill.proficiency_level ?? "",
      context: skill.context ?? "",
      experience_id: skill.experience_id ?? "",
      other_experience_description: skill.other_experience_description ?? "",
      resume_description: skill.resume_description ?? "",
      date_added: skill.date_added ?? todayISO(),
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
      updateSkill(editingId, formValues);
    } else {
      addSkill(formValues);
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (deleteTarget) deleteSkill(deleteTarget.id);
    setDeleteTarget(null);
  }

  const skillSourceData = computeSkillSourceBreakdown(skills);
  const categoriesCovered = new Set(
    skills.map((s) => categoryFor(s.skill_name)).filter((c) => c !== "Other")
  ).size;
  const sourcesUsed = new Set(skills.map((s) => s.context)).size;
  const profileStrength = computeProfileStrength(skills);

  const filteredSkills = skills.filter((s) => {
    const matchesSearch = s.skill_name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesCategory =
      categoryFilter === "All Categories" || categoryFor(s.skill_name) === categoryFilter;
    const matchesLevel = levelFilter === "All Levels" || s.proficiency_level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F8F9FA]">Skills</h1>
          <p className="text-slate-500 dark:text-neutral-400 mt-1">
            Everything you can do, tagged by proficiency and where you built it.
          </p>
        </div>
        <Button onClick={() => openAddModal()}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add skill
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatPill label={`${skills.length} Skill${skills.length !== 1 ? "s" : ""}`} />
        <StatPill label={`${categoriesCovered} Categor${categoriesCovered !== 1 ? "ies" : "y"}`} />
        <StatPill label={`${sourcesUsed} Learning Source${sourcesUsed !== 1 ? "s" : ""}`} />
        <StatPill label={`Profile Strength: ${profileStrength}%`} />
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-all">
          <CardHeader
            title="Where Your Skills Come From"
            action={<BarChart3 className="h-5 w-5 text-slate-400" aria-hidden="true" />}
          />
          <div className="px-5 pb-3 pt-1.5">
            {skills.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-neutral-400 py-10">Add skills to see your distribution.</p>
            ) : (
              <SkillSourceBars data={skillSourceData} />
            )}
          </div>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader
            title="Recommended Skills to Develop"
            subtitle="What's missing for your target path"
            action={<Target className="h-5 w-5 text-brand-orange" aria-hidden="true" />}
          />
          <div className="px-5 pb-3 mt-1.5 space-y-3">
            <SelectField
              label="Target career path"
              value={selectedPathId}
              onChange={(e) => setTargetCareerPath(e.target.value)}
            >
              {careerPathGroups.map((group) => (
                <optgroup key={group} label={group}>
                  {careerPaths
                    .filter((p) => p.group === group)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                </optgroup>
              ))}
            </SelectField>

            {missingSkills.length === 0 ? (
              <p className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-300">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                You have every core skill for {selectedPath.label}.
              </p>
            ) : (
              <div>
                <p className="text-sm text-slate-500 dark:text-neutral-400 mb-2">Missing for {selectedPath.label}:</p>
                <div className="flex flex-col gap-2">
                  {missingSkills.map((name) => (
                    <div
                      key={name}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-orange-700 dark:text-orange-300">{name}</span>
                        <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                          Required for {selectedPath.label} roles
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddToMySkills(name)}
                        aria-label={`Add ${name} to my skills`}
                        className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-brand-orange px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                      >
                        <Plus className="h-3 w-3" aria-hidden="true" />
                        Add to My Skills
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {skills.length > 0 && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              aria-label="Search skills"
              className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#232428] py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-[#F8F9FA] placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#232428] px-3 py-2 text-sm text-slate-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {CATEGORY_FILTER_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            aria-label="Filter by proficiency level"
            className="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#232428] px-3 py-2 text-sm text-slate-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {LEVEL_FILTER_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-6">
        {skills.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="rounded-full bg-orange-50 dark:bg-orange-500/10 p-3">
              <Sparkles className="h-8 w-8 text-orange-600 dark:text-orange-300" aria-hidden="true" />
            </div>
            <p className="font-medium text-slate-700 dark:text-neutral-200">No skills logged yet</p>
            <p className="text-sm text-slate-500 dark:text-neutral-400 max-w-sm">
              Add skills you've built through internships, study abroad, or campus activities.
            </p>
            <Button onClick={() => openAddModal()} className="mt-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add skill
            </Button>
          </Card>
        ) : filteredSkills.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <p className="font-medium text-slate-700 dark:text-neutral-200">No skills match your search</p>
            <p className="text-sm text-slate-500 dark:text-neutral-400">Try a different search term or filter.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {filteredSkills.map((s) => (
              <SkillCard
                key={s.id}
                skill={s}
                onEdit={() => openEditModal(s)}
                onDelete={() => setDeleteTarget(s)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit skill" : "Add skill"}
      >
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <TextField
            label="Skill name"
            required
            autoFocus
            placeholder="e.g. Python, Public Speaking, Excel"
            value={formValues.skill_name}
            error={errors.skill_name}
            onChange={(e) => updateField("skill_name", e.target.value)}
            className="relative z-10"
          />

          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-neutral-300">
              Proficiency level <span className="text-red-500">*</span>
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {PROFICIENCY_OPTIONS.map((opt) => {
                const isSelected = formValues.proficiency_level === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => updateField("proficiency_level", opt.level)}
                    className={`rounded-xl border-2 px-3 py-3 text-left transition-all ${
                      isSelected
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 dark:border-orange-400"
                        : "border-slate-200 dark:border-white/15 bg-white dark:bg-white/5"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        isSelected ? "text-orange-800 dark:text-orange-300" : "text-slate-800 dark:text-neutral-200"
                      }`}
                    >
                      {opt.level}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">{opt.description}</p>
                  </button>
                );
              })}
            </div>
            {formValues.proficiency_level && (
              <p className="mt-2 text-xs text-slate-500 dark:text-neutral-400">
                {PROFICIENCY_DEFINITIONS[formValues.proficiency_level]}
              </p>
            )}
            {errors.proficiency_level && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.proficiency_level}</p>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-neutral-300">
              Where did you build this skill? <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {BUILD_CONTEXTS.map((c) => {
                const isSelected = formValues.context === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateField("context", c)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-orange-500 bg-brand-orange text-white"
                        : "border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-slate-700 dark:text-neutral-300"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            {errors.context && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.context}</p>}
          </div>

          <SelectField
            label="Which experience?"
            required
            value={formValues.experience_id}
            error={errors.experience_id}
            onChange={(e) => updateField("experience_id", e.target.value)}
          >
            <option value="">Select an experience</option>
            {experiences.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.organization_name}
              </option>
            ))}
            <option value={OTHER_EXPERIENCE_VALUE}>Other / Independent</option>
          </SelectField>

          {formValues.experience_id === OTHER_EXPERIENCE_VALUE && (
            <input
              type="text"
              placeholder="Describe where you built this skill"
              value={formValues.other_experience_description}
              onChange={(e) => updateField("other_experience_description", e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] px-3 py-2 text-sm text-slate-900 dark:text-[#F8F9FA] placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}

          <div>
            <TextField
              label="One line resume description"
              required
              placeholder="e.g. Managed cross-functional teams of 5+ people"
              value={formValues.resume_description}
              error={errors.resume_description}
              onChange={(e) => updateField("resume_description", e.target.value)}
            />
            <p className="mt-1.5 text-xs text-slate-400 dark:text-neutral-500">
              This will appear in your Resume Snapshot
            </p>
          </div>

          <div className="flex items-center justify-end gap-5 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="text-sm font-medium text-slate-500 dark:text-neutral-400 transition-colors hover:text-slate-700 dark:hover:text-neutral-200"
            >
              Cancel
            </button>
            <Button type="submit">{editingId ? "Save changes" : "Add Skill"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete skill?"
        description={`This removes "${deleteTarget?.skill_name ?? ""}" from your profile. This can't be undone.`}
      />
    </div>
  );
}
