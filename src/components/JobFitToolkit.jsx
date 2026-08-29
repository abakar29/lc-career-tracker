import { useEffect, useState } from "react";
import { UploadCloud, CheckCircle2, ArrowRight, Copy, Loader2 } from "lucide-react";
import { computeJobFitAnalysis } from "../lib/jobFit";
import { Badge, ToggleSwitch } from "./ui";

const MISSING_KEYWORDS = ["financial modeling", "Python", "data analysis", "Excel"];
const STRONG_MATCHES = ["project management", "research", "communication"];
const IMPROVEMENTS = [
  "Work \"financial modeling\" and \"data analysis\" into your experience bullets.",
  "Quantify results with specific metrics and outcomes where possible.",
  "Call out any exposure to Excel or Python, even from coursework.",
];

function buildAtsReportText(resolvedResult) {
  return `Job Match Score: ${resolvedResult.score}%

MISSING KEYWORDS
${resolvedResult.missing.join(", ")}

STRONG MATCHES
${resolvedResult.matched.join(", ")}

WHAT TO IMPROVE
${resolvedResult.suggestions.map((item) => `- ${item}`).join("\n")}`;
}

export default function JobFitToolkit({ experiences, skills }) {
  const [atsExpanded, setAtsExpanded] = useState(true);
  const [atsStage, setAtsStage] = useState("form");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [reportCopied, setReportCopied] = useState(false);

  const [aiMode, setAiMode] = useState(
    () => localStorage.getItem("abuve:resume:aimode") !== "false"
  );
  const [activeTab, setActiveTab] = useState("analysis");
  const [realResult, setRealResult] = useState(null);

  useEffect(() => {
    localStorage.setItem("abuve:resume:aimode", String(aiMode));
  }, [aiMode]);

  const resolvedResult = aiMode
    ? { score: 73, matched: STRONG_MATCHES, missing: MISSING_KEYWORDS, suggestions: IMPROVEMENTS, keywordCount: null }
    : realResult;

  function handleResumeFileChosen(file) {
    if (!file) return;
    setResumeFileName(file.name);
  }

  function handleAnalyzeMatch() {
    if (aiMode) {
      setAtsStage("loading");
      setTimeout(() => setAtsStage("result"), 2000);
    } else {
      const result = computeJobFitAnalysis({ jobDescription, experiences, skills });
      setRealResult(result);
      setAtsStage("result");
    }
  }

  function handleStartOver() {
    setAtsStage("form");
    setJobDescription("");
    setResumeFileName("");
    setReportCopied(false);
    setRealResult(null);
  }

  function handleCopyReport() {
    if (!resolvedResult) return;
    navigator.clipboard.writeText(buildAtsReportText(resolvedResult));
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border-l-2 border-l-brand-orange bg-white dark:bg-[#232428] p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#B85A12] dark:text-orange-300">
          Job Fit Toolkit
        </p>
        <h2 className="mt-2 text-lg font-bold text-[#111827] dark:text-[#F8F9FA]">
          See how well your resume fits a job
        </h2>
        <p className="mt-1 text-sm text-[#6B7280] dark:text-neutral-400">
          Paste a job posting and upload your resume for an instant match score
        </p>

        <div className="mt-3 border-t border-slate-100 dark:border-white/10 pt-1">
          <ToggleSwitch
            label="AI Mode"
            description={
              atsStage !== "form"
                ? "Start over to change modes"
                : aiMode
                  ? "Using AI-style analysis (demo mode)"
                  : "Using real keyword matching against your logged experience and skills"
            }
            checked={aiMode}
            onChange={setAiMode}
            disabled={atsStage !== "form"}
          />
        </div>
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
                {resolvedResult && (
                  <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveTab("analysis")}
                      className={`border-b-2 pb-2 transition-colors ${
                        activeTab === "analysis"
                          ? "border-brand-orange text-brand-orange"
                          : "border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200"
                      }`}
                    >
                      Job Fit Analysis
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("predictor")}
                      className={`border-b-2 pb-2 transition-colors ${
                        activeTab === "predictor"
                          ? "border-brand-orange text-brand-orange"
                          : "border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-200"
                      }`}
                    >
                      Match Predictor
                    </button>
                  </div>
                )}

                {resolvedResult && activeTab === "analysis" && (
                  <>
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
                      {resolvedResult.missing.map((keyword, i) => (
                        <Badge key={`${keyword}-${i}`} tone="red">
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280] dark:text-neutral-400">
                      Strong Matches
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {resolvedResult.matched.map((match, i) => (
                        <Badge key={`${match}-${i}`} tone="success">
                          {match}
                        </Badge>
                      ))}
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[#6B7280] dark:text-neutral-400">
                      What to Improve
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-[#111827] dark:text-[#F8F9FA]">
                      {resolvedResult.suggestions.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="flex-shrink-0 text-brand-orange">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {resolvedResult && activeTab === "predictor" && (
                  <div className="mt-5">
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-semibold text-[#111827] dark:text-[#F8F9FA]">Job Match Score</p>
                      <p className="text-sm font-bold text-brand-orange">{resolvedResult.score}%</p>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-brand-orange"
                        style={{ width: `${resolvedResult.score}%` }}
                      />
                    </div>
                    {resolvedResult.keywordCount !== null && (
                      <p className="mt-2 text-xs text-[#6B7280] dark:text-neutral-400">
                        Based on {resolvedResult.keywordCount} keyword
                        {resolvedResult.keywordCount === 1 ? "" : "s"} found in the job description.
                      </p>
                    )}
                  </div>
                )}

                {/* Always rendered (even if resolvedResult is unexpectedly null) so the
                    user is never stuck on a blank panel with no way back to the form. */}
                <div className="mt-6 flex items-center gap-4">
                  {resolvedResult && (
                    <button
                      type="button"
                      onClick={handleCopyReport}
                      className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      {reportCopied ? "Copied!" : "Copy Report"}
                    </button>
                  )}
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
  );
}
