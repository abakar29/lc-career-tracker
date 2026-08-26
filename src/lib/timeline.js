// Builds the unified "four-year timeline" feed from a student's logged
// experiences and skills, grouped by academic term.

const SECTORS = {
  TECH: "Data Science, Tech & Computer Science",
  PUBLIC: "Public Service, Law & Policy",
  BUSINESS: "Business, Finance & Consulting",
  HEALTH: "Health & Life Sciences",
  ARTS: "Arts, Media & Communication",
  GLOBAL: "Global Affairs & International Studies",
  ENV: "Environmental & Sustainability",
  EDU: "Education & Nonprofit",
};

const SKILL_SECTOR_KEYWORDS = [
  { keywords: ["python", "data", "sql", "javascript", "git", "debug", "structures", "testing", "excel", "statistics"], sector: SECTORS.TECH },
  { keywords: ["public speaking", "event planning", "brand", "content", "social media"], sector: SECTORS.ARTS },
  { keywords: ["project management", "client", "prioritization", "problem solving", "cross-functional"], sector: SECTORS.BUSINESS },
  { keywords: ["research", "user research", "wireframing", "usability", "figma"], sector: SECTORS.EDU },
  { keywords: ["french", "language"], sector: SECTORS.GLOBAL },
];

const EXPERIENCE_TYPE_SECTOR = {
  "Study Abroad": SECTORS.GLOBAL,
  Research: SECTORS.TECH,
  Volunteer: SECTORS.PUBLIC,
};

const ORG_SECTOR_KEYWORDS = [
  { keywords: ["associated students", "government", "senate", "policy"], sector: SECTORS.PUBLIC },
  { keywords: ["entrepreneurship", "business", "consulting", "adidas", "nike", "columbia sportswear"], sector: SECTORS.BUSINESS },
  { keywords: ["intel", "engineering", "software", "data"], sector: SECTORS.TECH },
  { keywords: ["sustainab", "environment", "electric"], sector: SECTORS.ENV },
];

// Broad buckets used by the sticky category filter bar. Every experience
// type and every skill maps into exactly one of these three.
export const FILTER_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "internships-work", label: "Internships & Work" },
  { key: "campus-leadership", label: "Campus Leadership" },
  { key: "coursework-skills", label: "Coursework & Skills" },
];

export const CATEGORY_SHORT_LABELS = {
  "internships-work": "Work",
  "campus-leadership": "Leadership",
  "coursework-skills": "Coursework",
};

const EXPERIENCE_TYPE_FILTER_CATEGORY = {
  Internship: "internships-work",
  Volunteer: "internships-work",
  "Campus Activity": "campus-leadership",
  "Study Abroad": "campus-leadership",
  Research: "coursework-skills",
  Other: "coursework-skills",
};

function matchKeyword(text, table) {
  const lower = text.toLowerCase();
  for (const { keywords, sector } of table) {
    if (keywords.some((k) => lower.includes(k))) return sector;
  }
  return null;
}

export function inferSkillSector(skill) {
  return (
    matchKeyword(skill.skill_name ?? "", SKILL_SECTOR_KEYWORDS) ??
    (skill.context === "Internship" ? SECTORS.BUSINESS : SECTORS.EDU)
  );
}

export function inferExperienceSector(experience) {
  return (
    matchKeyword(experience.organization_name ?? "", ORG_SECTOR_KEYWORDS) ??
    EXPERIENCE_TYPE_SECTOR[experience.experience_type] ??
    SECTORS.BUSINESS
  );
}

// L&C's academic calendar runs Fall (Aug-Dec) into Spring (Jan-May); summer
// terms are folded into the following Fall bucket since so few entries land there.
export function getAcademicTerm(dateStr) {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T00:00:00`);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (month >= 1 && month <= 5) return { season: "Spring", year, sortKey: year * 10 };
  return { season: "Fall", year, sortKey: year * 10 + 5 };
}

export function buildTimelineEntries({ experiences, skills }) {
  const experienceEntries = experiences
    .filter((exp) => exp.start_date)
    .map((exp) => ({
      id: `exp-${exp.id}`,
      refId: exp.id,
      kind: "EXPERIENCE",
      typeLabel: exp.experience_type,
      title: exp.organization_name,
      description: [exp.experience_type, exp.location].filter(Boolean).join(" · "),
      sector: inferExperienceSector(exp),
      filterCategory: EXPERIENCE_TYPE_FILTER_CATEGORY[exp.experience_type] ?? "coursework-skills",
      date: exp.start_date,
      raw: exp,
    }));

  const skillEntries = skills
    .filter((s) => s.date_added)
    .map((s) => ({
      id: `skill-${s.id}`,
      refId: s.id,
      kind: "SKILLS",
      typeLabel: "Skill",
      title: s.skill_name,
      description: `${s.proficiency_level} · built through ${s.context}`,
      sector: inferSkillSector(s),
      filterCategory: "coursework-skills",
      date: s.date_added,
      raw: s,
    }));

  return [...experienceEntries, ...skillEntries];
}

export function groupByTerm(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const term = getAcademicTerm(entry.date);
    if (!term) continue;
    const key = `${term.season} ${term.year}`;
    if (!groups.has(key)) {
      groups.set(key, { key, label: key, sortKey: term.sortKey, entries: [] });
    }
    groups.get(key).entries.push(entry);
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      entries: group.entries.sort((a, b) => new Date(b.date) - new Date(a.date)),
    }))
    .sort((a, b) => b.sortKey - a.sortKey);
}
