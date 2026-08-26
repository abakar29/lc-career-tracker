import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Copy, Pencil, Trash2, ArrowRight } from "lucide-react";
import { Badge, Button, TextArea } from "./ui";
import { formatDate } from "../lib/utils";

const STATUS_LABELS = { Active: "Current", "In Progress": "In Progress", Completed: "Completed" };

export default function TimelineDrawer({
  entry,
  onClose,
  matchedSkills = [],
  description = "",
  onDescriptionChange,
  achievements = "",
  onAchievementsChange,
  onCopyBullet,
  copied,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!entry) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [entry, onClose]);

  if (!entry) return null;

  const isExperience = entry.kind === "EXPERIENCE";
  const exp = isExperience ? entry.raw : null;
  const skill = !isExperience ? entry.raw : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={entry.title}
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-[drawer-in_0.2s_ease-out] dark:border-white/10 dark:bg-[#232428]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5 dark:border-white/10">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
              {entry.typeLabel}
            </span>
            <h2 className="mt-2 truncate text-lg font-bold text-slate-900 dark:text-[#F8F9FA]">
              {entry.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex-shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-5 px-6 py-5">
          {isExperience ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="slate">{STATUS_LABELS[exp.current_status] ?? exp.current_status}</Badge>
                {exp.location && <Badge tone="slate">{exp.location}</Badge>}
              </div>
              <p className="text-sm text-slate-500 dark:text-neutral-400">
                {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
              </p>

              <TextArea
                label="Role Description"
                placeholder="What did you do here? e.g. Conducted market research for new product lines"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
              />
              <TextArea
                label="Key Achievements"
                placeholder="e.g. Presented findings to team of 10, analysed 500+ customer responses"
                value={achievements}
                onChange={(e) => onAchievementsChange(e.target.value)}
              />

              <div>
                <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-neutral-300">
                  Skills Developed
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.length > 0 ? (
                    matchedSkills.map((s) => (
                      <Badge key={s.id} tone="orange">
                        {s.skill_name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-neutral-500">No matching skills yet</p>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-neutral-300">
                  Resume Bullet
                </p>
                <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                  <p className="flex-1 text-sm text-slate-700 dark:text-neutral-300">
                    • {exp.organization_name}:{" "}
                    {description || "Add a role description to generate a bullet"}
                  </p>
                  <button
                    type="button"
                    onClick={onCopyBullet}
                    className="flex flex-shrink-0 items-center gap-1 text-xs font-semibold text-[#B85A12] hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-200"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 dark:text-neutral-500">{entry.sector}</p>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="orange">{skill.proficiency_level}</Badge>
                <Badge tone="slate">{skill.context}</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-neutral-400">
                Added {formatDate(skill.date_added)}
              </p>

              {skill.resume_description && (
                <div>
                  <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-neutral-300">
                    Resume description
                  </p>
                  <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                    {skill.resume_description}
                  </p>
                </div>
              )}

              <p className="text-xs text-slate-400 dark:text-neutral-500">{entry.sector}</p>

              <button
                type="button"
                onClick={() => navigate("/skills")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-orange hover:text-orange-700 dark:hover:text-orange-300"
              >
                Manage on Skills page
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {isExperience && (
          <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4 dark:border-white/10">
            <Button variant="secondary" onClick={onEdit}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit details
            </Button>
            <Button variant="danger" onClick={onDelete}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
