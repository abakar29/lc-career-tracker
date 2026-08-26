import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Timeline from "./pages/Timeline";
import Connections from "./pages/Connections";
import Skills from "./pages/Skills";
import Resume from "./pages/Resume";
import CareerCenter from "./pages/CareerCenter";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";

const GUEST_KEY = "abuve:guest";

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isGuest = localStorage.getItem(GUEST_KEY) === "true";

  if (session === undefined && !isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-surface dark:bg-[#1A1919]">
        <p className="text-sm text-slate-500 dark:text-neutral-400">Loading...</p>
      </div>
    );
  }

  const isLoggedIn = isGuest || !!session;

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="experience" element={<Navigate to="/timeline" replace />} />
            <Route path="connections" element={<Connections />} />
            <Route path="network" element={<Navigate to="/connections" replace />} />
            <Route path="skills" element={<Skills />} />
            <Route path="resume" element={<Resume />} />
            <Route path="career-center" element={<CareerCenter />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      ) : (
        <Login />
      )}
    </BrowserRouter>
  );
}
