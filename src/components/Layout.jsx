import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Sparkles,
  FileText,
  Building2,
  Settings,
  Shield,
  Info,
  LogOut,
  Target,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { supabase } from "../supabaseClient";
import { useTheme } from "../context/ThemeContext";

const GUEST_KEY = "abuve:guest";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", mobileLabel: "Home", icon: LayoutDashboard, end: true },
  { to: "/timeline", label: "Timeline", icon: Clock },
  { to: "/experience", label: "Experience", icon: Briefcase },
  { to: "/network", label: "Network", icon: Users },
  { to: "/skills", label: "Skills", icon: Sparkles },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/career-center", label: "Career Center", mobileLabel: "Career", icon: Building2 },
];

const ABOUT_SECTIONS = [
  {
    icon: Briefcase,
    title: "Track Your Journey",
    description:
      "Log internships, study abroad, campus activities and every experience that builds your career story",
  },
  {
    icon: Users,
    title: "Build Your Network",
    description:
      "Keep track of mentors, alumni and recruiters with smart follow-up reminders so no connection goes cold",
  },
  {
    icon: Target,
    title: "Land Your Dream Role",
    description:
      "Optimize your resume for any job, identify skill gaps, and track applications all in one place",
  },
];

function navLinkClasses(isActive) {
  return [
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
    isActive
      ? "bg-brand-orange text-white font-bold"
      : "text-neutral-300 font-medium hover:bg-white/10 hover:text-white",
  ].join(" ");
}

function ThemeToggleRow() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-200 hover:bg-white/10 hover:text-white transition-colors"
    >
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      {isDark ? "Dark mode" : "Light mode"}
      <span
        aria-hidden="true"
        className={`ml-auto relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
          isDark ? "bg-brand-orange" : "bg-white/20"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            isDark ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

function MobileThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="absolute right-4 flex h-7 w-7 items-center justify-center rounded-full text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export default function Layout() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [classYear, setClassYear] = useState(
    () => localStorage.getItem("abuve:profile:classyear") || "2029"
  );
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? "");
    });
  }, []);

  useEffect(() => {
    const handler = () => setClassYear(localStorage.getItem('abuve:profile:classyear') || '2029');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    const saved = localStorage.getItem(`profile_photo_${userEmail}`);
    setPhotoUrl(saved || null);
  }, [userEmail]);

  const userInitial = userEmail ? userEmail[0].toUpperCase() : "";

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Sign out error (guest mode):', error);
    } finally {
      // Always clear local storage and redirect regardless of auth state
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('abuve:')) localStorage.removeItem(key);
      });
      window.location.href = '/login';
    }
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPhotoUrl(dataUrl);
      if (userEmail) {
        localStorage.setItem(`profile_photo_${userEmail}`, dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  return (
    <div className="min-h-screen bg-brand-surface dark:bg-[#1A1919] transition-colors md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-brand-black">
        <div className="flex flex-col items-center gap-2 px-5 py-6 border-b border-white/10">
          <img src="/lc-logo.png" alt="" className="h-12 w-12 object-contain" />
          <p className="text-white font-semibold text-sm text-center leading-tight">
            Lewis &amp; Clark College
          </p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => navLinkClasses(isActive)}
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div ref={profileRef} className="relative px-5 py-5 border-t border-white/10">
          {profileOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 rounded-lg bg-neutral-900 border border-white/10 shadow-lg overflow-hidden">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-white truncate">{userEmail}</p>
                <p className="text-xs text-neutral-400">Class of {classYear}</p>
              </div>
              <div className="border-t border-white/10" />
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/admin");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  Faculty View
                  <span className="ml-auto text-xs text-neutral-500">Career Center</span>
                </button>
              </div>
              <div className="border-t border-white/10" />
              <div className="py-1">
                <ThemeToggleRow />
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    setAboutOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Info className="h-4 w-4" />
                  About Abuve
                </button>
              </div>
              <div className="border-t border-white/10" />
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <div
            role="button"
            tabIndex={0}
            onClick={() => setProfileOpen((open) => !open)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setProfileOpen((open) => !open);
              }
            }}
            className="w-full flex items-center gap-3 rounded-lg -mx-2 px-2 py-1.5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              aria-label="Change profile photo"
              className="group relative h-9 w-9 flex-shrink-0 rounded-full overflow-hidden"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-orange-700 flex items-center justify-center text-sm font-semibold text-white">
                  {userInitial}
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Edit
              </div>
            </button>
            <div className="min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">{userEmail}</p>
              <p className="text-xs text-neutral-400">Class of 2029</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-20 relative flex items-center justify-center gap-2 bg-brand-black px-4 py-2.5">
        <img src="/lc-logo.png" alt="" className="h-8 w-8 object-contain" />
        <span className="text-white font-semibold text-sm">Lewis &amp; Clark College</span>
        <MobileThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 md:pl-64 pb-20 md:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-brand-black border-t border-white/10 flex">
        {NAV_ITEMS.map(({ to, label, mobileLabel, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                isActive ? "text-brand-orange" : "text-neutral-400",
              ].join(" ")
            }
          >
            <Icon className="h-5 w-5" />
            <span className="max-w-full truncate whitespace-nowrap">{mobileLabel ?? label}</span>
          </NavLink>
        ))}
      </nav>

      {aboutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setAboutOpen(false)}
        >
          <div
            className="w-full bg-white dark:bg-[#232428] dark:border dark:border-white/10 rounded-2xl shadow-xl p-6"
            style={{ maxWidth: "500px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src="/lc-logo.png"
                alt=""
                className="h-10 w-10 object-contain mb-2"
              />
              <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8F9FA]">Abuve</h2>
              <p className="text-sm text-slate-500 mt-0.5 dark:text-neutral-400">
                Lewis &amp; Clark College Career Platform
              </p>
            </div>

            <div className="space-y-5 mb-6">
              {ABOUT_SECTIONS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-[#F8F9FA]">{title}</p>
                    <p className="text-sm text-slate-500 mt-0.5 dark:text-neutral-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center border-t border-slate-100 dark:border-white/10 pt-5">
              <p className="text-xs text-slate-400 mb-4 dark:text-neutral-500">
                Built exclusively for Lewis &amp; Clark College students
              </p>
              <button
                type="button"
                onClick={() => setAboutOpen(false)}
                className="rounded-lg px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#EA580C" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
