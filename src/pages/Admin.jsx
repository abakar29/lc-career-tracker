import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, StickyNote } from "lucide-react";
import { Card, CardHeader, Badge, Button, IconButton, Modal, TextArea } from "../components/ui";
import { formatDate } from "../lib/utils";
import { supabase } from "../supabaseClient";

const TOP_SKILLS = [
  { label: "Project Management", value: 89 },
  { label: "Communication", value: 84 },
  { label: "Python", value: 71 },
  { label: "Data Analysis", value: 65 },
  { label: "Leadership", value: 58 },
];

const TOP_INDUSTRIES = [
  { label: "Technology", interested: 34, ready: 22 },
  { label: "Consulting", interested: 28, ready: 15 },
  { label: "Finance", interested: 22, ready: 14 },
  { label: "Nonprofit", interested: 10, ready: 6 },
  { label: "Healthcare", interested: 6, ready: 3 },
];

const EXPERIENCE_BREAKDOWN = [
  { label: "Internships", value: 42 },
  { label: "Campus Activities", value: 31 },
  { label: "Study Abroad", value: 18 },
  { label: "Research", value: 9 },
];

const READINESS_OVERVIEW = [
  { label: "Career Ready", range: "80-100%", count: 18, tone: "success" },
  { label: "In Progress", range: "50-79%", count: 22, tone: "amber" },
  { label: "Getting Started", range: "0-49%", count: 7, tone: "red" },
];

const TOP_MISSING_SKILLS = [
  { label: "SQL", value: 61 },
  { label: "Excel", value: 54 },
  { label: "Power BI", value: 47 },
  { label: "Public Speaking", value: 39 },
  { label: "Leadership", value: 33 },
];

const EMPLOYER_READINESS = [
  { label: "Technology", count: 85 },
  { label: "Marketing", count: 46 },
  { label: "Finance", count: 31 },
  { label: "Healthcare", count: 19 },
];

const STUDENTS_NEEDING_ATTENTION = [
  { label: "No resume", count: 14 },
  { label: "No internship", count: 9 },
  { label: "No networking activity", count: 22 },
  { label: "No applications submitted", count: 31 },
];

const RECOMMENDATIONS = [
  "Host an Excel workshop",
  "Invite more Finance employers",
  "42 students are internship-ready",
  "Marketing students need networking support",
  "Resume completion has dropped this month",
];

const STAT_CARDS = [
  {
    label: "Students Ready for Internships",
    value: 42,
    students: ["Maya Okonkwo", "Daniel Ferreira", "James Lim"],
  },
  {
    label: "Students Needing Support",
    value: 18,
    students: ["Sarah Whitmore", "Alex Chen"],
  },
  {
    label: "Students Without Experience",
    value: 9,
    students: ["Marcus Webb", "Elena Vasquez", "Tyler Brooks"],
  },
  {
    label: "Missing Critical Skills",
    value: 23,
    students: ["Nina Okafor", "Chris Dominguez", "Priya Patel", "Alex Chen"],
  },
  {
    label: "Ready for Employer Matching",
    value: 31,
    students: ["Maya Okonkwo", "James Lim", "Jordan Reyes"],
  },
  {
    label: "No Resume on File",
    value: 14,
    students: ["Jordan Park", "Sam Rivera"],
  },
];

const STUDENT_ROWS = [
  { name: "Ethan Brooks", major: "Computer Science", experiences: 6, skills: 12, applications: 4, readiness: 92, lastActive: "2026-07-24", targetIndustry: "Technology", resumeStatus: "Complete", lastAppointment: "2026-07-20" },
  { name: "Sofia Martinez", major: "International Affairs", experiences: 4, skills: 9, applications: 2, readiness: 74, lastActive: "2026-07-23", targetIndustry: "Nonprofit", resumeStatus: "Complete", lastAppointment: "2026-07-15" },
  { name: "Liam Chen", major: "Biology", experiences: 3, skills: 7, applications: 3, readiness: 61, lastActive: "2026-07-22", targetIndustry: "Healthcare", resumeStatus: "Incomplete", lastAppointment: "2026-07-05" },
  { name: "Ava Thompson", major: "Economics", experiences: 5, skills: 11, applications: 5, readiness: 88, lastActive: "2026-07-25", targetIndustry: "Finance", resumeStatus: "Complete", lastAppointment: "2026-07-22" },
  { name: "Noah Patel", major: "Environmental Studies", experiences: 2, skills: 5, applications: 1, readiness: 38, lastActive: "2026-07-18", targetIndustry: "Nonprofit", resumeStatus: "Incomplete", lastAppointment: "2026-06-28" },
  { name: "Grace Kim", major: "Psychology", experiences: 4, skills: 8, applications: 3, readiness: 69, lastActive: "2026-07-21", targetIndustry: "Healthcare", resumeStatus: "Complete", lastAppointment: "2026-07-12" },
  { name: "Mason Rivera", major: "Sociology/Anthropology", experiences: 1, skills: 4, applications: 0, readiness: 22, lastActive: "2026-07-15", targetIndustry: "Nonprofit", resumeStatus: "Incomplete", lastAppointment: "2026-06-20" },
  { name: "Chloe Bennett", major: "English", experiences: 5, skills: 10, applications: 4, readiness: 81, lastActive: "2026-07-24", targetIndustry: "Marketing", resumeStatus: "Complete", lastAppointment: "2026-07-18" },
];

const TABLE_COLUMNS = [
  "Student Name",
  "Major",
  "Experiences",
  "Skills",
  "Applications",
  "Readiness Score",
  "Last Active",
  "Target Industry",
  "Resume Status",
  "Last Appointment",
];

const COLUMN_KEYS = {
  "Student Name": "name",
  Major: "major",
  Experiences: "experiences",
  Skills: "skills",
  Applications: "applications",
  "Readiness Score": "readiness",
  "Last Active": "lastActive",
  "Target Industry": "targetIndustry",
  "Resume Status": "resumeStatus",
  "Last Appointment": "lastAppointment",
};

const ROW_BORDER_CLASSES = {
  success: "border-l-orange-500",
  amber: "border-l-amber-500",
  red: "border-l-red-500",
};

const READINESS_FILTER_OPTIONS = ["All Levels", ...READINESS_OVERVIEW.map((r) => r.label)];

function readinessTone(score) {
  if (score >= 80) return "success";
  if (score >= 50) return "amber";
  return "red";
}

function readinessBand(score) {
  if (score >= 80) return "Career Ready";
  if (score >= 50) return "In Progress";
  return "Getting Started";
}

function BarRow({ label, value, color = "#EA580C" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-slate-700 dark:text-neutral-300">{label}</span>
        <span className="font-medium text-slate-900 dark:text-[#F8F9FA]">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function loadStoredNotes() {
  const map = {};
  STUDENT_ROWS.forEach((row) => {
    const stored = localStorage.getItem(`admin_note_${row.name}`);
    if (stored) map[row.name] = stored;
  });
  return map;
}

export default function Admin() {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState("readiness");
  const [sortDirection, setSortDirection] = useState("desc");
  const [readinessFilter, setReadinessFilter] = useState("All Levels");
  const [openStatIndex, setOpenStatIndex] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notes, setNotes] = useState(loadStoredNotes);
  const [noteTarget, setNoteTarget] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  function toggleStat(index) {
    setOpenStatIndex((prev) => (prev === index ? null : index));
  }

  function openNoteModal(row) {
    setNoteTarget(row);
    setNoteDraft(notes[row.name] ?? "");
  }

  function closeNoteModal() {
    setNoteTarget(null);
    setNoteDraft("");
  }

  function saveNote() {
    if (!noteTarget) return;
    const trimmed = noteDraft.trim();
    if (trimmed) {
      localStorage.setItem(`admin_note_${noteTarget.name}`, trimmed);
    } else {
      localStorage.removeItem(`admin_note_${noteTarget.name}`);
    }
    setNotes((prev) => ({ ...prev, [noteTarget.name]: trimmed }));
    closeNoteModal();
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log("Sign out error (guest mode):", error);
    } finally {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("abuve:")) localStorage.removeItem(key);
      });
      window.location.href = "/login";
    }
  }

  function handleSort(column) {
    const key = COLUMN_KEYS[column];
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  }

  function handleSortKeyDown(e, column) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSort(column);
    }
  }

  const sortedRows = [...STUDENT_ROWS].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const comparison =
      typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const filteredRows =
    readinessFilter === "All Levels"
      ? sortedRows
      : sortedRows.filter((row) => readinessBand(row.readiness) === readinessFilter);

  return (
    <div className="min-h-screen bg-brand-surface dark:bg-[#1A1919] transition-colors">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
        {notification && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: '#111827',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '10px',
              zIndex: 50,
              fontSize: '14px',
            }}
          >
            <div className="flex items-center gap-3">
              <span>{notification}</span>
              <button
                type="button"
                onClick={() => setNotification(null)}
                aria-label="Dismiss notification"
                style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 hover:underline dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ← Back to Dashboard
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 hover:underline dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Sign Out
          </button>
        </div>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F8F9FA]">
              Career Center Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1 dark:text-neutral-400">
              Student career readiness insights: Lewis &amp; Clark College 2026
            </p>
          </div>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shrink-0"
            style={{ backgroundColor: "#EA580C" }}
          >
            Faculty Access Only
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {STAT_CARDS.map((stat, i) => {
            const isOpen = openStatIndex === i;
            return (
              <div key={stat.label} className="relative">
                <Card className="cursor-pointer border border-slate-200 transition-colors hover:border-orange-400 hover:bg-orange-50/60 dark:border-white/10 dark:hover:border-orange-500/50 dark:hover:bg-orange-500/10">
                  <div style={{ padding: "12px 16px" }}>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onClick={() => toggleStat(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleStat(i);
                        }
                      }}
                    >
                      <p className="text-slate-500 dark:text-neutral-400" style={{ fontSize: "12px" }}>{stat.label}</p>
                      <p
                        className="mt-0.5 leading-tight text-slate-900 dark:text-[#F8F9FA]"
                        style={{ fontSize: "28px", fontWeight: 600 }}
                      >
                        {stat.value}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStat(i);
                      }}
                      className="mt-2 font-semibold hover:underline text-orange-800 dark:text-orange-300"
                      style={{ fontSize: "11px" }}
                    >
                      View all →
                    </button>
                  </div>
                </Card>

                {isOpen && (
                  <div
                    className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#232428]"
                    style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)", padding: "12px 16px" }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenStatIndex(null)}
                      aria-label="Close"
                      className="absolute right-2 top-2 text-xs leading-none text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                    >
                      ✕
                    </button>
                    <ul className="space-y-1 pr-4">
                      {stat.students.map((name) => (
                        <li key={name} className="text-sm text-slate-700 dark:text-neutral-300">
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <Card>
            <CardHeader title="Top Skills Across Students" />
            <div className="p-5 space-y-4">
              {TOP_SKILLS.map((skill) => (
                <BarRow key={skill.label} label={skill.label} value={skill.value} />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Top Industries Students Are Targeting" />
            <div className="p-5 space-y-4">
              {TOP_INDUSTRIES.map((industry) => (
                <div key={industry.label}>
                  <p className="text-sm text-slate-700 mb-1 dark:text-neutral-300">{industry.label}</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-16 shrink-0 text-xs text-slate-500 dark:text-neutral-400">Interested</span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${industry.interested}%`, backgroundColor: "#5f6062" }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-xs font-medium text-slate-900 dark:text-[#F8F9FA]">
                        {industry.interested}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 shrink-0 text-xs text-slate-500 dark:text-neutral-400">Ready</span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${industry.ready}%`, backgroundColor: "#EA580C" }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-xs font-medium text-slate-900 dark:text-[#F8F9FA]">
                        {industry.ready}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-1 text-xs text-slate-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: "#5f6062" }}
                    aria-hidden="true"
                  />
                  Interested
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: "#EA580C" }}
                    aria-hidden="true"
                  />
                  Ready
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <Card>
            <CardHeader title="Experience Type Breakdown" />
            <div className="p-5 space-y-4">
              {EXPERIENCE_BREAKDOWN.map((item) => (
                <BarRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Student Readiness Overview" />
            <div className="p-5 space-y-3">
              {READINESS_OVERVIEW.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 dark:border-white/10"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-[#F8F9FA]">{item.label}</p>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">{item.range}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 dark:text-neutral-400">{item.count} students</span>
                    <Badge tone={item.tone}>{item.count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader title="Top Missing Skills" />
          <div className="p-5 space-y-4">
            {TOP_MISSING_SKILLS.map((skill) => (
              <BarRow key={skill.label} label={skill.label} value={skill.value} />
            ))}
          </div>
        </Card>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3 dark:text-neutral-400">
            Employer Readiness
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EMPLOYER_READINESS.map((item) => (
              <Card key={item.label}>
                <div className="flex flex-col gap-3" style={{ padding: "12px 16px" }}>
                  <div>
                    <p className="text-slate-500 dark:text-neutral-400" style={{ fontSize: "13px", fontWeight: 500 }}>
                      {item.label}
                    </p>
                    <p className="text-slate-900 mt-1 dark:text-[#F8F9FA]" style={{ fontSize: "22px", fontWeight: 700 }}>
                      {item.count}
                    </p>
                  </div>
                  <button
                    type="button"
                    style={{
                      fontSize: "12px",
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                    className="self-start hover:underline text-orange-600 dark:text-orange-400"
                    onClick={() => setNotification(`Viewing students ready for ${item.label} roles`)}
                  >
                    View Students
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader title="Students Needing Attention" />
          <div className="p-5 pt-3">
            <ul className="divide-y divide-slate-100 dark:divide-white/10">
              {STUDENTS_NEEDING_ATTENTION.map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-[#F8F9FA]">{item.label}</p>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">{item.count} students</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotification(`Viewing students: ${item.label}`)}
                    className="text-sm font-semibold hover:underline text-orange-600 dark:text-orange-400"
                  >
                    View Students
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="flex items-center gap-2 px-5 pt-5">
            <Lightbulb className="h-5 w-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-[#F8F9FA]">Recommendations</h2>
          </div>
          <ul className="p-5 pt-3 space-y-2.5">
            {RECOMMENDATIONS.map((rec, i) => (
              <li key={rec} className="flex items-start gap-2 text-sm text-slate-700 dark:text-neutral-300">
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-600 dark:bg-orange-400"
                  aria-hidden="true"
                />
                <span>{rec}</span>
                {i < 2 && (
                  <span
                    className="rounded bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-300"
                    style={{
                      fontSize: "11px",
                      padding: "2px 6px",
                    }}
                  >
                    Action needed
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex items-center gap-3 mb-3">
          <label
            htmlFor="readiness-filter"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400"
          >
            Filter by Readiness
          </label>
          <select
            id="readiness-filter"
            value={readinessFilter}
            onChange={(e) => setReadinessFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-white/10 dark:bg-[#1A1919] dark:text-neutral-300"
          >
            {READINESS_FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="md:hidden mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3 dark:text-neutral-400">
            Student Activity
          </p>
          <div className="space-y-3">
            {filteredRows.map((row) => (
              <Card key={row.name} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-[#F8F9FA]">{row.name}</p>
                    <p className="text-sm text-slate-500 truncate dark:text-neutral-400">{row.major}</p>
                  </div>
                  <Badge tone={readinessTone(row.readiness)}>{row.readiness}%</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-400 dark:text-neutral-500">
                    Last active {formatDate(row.lastActive)}
                  </p>
                  <button
                    type="button"
                    onClick={() => openNoteModal(row)}
                    className={`inline-flex items-center gap-1 text-xs font-medium hover:underline ${
                      notes[row.name]
                        ? "text-orange-700 dark:text-orange-300"
                        : "text-slate-400 dark:text-neutral-500"
                    }`}
                  >
                    <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
                    {notes[row.name] ? "Edit note" : "Add note"}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mb-6 hidden md:block">
          <CardHeader title="Student Activity Table" />
          <div className="p-5 pt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  {TABLE_COLUMNS.map((col) => {
                    const key = COLUMN_KEYS[col];
                    const isActive = sortKey === key;
                    return (
                      <th
                        key={col}
                        role="button"
                        tabIndex={0}
                        aria-sort={isActive ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                        onClick={() => handleSort(col)}
                        onKeyDown={(e) => handleSortKeyDown(e, col)}
                        className="text-left font-medium text-slate-500 text-[13px] px-3 py-2.5 cursor-pointer select-none hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                      >
                        {col}{" "}
                        <span className={isActive ? "text-slate-600 dark:text-neutral-300" : "text-slate-300 dark:text-neutral-600"}>
                          {isActive ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </th>
                    );
                  })}
                  <th className="text-left font-medium text-slate-500 text-[13px] px-3 py-2.5 dark:text-neutral-400">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, i) => {
                  const tone = readinessTone(row.readiness);
                  return (
                    <tr
                      key={row.name}
                      className={`border-l-4 ${ROW_BORDER_CLASSES[tone]} transition-colors hover:bg-[#F9FAFB] dark:hover:bg-white/10 ${
                        i % 2 === 1 ? "bg-slate-50 dark:bg-white/5" : "bg-white dark:bg-[#232428]"
                      }`}
                    >
                      <td className="px-3 py-3 font-medium text-slate-900 dark:text-[#F8F9FA]">{row.name}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-neutral-300">{row.major}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-neutral-300">{row.experiences}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-neutral-300">{row.skills}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-neutral-300">{row.applications}</td>
                      <td className="px-3 py-3">
                        <Badge tone={tone}>{row.readiness}%</Badge>
                      </td>
                      <td className="px-3 py-3 text-slate-500 dark:text-neutral-400">{formatDate(row.lastActive)}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-neutral-300">{row.targetIndustry}</td>
                      <td className="px-3 py-3">
                        <Badge tone={row.resumeStatus === "Complete" ? "success" : "red"}>
                          {row.resumeStatus}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-slate-500 dark:text-neutral-400">{formatDate(row.lastAppointment)}</td>
                      <td className="px-3 py-3">
                        <IconButton
                          icon={StickyNote}
                          label={notes[row.name] ? `Edit note for ${row.name}` : `Add note for ${row.name}`}
                          onClick={() => openNoteModal(row)}
                          className={notes[row.name] ? "text-orange-600 dark:text-orange-300" : ""}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            style={{ backgroundColor: "#EA580C" }}
            className="text-white hover:opacity-90"
            onClick={() => setNotification("Report exported successfully")}
          >
            Export Report
          </Button>
          <p className="text-xs text-slate-400 dark:text-neutral-500">
            Data shown is aggregated and anonymized
          </p>
        </div>
      </div>

      <Modal
        open={!!noteTarget}
        onClose={closeNoteModal}
        title={`Note: ${noteTarget?.name ?? ""}`}
      >
        <div className="space-y-4">
          <TextArea
            label="Note"
            placeholder="Add context for advisors, e.g. follow-up items or accommodations"
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={5}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={closeNoteModal}>
              Cancel
            </Button>
            <Button type="button" onClick={saveNote}>
              Save Note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
