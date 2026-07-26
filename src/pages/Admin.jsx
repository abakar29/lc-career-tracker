import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, Badge, Button } from "../components/ui";

const TOP_SKILLS = [
  { label: "Project Management", value: 89 },
  { label: "Communication", value: 84 },
  { label: "Python", value: 71 },
  { label: "Data Analysis", value: 65 },
  { label: "Leadership", value: 58 },
];

const TOP_INDUSTRIES = [
  { label: "Technology", value: 34 },
  { label: "Consulting", value: 28 },
  { label: "Finance", value: 22 },
  { label: "Nonprofit", value: 10 },
  { label: "Healthcare", value: 6 },
];

const EXPERIENCE_BREAKDOWN = [
  { label: "Internships", value: 42 },
  { label: "Campus Activities", value: 31 },
  { label: "Study Abroad", value: 18 },
  { label: "Research", value: 9 },
];

const READINESS_OVERVIEW = [
  { label: "Career Ready", range: "80-100%", count: 18, tone: "green" },
  { label: "In Progress", range: "50-79%", count: 22, tone: "amber" },
  { label: "Getting Started", range: "0-49%", count: 7, tone: "red" },
];

const STAT_CARDS = [
  { label: "Total Students", value: 47 },
  { label: "Experiences Logged", value: 183 },
  { label: "Skills Recorded", value: 312 },
  { label: "Applications Submitted", value: 94 },
];

const STUDENT_ROWS = [
  { id: "LC24-0113", major: "Computer Science", experiences: 6, skills: 12, applications: 4, readiness: 92, lastActive: "2026-07-24" },
  { id: "LC25-0287", major: "International Affairs", experiences: 4, skills: 9, applications: 2, readiness: 74, lastActive: "2026-07-23" },
  { id: "LC24-0056", major: "Biology", experiences: 3, skills: 7, applications: 3, readiness: 61, lastActive: "2026-07-22" },
  { id: "LC26-0402", major: "Economics", experiences: 5, skills: 11, applications: 5, readiness: 88, lastActive: "2026-07-25" },
  { id: "LC25-0198", major: "Environmental Studies", experiences: 2, skills: 5, applications: 1, readiness: 38, lastActive: "2026-07-18" },
  { id: "LC24-0331", major: "Psychology", experiences: 4, skills: 8, applications: 3, readiness: 69, lastActive: "2026-07-21" },
  { id: "LC26-0075", major: "Sociology/Anthropology", experiences: 1, skills: 4, applications: 0, readiness: 22, lastActive: "2026-07-15" },
  { id: "LC25-0244", major: "English", experiences: 5, skills: 10, applications: 4, readiness: 81, lastActive: "2026-07-24" },
];

const TABLE_COLUMNS = [
  "Student ID",
  "Major",
  "Experiences",
  "Skills",
  "Applications",
  "Readiness Score",
  "Last Active",
];

const COLUMN_KEYS = {
  "Student ID": "id",
  Major: "major",
  Experiences: "experiences",
  Skills: "skills",
  Applications: "applications",
  "Readiness Score": "readiness",
  "Last Active": "lastActive",
};

function BarRow({ label, value, color = "#E87722" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-slate-700">{label}</span>
        <span className="font-medium text-slate-900">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState("readiness");
  const [sortDirection, setSortDirection] = useState("desc");

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FB" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 hover:underline mb-6"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Career Center Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Student career readiness insights: Lewis &amp; Clark College 2026
            </p>
          </div>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shrink-0"
            style={{ backgroundColor: "#E87722" }}
          >
            Faculty Access Only
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {STAT_CARDS.map((stat) => (
            <Card key={stat.label} className="p-5">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </Card>
          ))}
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
                <BarRow key={industry.label} label={industry.label} value={industry.value} />
              ))}
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
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.range}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">{item.count} students</span>
                    <Badge tone={item.tone}>{item.count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader title="Student Activity Table" />
          <div className="p-5 pt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
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
                        className="text-left font-medium text-slate-500 px-3 py-2 cursor-pointer select-none hover:text-slate-700"
                      >
                        {col}{" "}
                        <span className={isActive ? "text-slate-600" : "text-slate-300"}>
                          {isActive ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={i % 2 === 1 ? "bg-slate-50" : "bg-white"}
                  >
                    <td className="px-3 py-2.5 font-medium text-slate-900">{row.id}</td>
                    <td className="px-3 py-2.5 text-slate-700">{row.major}</td>
                    <td className="px-3 py-2.5 text-slate-700">{row.experiences}</td>
                    <td className="px-3 py-2.5 text-slate-700">{row.skills}</td>
                    <td className="px-3 py-2.5 text-slate-700">{row.applications}</td>
                    <td className="px-3 py-2.5 text-slate-700">{row.readiness}%</td>
                    <td className="px-3 py-2.5 text-slate-500">{row.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            style={{ backgroundColor: "#E87722" }}
            className="text-white hover:opacity-90"
            onClick={() => alert("Report exported successfully")}
          >
            Export Report
          </Button>
          <p className="text-xs text-slate-400">
            Data shown is aggregated and anonymized
          </p>
        </div>
      </div>
    </div>
  );
}
