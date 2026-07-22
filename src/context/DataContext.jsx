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

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(() => loadData(seed));
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
    [data, onboarded, completeOnboarding, setTargetCareerPath, experienceActions, contactActions, skillActions]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
