import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, Users, Sparkles, FileText, Building2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/experience", label: "Experience", icon: Briefcase },
  { to: "/network", label: "Network", icon: Users },
  { to: "/skills", label: "Skills", icon: Sparkles },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/career-center", label: "Career Center", icon: Building2 },
];

function navLinkClasses(isActive) {
  return [
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-orange-700 text-white"
      : "text-neutral-300 hover:bg-white/10 hover:text-white",
  ].join(" ");
}

export default function Layout() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#F5F4F2] md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-neutral-950">
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
        <div className="flex items-center gap-3 px-5 py-5 border-t border-white/10">
          <img
            src="/Abu_Bakar.jpeg"
            alt=""
            className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">Abu Bakar</p>
            <p className="text-xs text-neutral-400">Class of 2029</p>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-center gap-2 bg-neutral-950 px-4 py-2.5">
        <img src="/lc-logo.png" alt="" className="h-8 w-8 object-contain" />
        <span className="text-white font-semibold text-sm">Lewis &amp; Clark College</span>
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
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-neutral-950 border-t border-white/10 flex">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors",
                isActive ? "text-orange-400" : "text-neutral-400",
              ].join(" ")
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
