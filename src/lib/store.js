const STORAGE_KEY = "pioneerpath:data:v1";
const ONBOARDED_KEY = "pioneerpath:onboarded";

export function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadData(seed) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to seed
  }
  return seed();
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable (private mode / quota): data stays in-memory for the session
  }
}

export function loadOnboarded() {
  try {
    return localStorage.getItem(ONBOARDED_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveOnboarded(value) {
  try {
    localStorage.setItem(ONBOARDED_KEY, value ? "1" : "0");
  } catch {
    // ignore
  }
}
