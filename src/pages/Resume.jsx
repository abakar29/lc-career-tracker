import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  Copy,
  Loader2,
  Code2,
  BarChart2,
  Palette,
  Heart,
  Scale,
  GraduationCap,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { formatDate } from "../lib/utils";
import { Badge } from "../components/ui";

const SKILL_CATEGORY_ORDER = ["Technical", "Soft Skills", "Tools"];

const TOOL_KEYWORDS = [
  "excel",
  "figma",
  "tableau",
  "powerpoint",
  "photoshop",
  "salesforce",
  "jira",
  "sql",
  "canva",
  "google analytics",
  "slack",
  "notion",
];

const TECHNICAL_KEYWORDS = [
  "python",
  "javascript",
  "java",
  "data",
  "statistics",
  "research",
  "programming",
  "code",
  "coding",
  "engineering",
  "debug",
  "testing",
  "algorithm",
  "network",
  "security",
  "lab",
  "visualization",
  "analysis",
];

function categorizeSkill(name) {
  const lower = name.toLowerCase();
  if (TOOL_KEYWORDS.some((k) => lower.includes(k))) return "Tools";
  if (TECHNICAL_KEYWORDS.some((k) => lower.includes(k))) return "Technical";
  return "Soft Skills";
}

function defaultExpText(exp) {
  return `${exp.organization_name} - ${exp.experience_type} | ${exp.location} | ${formatDate(
    exp.start_date
  )} – ${formatDate(exp.end_date)}`;
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

const MISSING_KEYWORDS = ["financial modeling", "Python", "data analysis", "Excel"];
const STRONG_MATCHES = ["project management", "research", "communication"];
const IMPROVEMENTS = [
  "Work \"financial modeling\" and \"data analysis\" into your experience bullets.",
  "Quantify results with specific metrics and outcomes where possible.",
  "Call out any exposure to Excel or Python, even from coursework.",
];

function buildAtsReportText() {
  return `Job Match Score: 73%

MISSING KEYWORDS
${MISSING_KEYWORDS.join(", ")}

STRONG MATCHES
${STRONG_MATCHES.join(", ")}

WHAT TO IMPROVE
${IMPROVEMENTS.map((item) => `- ${item}`).join("\n")}`;
}

export default function Resume() {
  const { experiences, skills } = useData();

  const [copied, setCopied] = useState(false);
  const [snapshotExpanded, setSnapshotExpanded] = useState(true);
  const [atsExpanded, setAtsExpanded] = useState(true);

  const [excludedExpIds, setExcludedExpIds] = useState(() => new Set());
  const [excludedSkillIds, setExcludedSkillIds] = useState(() => new Set());

  function toggleExp(id) {
    setExcludedExpIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSkill(id) {
    setExcludedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const includedExperiences = experiences.filter((exp) => !excludedExpIds.has(exp.id));
  const includedSkills = skills.filter((s) => !excludedSkillIds.has(s.id));

  const skillsByCategory = SKILL_CATEGORY_ORDER.reduce((acc, category) => {
    acc[category] = skills.filter((s) => categorizeSkill(s.skill_name) === category);
    return acc;
  }, {});

  function buildSnapshotText() {
    const expLines = includedExperiences.map((exp) => `• ${defaultExpText(exp)}`);
    const skillLines = SKILL_CATEGORY_ORDER.map((category) => {
      const names = includedSkills
        .filter((s) => categorizeSkill(s.skill_name) === category)
        .map((s) => s.skill_name);
      return names.length > 0 ? `${category}: ${names.join(", ")}` : null;
    }).filter(Boolean);
    return [...expLines, "", ...skillLines].join("\n");
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildSnapshotText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const [atsStage, setAtsStage] = useState("form");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [reportCopied, setReportCopied] = useState(false);

  function handleResumeFileChosen(file) {
    if (!file) return;
    setResumeFileName(file.name);
  }

  function handleAnalyzeMatch() {
    setAtsStage("loading");
    setTimeout(() => setAtsStage("result"), 2000);
  }

  function handleStartOver() {
    setAtsStage("form");
    setJobDescription("");
    setResumeFileName("");
    setReportCopied(false);
  }

  function handleCopyReport() {
    navigator.clipboard.writeText(buildAtsReportText());
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 1500);
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
            <p className="text-xs font-semibold uppercase tracking-wide text-[#B85A12] dark:text-orange-300">
              Experience Snapshot
            </p>
            <h2 className="mt-2 text-lg font-bold text-[#111827] dark:text-[#F8F9FA]">
              Your experiences, ready to copy
            </h2>
            <p className="mt-1 text-sm text-[#6B7280] dark:text-neutral-400">
              Auto-pulled from your Timeline and Skills. Uncheck anything you don't want on this resume.
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
                {experiences.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-neutral-400">
                    No experiences logged yet.{" "}
                    <Link to="/timeline" className="font-medium text-brand-orange hover:underline">
                      Add one on your timeline →
                    </Link>
                  </p>
                ) : (
                  <ul className="space-y-2.5 text-sm">
                    {experiences.map((exp) => {
                      const included = !excludedExpIds.has(exp.id);
                      return (
                        <li key={exp.id} className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={included}
                            onChange={() => toggleExp(exp.id)}
                            aria-label={`Include ${exp.organization_name} on resume`}
                            className="mt-1 h-4 w-4 flex-shrink-0 rounded border-slate-300 dark:border-white/20 text-brand-orange focus:ring-2 focus:ring-orange-500"
                          />
                          <span
                            className={
                              included
                                ? "text-[#111827] dark:text-[#F8F9FA]"
                                : "text-slate-400 line-through dark:text-neutral-600"
                            }
                          >
                            {defaultExpText(exp)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-5 space-y-4">
                  {skills.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-neutral-400">
                      No skills logged yet.{" "}
                      <Link to="/skills" className="font-medium text-brand-orange hover:underline">
                        Add one on your Skills page →
                      </Link>
                    </p>
                  ) : (
                    SKILL_CATEGORY_ORDER.map((category) => {
                      const items = skillsByCategory[category];
                      if (!items || items.length === 0) return null;
                      return (
                        <div key={category}>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
                            {category}
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-2">
                            {items.map((skill) => {
                              const included = !excludedSkillIds.has(skill.id);
                              return (
                                <label
                                  key={skill.id}
                                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                    included
                                      ? "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300"
                                      : "border-slate-200 bg-slate-50 text-slate-400 line-through dark:border-white/10 dark:bg-white/5 dark:text-neutral-600"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={included}
                                    onChange={() => toggleSkill(skill.id)}
                                    aria-label={`Include ${skill.skill_name} on resume`}
                                    className="h-3 w-3 rounded border-slate-300 text-brand-orange focus:ring-2 focus:ring-orange-500"
                                  />
                                  {skill.skill_name}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

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

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border-l-2 border-l-brand-orange bg-white dark:bg-[#232428] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#B85A12] dark:text-orange-300">
              Job Fit & Resume Optimizer
            </p>
            <h2 className="mt-2 text-lg font-bold text-[#111827] dark:text-[#F8F9FA]">
              See how well your resume fits a job
            </h2>
            <p className="mt-1 text-sm text-[#6B7280] dark:text-neutral-400">
              Paste a job posting and upload your resume for an instant match score
            </p>
          </div>

          <div className="flex-1 rounded-2xl bg-white dark:bg-[#232428] p-6 shadow-sm">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setAtsExpanded((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200"
              >
                {atsExpanded ? "Hide ▲" : "Show ▼"}
              </button>
            </div>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                atsExpanded ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                {atsStage === "form" && (
                  <div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
                        Job Description
                      </p>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                        rows={4}
                        className="mt-3 w-full resize-none rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] px-3 py-2 text-sm text-[#111827] dark:text-[#F8F9FA] placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <hr className="my-5 border-slate-200 dark:border-white/10" />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
                        Your Resume
                      </p>

                      {resumeFileName === "" ? (
                        <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#EA580C] dark:border-orange-500/30 bg-[#FEF0E6] dark:bg-orange-500/10 px-4 py-8 text-center">
                          <UploadCloud className="h-6 w-6 text-[#EA580C] dark:text-orange-300" aria-hidden="true" />
                          <p className="text-sm font-medium text-slate-800 dark:text-neutral-200">
                            Drop your resume or click to browse
                          </p>
                          <p className="text-xs text-slate-500 dark:text-neutral-400">Supports PDF, DOC, DOCX</p>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleResumeFileChosen(e.target.files?.[0])}
                          />
                        </label>
                      ) : (
                        <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-300" aria-hidden="true" />
                          <p className="truncate text-sm text-slate-700 dark:text-neutral-200">{resumeFileName}</p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={jobDescription.trim() === "" || resumeFileName === ""}
                      onClick={handleAnalyzeMatch}
                      className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Analyze Job Fit
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {atsStage === "loading" && (
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-10 text-sm text-slate-500 dark:text-neutral-400">
                    <Loader2 className="h-5 w-5 animate-spin text-brand-orange" aria-hidden="true" />
                    Analyzing match...
                  </div>
                )}

                {atsStage === "result" && (
                  <div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-semibold text-[#111827] dark:text-[#F8F9FA]">Job Match Score</p>
                      <p className="text-sm font-bold text-brand-orange">73%</p>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div className="h-full rounded-full bg-brand-orange" style={{ width: "73%" }} />
                    </div>

                    <div className="mt-5 rounded-lg bg-orange-50 dark:bg-orange-500/10 p-3 text-[12px] text-orange-800 dark:text-orange-300">
                      <p className="font-semibold uppercase tracking-wide">
                        Relevant Experiences From Your Profile
                      </p>
                      <ul className="mt-2 space-y-1">
                        {experiences.map((exp, i) => (
                          <li key={i}>
                            ✓ {exp.organization_name} - {exp.experience_type}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2">
                        Consider adding these to your resume to improve your match score
                      </p>
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280] dark:text-neutral-400">
                      Missing Keywords
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {MISSING_KEYWORDS.map((keyword) => (
                        <Badge key={keyword} tone="red">
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280] dark:text-neutral-400">
                      Strong Matches
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {STRONG_MATCHES.map((match) => (
                        <Badge key={match} tone="success">
                          {match}
                        </Badge>
                      ))}
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280] dark:text-neutral-400">
                      What to Improve
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-[#111827] dark:text-[#F8F9FA]">
                      {IMPROVEMENTS.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="flex-shrink-0 text-brand-orange">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handleCopyReport}
                        className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        {reportCopied ? "Copied!" : "Copy Report"}
                      </button>
                      <button
                        type="button"
                        onClick={handleStartOver}
                        className="text-sm font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200"
                      >
                        Start Over
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
