import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Experience from "./pages/Experience";
import Network from "./pages/Network";
import Skills from "./pages/Skills";
import Resume from "./pages/Resume";
import CareerCenter from "./pages/CareerCenter";
import BookAppointment from "./pages/BookAppointment";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";

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

  if (session === undefined) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F8F9FB" }}
      >
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="experience" element={<Experience />} />
          <Route path="network" element={<Network />} />
          <Route path="skills" element={<Skills />} />
          <Route path="resume" element={<Resume />} />
          <Route path="career-center" element={<CareerCenter />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
