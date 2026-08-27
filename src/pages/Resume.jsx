import { useState } from "react";
import {
  Pencil,
  X,
  Code2,
  BarChart2,
  Palette,
  Heart,
  Scale,
  GraduationCap,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { formatDate } from "../lib/utils";
import JobFitToolkit from "../components/JobFitToolkit";

function buildSnapshotText(experiences, skills) {
  const expLines = experiences.map(
    (exp) =>
      `${exp.organization_name} - ${exp.experience_type} | ${exp.location} | ${formatDate(
        exp.start_date
      )} – ${formatDate(exp.end_date)}`
  );
  const skillNames = skills.map((s) => s.skill_name).join(", ");
  return [...expLines, "", `Skills: ${skillNames}`].join("\n");
}

const RESUME_TEMPLATES = [
  {
    name: "STEM & Technology",
    icon: Code2,
    description: "Software, research, and engineering roles",
  },
  {
    name: "Business & Finance",
    icon: BarChart2,
    description: "Consulting, banking, and operations roles",
  },
  {
    name: "Humanities & Arts",
    icon: Palette,
    description: "Writing, design, and cultural sector roles",
  },
  {
    name: "Nonprofit & Government",
    icon: Heart,
    description: "Public service, policy, and advocacy roles",
  },
  {
    name: "Law & Policy",
    icon: Scale,
    description: "Pre-law, legal research, and public policy roles",
  },
  {
    name: "Education & Research",
    icon: GraduationCap,
    description: "Teaching, academia, and research roles",
  },
];

export default function Resume() {
  const { experiences, skills } = useData();
  const [copied, setCopied] = useState(false);
  const [snapshotExpanded, setSnapshotExpanded] = useState(true);

  function handleCopy() {
    navigator.clipboard.writeText(buildSnapshotText(experiences, skills));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const [quickEditMode, setQuickEditMode] = useState(false);
  const [expItems, setExpItems] = useState(() =>
    experiences.map(
      (exp) =>
        `${exp.organization_name} - ${exp.experience_type} | ${exp.location} | ${formatDate(
          exp.start_date
        )} – ${formatDate(exp.end_date)}`
    )
  );
  const [skillItems, setSkillItems] = useState(() => skills.map((s) => s.skill_name));

  function updateExpItem(index, value) {
    setExpItems((items) => items.map((item, i) => (i === index ? value : item)));
  }

  function removeExpItem(index) {
    setExpItems((items) => items.filter((_, i) => i !== index));
  }

  function addExpItem() {
    setExpItems((items) => [...items, ""]);
  }

  function updateSkillItem(index, value) {
    setSkillItems((items) => items.map((item, i) => (i === index ? value : item)));
  }

  function removeSkillItem(index) {
    setSkillItems((items) => items.filter((_, i) => i !== index));
  }

  function addSkillItem() {
    setSkillItems((items) => [...items, ""]);
  }

  function handleDownloadTemplate() {
    alert("Template coming soon. Check back after launch!");
  }

  return (
    <div className="-mx-4 -my-6 min-h-screen bg-[#F8F9FB] dark:bg-[#1A1919] px-4 py-6 md:-mx-8 md:-my-8 md:px-8 md:py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F8F9FA]">Resume</h1>
      <p className="text-slate-500 dark:text-neutral-400 mt-1">Build and optimize your resume</p>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border-l-2 border-l-brand-orange bg-white dark:bg-[#232428] p-6 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#B85A12] dark:text-orange-300">
                Experience Snapshot
              </p>
              <button
                type="button"
                onClick={() => setQuickEditMode((v) => !v)}
                className="inline-flex flex-shrink-0 items-center gap-1 text-xs font-semibold text-[#EA580C] dark:text-orange-300 hover:opacity-80"
              >
                {quickEditMode ? (
                  "Done"
                ) : (
                  <>
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Quick Edit
                  </>
                )}
              </button>
            </div>
            <h2 className="mt-2 text-lg font-bold text-[#111827] dark:text-[#F8F9FA]">
              Your experiences, ready to copy
            </h2>
            <p className="mt-1 text-sm text-[#6B7280] dark:text-neutral-400">
              Use this as a starting point for your resume
            </p>
          </div>

          <div className="flex-1 rounded-2xl bg-white dark:bg-[#232428] p-6 shadow-sm">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSnapshotExpanded((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200"
              >
                {snapshotExpanded ? "Hide ▲" : "Show ▼"}
              </button>
            </div>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                snapshotExpanded ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                {quickEditMode ? (
                  <>
                    <ul className="space-y-2 text-sm text-[#111827] dark:text-[#F8F9FA]">
                      {expItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="flex-shrink-0 text-brand-orange">•</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateExpItem(i, e.target.value)}
                            className="w-full rounded-md border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] px-2 py-1 text-sm text-[#111827] dark:text-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                          />
                          <button
                            type="button"
                            onClick={() => removeExpItem(i)}
                            aria-label="Remove experience"
                            className="flex-shrink-0 text-slate-400 dark:text-neutral-500 hover:text-[#EA580C] dark:hover:text-orange-300"
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={addExpItem}
                      className="mt-2 text-xs font-semibold text-[#EA580C] dark:text-orange-300 hover:opacity-80"
                    >
                      + Add Experience
                    </button>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {skillItems.map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/10 px-2 py-0.5"
                        >
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateSkillItem(i, e.target.value)}
                            style={{ width: `${Math.max(item.length, 2) + 1}ch` }}
                            className="bg-transparent text-xs text-[#6B7280] dark:text-neutral-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeSkillItem(i)}
                            aria-label="Remove skill"
                            className="text-slate-400 dark:text-neutral-500 hover:text-[#EA580C] dark:hover:text-orange-300"
                          >
                            <X className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addSkillItem}
                      className="mt-2 text-xs font-semibold text-[#EA580C] dark:text-orange-300 hover:opacity-80"
                    >
                      + Add Skill
                    </button>
                  </>
                ) : (
                  <>
                    <ul className="space-y-4 text-sm text-[#111827] dark:text-[#F8F9FA]">
                      {expItems.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="flex-shrink-0 text-brand-orange">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {skillItems.map((item, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-xs text-[#6B7280] dark:text-neutral-400"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {copied ? "Copied!" : "Copy Snapshot"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <JobFitToolkit experiences={experiences} skills={skills} />
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#B85A12] dark:text-orange-300">
          Industry Templates
        </p>
        <h2 className="mt-2 text-lg font-bold text-[#111827] dark:text-[#F8F9FA]">
          Resume templates by career path
        </h2>
        <p className="mt-1 text-sm text-[#6B7280] dark:text-neutral-400">
          Download a starter template for your target industry
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RESUME_TEMPLATES.map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={template.name}
                className="flex flex-col rounded-2xl bg-white dark:bg-[#232428] p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF3E8] dark:bg-orange-500/10">
                  <Icon className="h-5 w-5 text-[#EA580C] dark:text-orange-300" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#111827] dark:text-[#F8F9FA]">{template.name}</h3>
                <p className="mt-1 flex-1 text-sm text-[#6B7280] dark:text-neutral-400">{template.description}</p>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="mt-5 rounded-lg border border-[#EA580C] dark:border-orange-500/30 px-4 py-2.5 text-sm font-semibold text-[#B85A12] dark:text-orange-300 transition-colors hover:bg-[#FFF3E8] dark:hover:bg-orange-500/10"
                >
                  Download Template
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
