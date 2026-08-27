// Deterministic keyword-matching helpers for the "Resume job fit" feature.
// Zero-dependency, pure functions only (no React) beyond the curated skill list.
import { careerPaths } from "../data/careerPaths";

// ---------------------------------------------------------------------------
// Internal helpers (not exported)
// ---------------------------------------------------------------------------

// Escape regex special characters so arbitrary strings can be dropped into a
// RegExp source safely.
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary test, case-insensitive. Plain `.includes()` false-positives
// on substrings (e.g. "art" inside "chart"), so every match here is anchored
// with \b...\b instead.
function isWordBoundaryMatch(phrase, textLower) {
  const re = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "i");
  return re.test(textLower);
}

// Count non-overlapping, word-boundary-anchored occurrences of `needle`
// inside `haystackLower`.
function countOccurrences(needle, haystackLower) {
  const re = new RegExp(`\\b${escapeRegExp(needle)}\\b`, "gi");
  const matches = haystackLower.match(re);
  return matches ? matches.length : 0;
}

// Replace -, /, ,, ; with a single space so "data-analysis" still matches the
// phrase "data analysis".
function normalizeSeparators(text) {
  return text.replace(/[-/,;]/g, " ");
}

// Mask every word-boundary occurrence of `phrase` inside `text` with spaces
// of the same length, so it's excluded from downstream single-word
// tokenization without shifting character offsets.
function maskPhrase(text, phrase) {
  const re = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "gi");
  return text.replace(re, (match) => " ".repeat(match.length));
}

// Order-preserving de-duplication.
function dedupe(items) {
  return [...new Set(items)];
}

const STOPWORDS = new Set([
  "a", "about", "after", "again", "all", "am", "an", "and", "any", "are",
  "as", "at", "be", "because", "been", "before", "being", "below", "between",
  "both", "but", "by", "can", "did", "do", "does", "doing", "down", "during",
  "each", "few", "for", "from", "further", "had", "has", "have", "having",
  "he", "her", "here", "hers", "herself", "him", "himself", "his", "how",
  "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me",
  "more", "most", "my", "myself", "no", "nor", "not", "now", "of", "off",
  "on", "once", "only", "or", "other", "our", "ours", "ourselves", "out",
  "over", "own", "same", "she", "should", "so", "some", "such", "than",
  "that", "the", "their", "theirs", "them", "themselves", "then", "there",
  "these", "they", "this", "those", "through", "to", "too", "under",
  "until", "up", "very", "was", "we", "were", "what", "when", "where",
  "which", "while", "who", "whom", "why", "will", "with", "you", "your",
  "yours", "yourself", "yourselves",
]);

// ---------------------------------------------------------------------------
// Exported API
// ---------------------------------------------------------------------------

export function extractKeywords(jobDescriptionText, { maxKeywords = 15 } = {}) {
  const normalized = normalizeSeparators(String(jobDescriptionText || "").toLowerCase());

  const phraseBank = dedupe(
    careerPaths
      .flatMap((p) => p.requiredSkills)
      .map((skill) => normalizeSeparators(skill.toLowerCase()))
  );

  const phraseHits = phraseBank.filter((phrase) => isWordBoundaryMatch(phrase, normalized));

  // Mask matched phrase spans before tokenizing so, e.g., a "data analysis"
  // phrase hit doesn't also spawn redundant "data" / "analysis" word hits.
  // Mask longest phrases first so a shorter phrase that happens to be a
  // whole-word substring of a longer one (e.g. "research" vs "user research")
  // can't leave a stray fragment behind depending on phraseBank ordering.
  const maskOrder = [...phraseHits].sort((a, b) => b.length - a.length);
  let maskedText = normalized;
  for (const phrase of maskOrder) {
    maskedText = maskPhrase(maskedText, phrase);
  }

  const words = dedupe(
    maskedText
      .replace(/[^a-z0-9-\s]/g, " ")
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length >= 3 && !STOPWORDS.has(token))
  );

  const candidates = [
    ...phraseHits.map((p) => ({ keyword: p, isPhrase: true })),
    ...words.map((w) => ({ keyword: w, isPhrase: false })),
  ];

  candidates.sort((a, b) => {
    const countA = countOccurrences(a.keyword, normalized);
    const countB = countOccurrences(b.keyword, normalized);
    if (countB !== countA) return countB - countA;
    if (a.isPhrase !== b.isPhrase) return a.isPhrase ? -1 : 1;
    return b.keyword.length - a.keyword.length;
  });

  return candidates.slice(0, maxKeywords).map((c) => c.keyword);
}

export function buildStudentCorpus({ experiences = [], skills = [] } = {}) {
  const experienceText = (experiences || [])
    .map((exp) => {
      const organization = exp?.organization_name || "";
      const type = exp?.experience_type || "";
      const description = exp?.role_description || "";
      return [type, organization, description].filter(Boolean).join(" ");
    })
    .join(" ");

  const skillsText = (skills || [])
    .map((skill) => {
      const name = skill?.skill_name || "";
      const description = skill?.resume_description || "";
      return [name, description].filter(Boolean).join(" ");
    })
    .join(" ");

  const combined = `${experienceText} ${skillsText}`.toLowerCase();
  return normalizeSeparators(combined).replace(/\s+/g, " ").trim();
}

// Deterministic (non-AI) job fit analysis: extracts candidate keywords from
// the job description, checks which ones already show up in the student's
// logged experiences/skills, and returns a plain-language summary.
export function computeJobFitAnalysis({ jobDescription, experiences, skills } = {}) {
  const keywords = extractKeywords(jobDescription);
  const corpus = buildStudentCorpus({ experiences, skills });

  const matched = keywords.filter((keyword) => isWordBoundaryMatch(keyword, corpus));
  const missing = keywords.filter((keyword) => !isWordBoundaryMatch(keyword, corpus));

  const keywordCount = keywords.length;
  const score = keywordCount === 0 ? 0 : Math.round((matched.length / keywordCount) * 100);

  const suggestions =
    missing.length > 0
      ? [
          `Work ${missing
            .slice(0, 3)
            .map((keyword) => `"${keyword}"`)
            .join(", ")} into your experience bullets.`,
          "Quantify results with specific metrics and outcomes where possible.",
          missing.length > 3
            ? `Also look for natural ways to mention: ${missing.slice(3).join(", ")}.`
            : "Review your resume for any other natural opportunities to include these terms.",
        ]
      : [
          "Great keyword coverage — quantify results with specific metrics and outcomes where possible.",
          "Order your bullets so the most relevant experience appears first.",
        ];

  return { score, matched, missing, suggestions, keywordCount };
}
