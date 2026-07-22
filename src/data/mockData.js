// Mock data for the PioneerPath demo profile.
// In production this would be scoped to the signed-in student via student_id.

export const profile = {
  name: "Alex Morgan",
  classYear: "2029",
  major: "Business Administration & Data Science",
  studentId: "lc-2024-001",
};

export const experiences = [
  {
    student_id: "lc-2024-001",
    experience_type: "Internship",
    organization_name: "Adidas North America",
    location: "Portland, OR",
    start_date: "2026-06-01",
    end_date: "2026-08-15",
    current_status: "Active",
  },
  {
    student_id: "lc-2024-002",
    experience_type: "Study Abroad",
    organization_name: "Sciences Po Strasbourg",
    location: "Strasbourg, France",
    start_date: "2026-01-15",
    end_date: "2026-05-30",
    current_status: "Completed",
  },
  {
    student_id: "lc-2024-003",
    experience_type: "Campus Activity",
    organization_name: "LC Entrepreneurship Club",
    location: "Portland, OR",
    start_date: "2025-09-01",
    end_date: null,
    current_status: "In Progress",
  },
  {
    student_id: "lc-2024-004",
    experience_type: "Internship",
    organization_name: "Columbia Sportswear",
    location: "Portland, OR",
    start_date: "2026-06-10",
    end_date: "2026-08-22",
    current_status: "Active",
  },
  {
    student_id: "lc-2024-001",
    experience_type: "Campus Activity",
    organization_name: "Associated Students of LC",
    location: "Portland, OR",
    start_date: "2025-09-01",
    end_date: null,
    current_status: "In Progress",
  },
];

export const networkConnections = [
  {
    student_id: "lc-2024-001",
    contact_name: "Maya Okonkwo",
    employer_company: "Adidas North America",
    job_title: "Senior Product Manager",
    last_contacted_date: "2026-07-01",
    connection_source: "LC Alumni Network",
    interaction_notes:
      "Discussed summer project scope and intro to design team.",
  },
  {
    student_id: "lc-2024-002",
    contact_name: "Daniel Ferreira",
    employer_company: "Nike, Inc.",
    job_title: "UX Research Lead",
    last_contacted_date: "2026-06-18",
    connection_source: "LinkedIn",
    interaction_notes:
      "Follow up on informational interview, sent thank-you note.",
  },
  {
    student_id: "lc-2024-003",
    contact_name: "Sarah Whitmore",
    employer_company: "Portland General Electric",
    job_title: "Campus Recruiting Manager",
    last_contacted_date: "2026-06-28",
    connection_source: "Career Center Event",
    interaction_notes: "Met at Spring Internship Fair. Asked to connect in August.",
  },
  {
    student_id: "lc-2024-004",
    contact_name: "James Lim",
    employer_company: "Intel Corporation",
    job_title: "Data Engineering Manager",
    last_contacted_date: "2026-05-15",
    connection_source: "LC Alumni Network",
    interaction_notes: "Overdue follow-up, 54 days since last contact.",
  },
];

export const skills = [
  {
    student_id: "lc-2024-001",
    skill_name: "Project Management",
    proficiency_level: "Advanced",
    context: "Internship",
    date_added: "2026-06-15",
  },
  {
    student_id: "lc-2024-001",
    skill_name: "Public Speaking",
    proficiency_level: "Intermediate",
    context: "Campus Activity",
    date_added: "2025-10-02",
  },
  {
    student_id: "lc-2024-002",
    skill_name: "Qualitative Research",
    proficiency_level: "Advanced",
    context: "Study Abroad",
    date_added: "2026-02-10",
  },
  {
    student_id: "lc-2024-002",
    skill_name: "French (B2)",
    proficiency_level: "Intermediate",
    context: "Study Abroad",
    date_added: "2026-05-20",
  },
  {
    student_id: "lc-2024-003",
    skill_name: "Event Planning",
    proficiency_level: "Advanced",
    context: "Campus Activity",
    date_added: "2025-09-18",
  },
  {
    student_id: "lc-2024-004",
    skill_name: "Python",
    proficiency_level: "Intermediate",
    context: "Internship",
    date_added: "2026-06-12",
  },
  {
    student_id: "lc-2024-004",
    skill_name: "Data Visualization",
    proficiency_level: "Beginner",
    context: "Internship",
    date_added: "2026-07-01",
  },
];

// No source dataset was provided for resume/application tracking, so these
// are illustrative mock entries consistent with the rest of the profile.
export const resumeVersions = [
  {
    id: "res-1",
    name: "General / Career Fair",
    lastUpdated: "2026-06-20",
    targetRole: "General",
    status: "Up to date",
  },
  {
    id: "res-2",
    name: "Product Management Focus",
    lastUpdated: "2026-05-05",
    targetRole: "Product Management",
    status: "Needs review",
  },
];

export const applications = [
  {
    id: "app-1",
    company: "Adidas North America",
    role: "Product Marketing Intern",
    dateApplied: "2026-03-12",
    status: "Offer",
  },
  {
    id: "app-2",
    company: "Nike, Inc.",
    role: "UX Research Intern",
    dateApplied: "2026-04-02",
    status: "Interviewing",
  },
  {
    id: "app-3",
    company: "Portland General Electric",
    role: "Sustainability Analyst Intern",
    dateApplied: "2026-06-30",
    status: "Applied",
  },
  {
    id: "app-4",
    company: "Intel Corporation",
    role: "Data Engineering Intern",
    dateApplied: "2026-02-18",
    status: "Rejected",
  },
];
