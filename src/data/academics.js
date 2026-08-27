// Official Lewis & Clark College undergraduate academic catalog, used to
// populate major/minor selection everywhere a student declares their program.

export const LC_MAJORS = [
  "Art (Studio)",
  "Art History",
  "Biochemistry and Molecular Biology",
  "Biology",
  "Chemistry",
  "Classics",
  "Computer Science",
  "Computer Science and Mathematics",
  "Data Science",
  "Economics",
  "English",
  "Environmental Studies",
  "French Studies",
  "German Studies",
  "Hispanic Studies",
  "History",
  "International Affairs",
  "Mathematics and Statistics",
  "Music",
  "Philosophy",
  "Physics",
  "Political Science",
  "Psychology",
  "Religious Studies",
  "Rhetoric and Media Studies",
  "Sociology and Anthropology",
  "Theatre",
  "World Languages",
];

export const LC_MINORS = [
  "Art and Art History",
  "Artificial Intelligence",
  "Asian Studies",
  "Chemistry",
  "Chinese",
  "Classics",
  "Computer Science",
  "Cybersecurity",
  "Dance",
  "Data Science",
  "Earth System Science",
  "Economics",
  "Education",
  "English",
  "Entrepreneurial Leadership and Innovation",
  "Environmental Studies",
  "Ethnic Studies",
  "French Studies",
  "Gender Studies",
  "German Studies",
  "Health Studies",
  "Hispanic Studies",
  "History",
  "Japanese",
  "Latin American and Latino Studies",
  "Law and Policy",
  "Mathematics and Statistics",
  "Middle East and North African Studies",
  "Music",
  "Neuroscience",
  "Philosophy",
  "Physics",
  "Political Economy",
  "Political Science",
  "Religious Studies",
  "Rhetoric and Media Studies",
  "Russian",
  "Theatre",
];

// Every L&C major in this catalog is a BA program, so the degree prefix is
// fixed rather than stored per-student.
export function formatAcademicSummary({ primaryMajor, secondaryMajor, minors }) {
  if (!primaryMajor) return "";

  const majorPart = secondaryMajor
    ? `BA in ${primaryMajor} & ${secondaryMajor}`
    : `BA in ${primaryMajor}`;

  if (minors && minors.length > 0) {
    return `${majorPart} | Minors in ${minors.join(", ")}`;
  }
  return majorPart;
}
