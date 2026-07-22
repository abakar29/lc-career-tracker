import { useState } from "react";
import { Sparkles, Plus, Pencil, Trash2, Target, BarChart3, CheckCircle2 } from "lucide-react";
import { useData } from "../context/DataContext";
import { careerPaths, getMissingSkills } from "../data/careerPaths";
import {
  Card,
  CardHeader,
  Badge,
  Button,
  IconButton,
  Modal,
  ConfirmDialog,
  TextField,
  SelectField,
  DateField,
} from "../components/ui";

const CONTEXTS = ["Internship", "Study Abroad", "Campus Activity"];
const PROFICIENCY_LEVELS = ["Advanced", "Intermediate", "Beginner"];
const PROFICIENCY_TONE = { Advanced: "green", Intermediate: "amber", Beginner: "slate" };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm() {
  return {
    skill_name: "",
    proficiency_level: "Beginner",
    context: CONTEXTS[0],
    date_added: todayISO(),
  };
}

function validate(values) {
  const errors = {};
  if (!values.skill_name.trim()) errors.skill_name = "Skill name is required.";
  if (!values.date_added) errors.date_added = "Date added is required.";
  return errors;
}

function RadarChart({ data, size = 220 }) {
  const center = size / 2;
  const radius = size / 2 - 42;
  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const angleStep = (2 * Math.PI) / data.length;

  function pointFor(i, value) {
    const angle = -Math.PI / 2 + i * angleStep;
    const r = (value / maxValue) * radius;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  }

  const ringLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = data.map((d, i) => pointFor(i, d.value));
  const polygonPoints = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");
  const summary = data.map((d) => `${d.label}: ${d.value}`).join(", ");

  return (
    <svg width={size} height={size} role="img" aria-label={`Skill distribution by context: ${summary}`}>
      {ringLevels.map((level) => {
        const ringPoints = data
          .map((_, i) => pointFor(i, maxValue * level).join(","))
          .join(" ");
        return <polygon key={level} points={ringPoints} fill="none" stroke="#e2e8f0" strokeWidth="1" />;
      })}
      {data.map((_, i) => {
        const [x, y] = pointFor(i, maxValue);
        return <line key={data[i].label} x1={center} y1={center} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      <polygon points={polygonPoints} fill="rgba(234,88,12,0.25)" stroke="#ea580c" strokeWidth="2" />
      {dataPoints.map(([x, y], i) => (
        <circle key={data[i].label} cx={x} cy={y} r="3.5" fill="#ea580c" />
      ))}
      {data.map((d, i) => {
        const [lx, ly] = pointFor(i, maxValue * 1.32);
        return (
          <text
            key={d.label}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            className="fill-slate-500"
          >
            {d.label} ({d.value})
          </text>
        );
      })}
    </svg>
  );
}

function SkillChip({ skill, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white pl-3.5 pr-1.5 py-1.5 text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <span className="font-medium text-slate-800">{skill.skill_name}</span>
      <span className="text-xs text-slate-400">· {skill.context}</span>
      <div className="flex items-center gap-0.5 ml-1">
        <IconButton icon={Pencil} label={`Edit ${skill.skill_name}`} onClick={onEdit} className="p-1.5" />
        <IconButton
          icon={Trash2}
          label={`Delete ${skill.skill_name}`}
          variant="danger"
          onClick={onDelete}
          className="p-1.5"
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const { skills, profile, setTargetCareerPath, addSkill, updateSkill, deleteSkill } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

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
      proficiency_level: skill.proficiency_level,
      context: skill.context,
      date_added: skill.date_added,
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

  const radarData = CONTEXTS.map((c) => ({
    label: c,
    value: skills.filter((s) => s.context === c).length,
  }));

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Skills</h1>
          <p className="text-slate-500 mt-1">
            Everything you can do, tagged by proficiency and where you built it.
          </p>
        </div>
        <Button onClick={() => openAddModal()}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add skill
        </Button>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-all">
          <CardHeader
            title="Skill Distribution"
            subtitle="Where your skills come from"
            action={<BarChart3 className="h-5 w-5 text-slate-400" aria-hidden="true" />}
          />
          <div className="px-5 pb-6 pt-2 flex justify-center">
            {skills.length === 0 ? (
              <p className="text-sm text-slate-500 py-10">Add skills to see your distribution.</p>
            ) : (
              <RadarChart data={radarData} />
            )}
          </div>
        </Card>

        <Card className="hover:shadow-md transition-all">
          <CardHeader
            title="Skill Gap Detection"
            subtitle="What's missing for your target path"
            action={<Target className="h-5 w-5 text-orange-600" aria-hidden="true" />}
          />
          <div className="px-5 pb-5 mt-2 space-y-4">
            <SelectField
              label="Target career path"
              value={selectedPathId}
              onChange={(e) => setTargetCareerPath(e.target.value)}
            >
              {careerPaths.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </SelectField>

            {missingSkills.length === 0 ? (
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                You have every core skill for {selectedPath.label}.
              </p>
            ) : (
              <div>
                <p className="text-sm text-slate-500 mb-2">Missing for {selectedPath.label}:</p>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => openAddModal(name)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-all hover:bg-red-100 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        {skills.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="rounded-full bg-orange-50 p-3">
              <Sparkles className="h-8 w-8 text-orange-600" aria-hidden="true" />
            </div>
            <p className="font-medium text-slate-700">No skills logged yet</p>
            <p className="text-sm text-slate-500 max-w-sm">
              Add skills you've built through internships, study abroad, or campus activities.
            </p>
            <Button onClick={() => openAddModal()} className="mt-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add skill
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {PROFICIENCY_LEVELS.map((level) => {
              const group = skills.filter((s) => s.proficiency_level === level);
              if (group.length === 0) return null;
              return (
                <div key={level}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Badge tone={PROFICIENCY_TONE[level]}>{level}</Badge>
                    <span className="text-xs text-slate-400">
                      {group.length} skill{group.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.map((s) => (
                      <SkillChip
                        key={s.id}
                        skill={s}
                        onEdit={() => openEditModal(s)}
                        onDelete={() => setDeleteTarget(s)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit skill" : "Add skill"}
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextField
            label="Skill name"
            required
            placeholder="e.g. Data Analysis"
            value={formValues.skill_name}
            error={errors.skill_name}
            onChange={(e) => updateField("skill_name", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Proficiency"
              required
              value={formValues.proficiency_level}
              onChange={(e) => updateField("proficiency_level", e.target.value)}
            >
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Built through"
              required
              value={formValues.context}
              onChange={(e) => updateField("context", e.target.value)}
            >
              {CONTEXTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectField>
          </div>
          <DateField
            label="Date added"
            required
            value={formValues.date_added}
            error={errors.date_added}
            onChange={(e) => updateField("date_added", e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingId ? "Save changes" : "Add skill"}</Button>
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
