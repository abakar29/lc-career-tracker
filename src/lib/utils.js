export function formatDate(dateStr) {
  if (!dateStr) return "Present";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysSince(dateStr) {
  const then = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export function computeProfileCompleteness({
  experiences,
  networkConnections,
  skills,
  resumeVersions,
  applications,
}) {
  const checks = [
    {
      label: "Log an experience",
      done: experiences.length >= 1,
      why: "The Career Center and employers use your experience history to match you to postings and write referrals.",
      cta: { label: "Add an experience", to: "/experience" },
    },
    {
      label: "Save a network contact",
      done: networkConnections.length >= 1,
      why: "Most Pioneer internships trace back to a warm intro; an empty network means relying on cold applications alone.",
      cta: { label: "Add a contact", to: "/network" },
    },
    {
      label: "Add 3+ skills",
      done: skills.length >= 3,
      why: "Recruiters scan for specific, named skills; three or more gives your profile enough signal to be found.",
      cta: { label: "Add a skill", to: "/skills" },
    },
    {
      label: "Upload a resume",
      done: resumeVersions.some((r) => r.status === "Up to date"),
      why: "An outdated resume is the most common reason a Career Center review stalls; keep one version current.",
      cta: null,
    },
    {
      label: "Submit an application",
      done: applications.length >= 1,
      why: "Every other step compounds once you're in a pipeline; applying turns readiness into results.",
      cta: null,
    },
  ];
  const score = Math.round(
    (checks.filter((c) => c.done).length / checks.length) * 100
  );
  return { score, checks };
}

const PROFICIENCY_RANK = { Advanced: 3, Intermediate: 2, Beginner: 1 };

export function buildResumeSnapshot({ experiences, skills }) {
  const expBullets = [...experiences]
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
    .map((e) => {
      const range = `${formatDate(e.start_date)} – ${formatDate(e.end_date)}`;
      return `${e.experience_type}, ${e.organization_name}, ${e.location} (${range})`;
    });

  const topSkills = [...skills]
    .sort(
      (a, b) =>
        (PROFICIENCY_RANK[b.proficiency_level] ?? 0) -
        (PROFICIENCY_RANK[a.proficiency_level] ?? 0)
    )
    .slice(0, 6)
    .map((s) => s.skill_name);

  const bullets = [...expBullets];
  if (topSkills.length > 0) {
    bullets.push(`Key skills: ${topSkills.join(", ")}`);
  }
  return bullets;
}
