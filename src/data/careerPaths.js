// Reference skill maps used for Skill Gap Detection on the Skills page.
// Each path lists the skills L&C's Career Center most commonly flags as
// baseline-competitive for that track.

export const careerPaths = [
  {
    id: "product-management",
    label: "Product Management",
    requiredSkills: [
      "Project Management",
      "Data Analysis",
      "Public Speaking",
      "User Research",
      "Prioritization",
      "Cross-functional Collaboration",
    ],
  },
  {
    id: "ux-design-research",
    label: "UX / Design Research",
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
    id: "data-science-analytics",
    label: "Data Science & Analytics",
    requiredSkills: [
      "Python",
      "Data Visualization",
      "Statistics",
      "SQL",
      "Data Analysis",
      "Excel",
    ],
  },
  {
    id: "software-engineering",
    label: "Software Engineering",
    requiredSkills: [
      "Python",
      "JavaScript",
      "Git",
      "Data Structures",
      "Debugging",
      "Testing",
    ],
  },
  {
    id: "marketing-communications",
    label: "Marketing & Communications",
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
    requiredSkills: [
      "Project Management",
      "Data Analysis",
      "Public Speaking",
      "Excel",
      "Client Communication",
      "Problem Solving",
    ],
  },
];

export function getMissingSkills(pathId, loggedSkillNames) {
  const path = careerPaths.find((p) => p.id === pathId);
  if (!path) return [];
  const have = new Set(loggedSkillNames.map((s) => s.trim().toLowerCase()));
  return path.requiredSkills.filter((skill) => !have.has(skill.toLowerCase()));
}
