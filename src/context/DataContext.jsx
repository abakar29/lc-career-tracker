import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  profile as seedProfile,
  experiences as seedExperiences,
  networkConnections as seedNetworkConnections,
  skills as seedSkills,
  resumeVersions as seedResumeVersions,
  applications as seedApplications,
} from "../data/mockData";
import { loadData, saveData, loadOnboarded, saveOnboarded, makeId } from "../lib/store";
import { LC_MAJORS } from "../data/academics";

function withIds(list) {
  return list.map((item) => (item.id ? item : { ...item, id: makeId() }));
}

function seed() {
  return {
    profile: { ...seedProfile, targetCareerPath: null },
    experiences: withIds(seedExperiences),
    networkConnections: withIds(seedNetworkConnections),
    skills: withIds(seedSkills),
    resumeVersions: withIds(seedResumeVersions),
    applications: withIds(seedApplications),
  };
}

// Backfills fields on data persisted before they existed (or corrupted by a
// prior crash mid-write), so stale localStorage data can never crash the app.
function normalizeData(rawData) {
  const data = rawData ?? {};
  const profile = data.profile ?? {};
  const legacyMajor = profile.major;
  return {
    ...data,
    profile: {
      ...profile,
      primaryMajor: profile.primaryMajor ?? (LC_MAJORS.includes(legacyMajor) ? legacyMajor : ""),
      secondaryMajor: profile.secondaryMajor ?? null,
      minors: Array.isArray(profile.minors) ? profile.minors : [],
    },
    experiences: Array.isArray(data.experiences) ? data.experiences : [],
    networkConnections: Array.isArray(data.networkConnections) ? data.networkConnections : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    resumeVersions: Array.isArray(data.resumeVersions) ? data.resumeVersions : [],
    applications: Array.isArray(data.applications) ? data.applications : [],
  };
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(() => normalizeData(loadData(seed)));
  const [onboarded, setOnboarded] = useState(() => loadOnboarded());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const completeOnboarding = useCallback(() => {
    saveOnboarded(true);
    setOnboarded(true);
  }, []);

  const setTargetCareerPath = useCallback((path) => {
    setData((d) => ({ ...d, profile: { ...d.profile, targetCareerPath: path } }));
  }, []);

  const updateAcademics = useCallback((patch) => {
    setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }));
  }, []);

  const makeCollectionActions = useCallback((key) => ({
    add: (entry) =>
      setData((d) => {
        const withId = { ...entry, id: makeId(), student_id: d.profile.studentId };
        return { ...d, [key]: [...d[key], withId] };
      }),
    update: (id, patch) =>
      setData((d) => ({
        ...d,
        [key]: d[key].map((item) => (item.id === id ? { ...item, ...patch } : item)),
      })),
    remove: (id) =>
      setData((d) => ({ ...d, [key]: d[key].filter((item) => item.id !== id) })),
  }), []);

  const experienceActions = useMemo(() => makeCollectionActions("experiences"), [makeCollectionActions]);
  const contactActions = useMemo(() => makeCollectionActions("networkConnections"), [makeCollectionActions]);
  const skillActions = useMemo(() => makeCollectionActions("skills"), [makeCollectionActions]);

  const value = useMemo(
    () => ({
      profile: data.profile,
      experiences: data.experiences,
      networkConnections: data.networkConnections,
      skills: data.skills,
      resumeVersions: data.resumeVersions,
      applications: data.applications,
      onboarded,
      completeOnboarding,
      setTargetCareerPath,
      updateAcademics,
      addExperience: experienceActions.add,
      updateExperience: experienceActions.update,
      deleteExperience: experienceActions.remove,
      addContact: contactActions.add,
      updateContact: contactActions.update,
      deleteContact: contactActions.remove,
      addSkill: skillActions.add,
      updateSkill: skillActions.update,
      deleteSkill: skillActions.remove,
    }),
    [
      data,
      onboarded,
      completeOnboarding,
      setTargetCareerPath,
      updateAcademics,
      experienceActions,
      contactActions,
      skillActions,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
