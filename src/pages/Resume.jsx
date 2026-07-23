import { useState } from "react";
import { UploadCloud, CheckCircle2, ArrowRight, Copy, Loader2 } from "lucide-react";
import { experiences, skills } from "../data/mockData";
import { formatDate } from "../lib/utils";
import { Badge } from "../components/ui";

function buildSnapshotText() {
  const expLines = experiences.map(
    (exp) =>
      `${exp.organization_name} - ${exp.experience_type} | ${exp.location} | ${formatDate(
        exp.start_date
      )} – ${formatDate(exp.end_date)}`
  );
  const skillNames = skills.map((s) => s.skill_name).join(", ");
  return [...expLines, "", `Skills: ${skillNames}`].join("\n");
}

const MISSING_KEYWORDS = ["financial modeling", "Python", "data analysis", "Excel"];
const STRONG_MATCHES = ["project management", "research", "communication"];
const IMPROVEMENTS = [
  "Work \"financial modeling\" and \"data analysis\" into your experience bullets.",
  "Quantify results with specific metrics and outcomes where possible.",
  "Call out any exposure to Excel or Python, even from coursework.",
];

function buildAtsReportText() {
  return `ATS Match Score: 73%

MISSING KEYWORDS
${MISSING_KEYWORDS.join(", ")}

STRONG MATCHES
${STRONG_MATCHES.join(", ")}

WHAT TO IMPROVE
${IMPROVEMENTS.map((item) => `- ${item}`).join("\n")}`;
}

export default function Resume() {
  const [copied, setCopied] = useState(false);
  const [snapshotExpanded, setSnapshotExpanded] = useState(true);
  const [atsExpanded, setAtsExpanded] = useState(true);

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

  return (
    <div className="-mx-4 -my-6 min-h-screen bg-[#F8F9FB] px-4 py-6 md:-mx-8 md:-my-8 md:px-8 md:py-8">
      <h1 className="text-2xl font-bold text-slate-900">Resume</h1>
      <p className="text-slate-500 mt-1">Build and optimize your resume</p>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border-l-2 border-l-brand-orange bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
              Experience Snapshot
            </p>
            <h2 className="mt-2 text-lg font-bold text-[#111827]">
              Your experiences, ready to copy
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Use this as a starting point for your resume
            </p>
          </div>

          <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSnapshotExpanded((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
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
                <ul className="space-y-4 text-sm text-[#111827]">
                  {experiences.map((exp, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="flex-shrink-0 text-brand-orange">•</span>
                      <span>
                        {exp.organization_name} - {exp.experience_type} | {exp.location} |{" "}
                        {formatDate(exp.start_date)} – {formatDate(exp.end_date)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs text-[#6B7280]"
                    >
                      {s.skill_name}
                    </span>
                  ))}
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
          <div className="rounded-2xl border-l-2 border-l-brand-orange bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
              ATS Resume Checker
            </p>
            <h2 className="mt-2 text-lg font-bold text-[#111827]">
              See how well your resume fits a job
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Paste a job posting and upload your resume for an instant match score
            </p>
          </div>

          <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setAtsExpanded((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
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
                        className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <hr className="my-5 border-slate-200" />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
                        Your Resume
                      </p>

                      {resumeFileName === "" ? (
                        <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#E87722] bg-[#FEF0E6] px-4 py-8 text-center">
                          <UploadCloud className="h-6 w-6 text-[#E87722]" aria-hidden="true" />
                          <p className="text-sm font-medium text-slate-800">
                            Drop your resume or click to browse
                          </p>
                          <p className="text-xs text-slate-500">Supports PDF, DOC, DOCX</p>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleResumeFileChosen(e.target.files?.[0])}
                          />
                        </label>
                      ) : (
                        <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" aria-hidden="true" />
                          <p className="truncate text-sm text-slate-700">{resumeFileName}</p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={jobDescription.trim() === "" || resumeFileName === ""}
                      onClick={handleAnalyzeMatch}
                      className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Analyze Match
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {atsStage === "loading" && (
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-10 text-sm text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin text-brand-orange" aria-hidden="true" />
                    Analyzing match...
                  </div>
                )}

                {atsStage === "result" && (
                  <div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-semibold text-[#111827]">ATS Match Score</p>
                      <p className="text-sm font-bold text-brand-orange">73%</p>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand-orange" style={{ width: "73%" }} />
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Missing Keywords
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {MISSING_KEYWORDS.map((keyword) => (
                        <Badge key={keyword} tone="red">
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      Strong Matches
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {STRONG_MATCHES.map((match) => (
                        <Badge key={match} tone="green">
                          {match}
                        </Badge>
                      ))}
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      What to Improve
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-[#111827]">
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
                        className="text-sm font-medium text-slate-500 hover:text-slate-700"
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
    </div>
  );
}
