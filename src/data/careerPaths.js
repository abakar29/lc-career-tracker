// Reference skill maps used for Skill Gap Detection on the Skills page.
// Each path lists the skills L&C's Career Center most commonly flags as
// baseline-competitive for that track. v1 / prototype list.

export const careerPaths = [
  // Tech & Data
  {
    id: "software-engineering",
    label: "Software Engineering",
    group: "Tech & Data",
    requiredSkills: ["Python", "JavaScript", "Git", "Data Structures", "Debugging", "Testing"],
  },
  {
    id: "cybersecurity-infosec",
    label: "Cybersecurity & InfoSec",
    group: "Tech & Data",
    requiredSkills: [
      "Network Security",
      "Risk Assessment",
      "Python",
      "Linux Administration",
      "Incident Response",
      "Security Auditing",
    ],
  },
  {
    id: "data-science-analytics",
    label: "Data Science & Analytics",
    group: "Tech & Data",
    requiredSkills: ["Python", "Data Visualization", "Statistics", "SQL", "Data Analysis", "Excel"],
  },
  {
    id: "ux-design-research",
    label: "UX / Design Research",
    group: "Tech & Data",
    requiredSkills: [
      "Qualitative Research",
      "User Research",
      "Wireframing",
      "Usability Testing",
      "Figma",
      "Public Speaking",
    ],
  },
  {
    id: "product-management",
    label: "Product Management",
    group: "Tech & Data",
    requiredSkills: [
      "Project Management",
      "Data Analysis",
      "Public Speaking",
      "User Research",
      "Prioritization",
      "Cross-functional Collaboration",
    ],
  },

  // Environment & Policy
  {
    id: "environmental-policy-sustainability",
    label: "Environmental Policy & Sustainability",
    group: "Environment & Policy",
    requiredSkills: [
      "Policy Analysis",
      "Data Analysis",
      "Public Speaking",
      "Grant Writing",
      "Environmental Regulations",
      "Stakeholder Engagement",
    ],
  },
  {
    id: "public-service-government",
    label: "Public Service & Government",
    group: "Environment & Policy",
    requiredSkills: [
      "Policy Analysis",
      "Public Speaking",
      "Community Outreach",
      "Grant Writing",
      "Budget Analysis",
      "Constituent Services",
    ],
  },
  {
    id: "law-legal-services",
    label: "Law & Legal Services",
    group: "Environment & Policy",
    requiredSkills: [
      "Legal Research",
      "Legal Writing",
      "Public Speaking",
      "Critical Thinking",
      "Case Analysis",
      "Client Communication",
    ],
  },

  // Science & Research
  {
    id: "biotechnology-lab-research",
    label: "Biotechnology & Lab Research",
    group: "Science & Research",
    requiredSkills: [
      "Lab Techniques",
      "Data Analysis",
      "Scientific Writing",
      "Statistics",
      "Research Design",
      "Regulatory Compliance",
    ],
  },
  {
    id: "healthcare-pre-med",
    label: "Healthcare & Pre-Med Track",
    group: "Science & Research",
    requiredSkills: [
      "Patient Care",
      "Medical Terminology",
      "Data Analysis",
      "Clinical Research",
      "Public Speaking",
      "Bedside Manner",
    ],
  },

  // Business & Communications
  {
    id: "marketing-communications",
    label: "Marketing & Communications",
    group: "Business & Communications",
    requiredSkills: [
      "Public Speaking",
      "Content Writing",
      "Event Planning",
      "Social Media Strategy",
      "Data Analysis",
      "Brand Storytelling",
    ],
  },
  {
    id: "consulting-strategy",
    label: "Consulting & Business Strategy",
    group: "Business & Communications",
    requiredSkills: [
      "Project Management",
      "Data Analysis",
      "Public Speaking",
      "Excel",
      "Client Communication",
      "Problem Solving",
    ],
  },
  {
    id: "higher-education-student-affairs",
    label: "Higher Education & Student Affairs",
    group: "Business & Communications",
    requiredSkills: [
      "Event Planning",
      "Public Speaking",
      "Community Outreach",
      "Program Management",
      "Advising",
      "Conflict Resolution",
    ],
  },
  {
    id: "global-affairs-diplomacy",
    label: "Global Affairs & Diplomacy",
    group: "Business & Communications",
    requiredSkills: [
      "Public Speaking",
      "Policy Analysis",
      "Cross-cultural Communication",
      "Foreign Language",
      "Negotiation",
      "Research",
    ],
  },
];

export const careerPathGroups = [...new Set(careerPaths.map((p) => p.group))];

export function getMissingSkills(pathId, loggedSkillNames) {
  const path = careerPaths.find((p) => p.id === pathId);
  if (!path) return [];
  const have = new Set(loggedSkillNames.map((s) => s.trim().toLowerCase()));
  return path.requiredSkills.filter((skill) => !have.has(skill.toLowerCase()));
}
