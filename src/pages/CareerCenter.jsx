import { useState } from "react";
import { Calendar, Clock, Briefcase, Users, ExternalLink, Search } from "lucide-react";

const JOB_BOARDS = [
  { label: "L&C Job Board", icon: Briefcase, url: "https://careercenter.lclark.edu/jobs/" },
  { label: "Handshake", icon: Users, url: "https://joinhandshake.com" },
  { label: "LinkedIn Jobs", icon: ExternalLink, url: "https://linkedin.com/jobs" },
  { label: "Indeed", icon: Search, url: "https://indeed.com" },
];

const UPCOMING_EVENTS = [
  {
    title: "Career Connections with Alumni",
    date: "Aug 12, 2026 · 3:00 PM",
    description: "L&C alumni return to campus to share advice on careers and internships.",
    image: "/event-alumni-connections.jpg",
  },
  {
    title: "Behind the Swoosh at Nike HQ",
    date: "Aug 19, 2026 · 10:00 AM",
    description: "Exclusive tour of Nike headquarters with L&C alumni working there.",
    image: "/event-nike-hq.jpg",
  },
  {
    title: "Summer Internship Showcase",
    date: "Aug 26, 2026 · 2:00 PM",
    description: "Students present their summer internship experiences to the campus community.",
    image: "/event-internship-showcase.jpg",
  },
];

export default function CareerCenter() {
  const [selected, setSelected] = useState(null);
  const [rsvped, setRsvped] = useState({});

  function toggleRsvp(title) {
    setRsvped((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <div>
      <div
        className="relative h-48 overflow-hidden md:h-[360px]"
        style={{ borderRadius: "16px" }}
      >
        <img
          src="/career-center.jpg"
          alt="Lewis and Clark College Career Center"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-5 pt-16">
          <h1 className="text-2xl font-bold text-white">Lewis and Clark College Career Center</h1>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => window.open("https://careerdevelopmentappt.youcanbook.me", "_blank")}
          className="rounded-2xl p-6 text-left transition-colors border-2 border-transparent"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <Calendar className="h-7 w-7 text-white" aria-hidden="true" />
          <p className="mt-3 text-lg font-semibold text-white">Book Appointment</p>
          <p className="mt-1 text-sm text-neutral-300">Schedule a 30 or 60 min session</p>
        </button>

        <button
          type="button"
          onClick={() => setSelected("dropin")}
          className={`rounded-2xl bg-white dark:bg-[#232428] p-6 text-left transition-colors border-2 ${
            selected === "dropin" ? "border-[#EA580C] dark:border-orange-400" : "border-[#EA580C]/40 dark:border-orange-400/30"
          }`}
        >
          <Clock className="h-7 w-7 text-slate-900 dark:text-[#F8F9FA]" aria-hidden="true" />
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-[#F8F9FA]">Drop-in Hours</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">Mon-Fri 2-4pm, no booking needed</p>
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#B85A12]">
          Job Boards
        </p>
        <h2 className="mt-2 text-lg font-bold text-[#111827]">Find your next opportunity</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Browse curated job boards used by L&amp;C students
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {JOB_BOARDS.map(({ label, icon: Icon, url }) => (
            <button
              key={label}
              type="button"
              onClick={() => window.open(url, "_blank")}
              className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827] transition-colors hover:border-[#E87722]"
            >
              <Icon className="h-4 w-4 text-[#E87722]" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
          Upcoming Events
        </p>
        <div className="mt-3 grid grid-cols-3 gap-4">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.title}
              className="overflow-hidden bg-white dark:bg-[#232428]"
              style={{ borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full object-cover"
                style={{ height: "140px" }}
              />
              <div style={{ padding: "16px" }}>
                <p
                  className="text-slate-900 dark:text-[#F8F9FA]"
                  style={{ fontSize: "15px", fontWeight: 600 }}
                >
                  {event.title}
                </p>
                <p
                  className="text-slate-500 dark:text-neutral-400"
                  style={{ fontSize: "12px", marginTop: "4px" }}
                >
                  {event.date}
                </p>
                <p
                  className="text-slate-500 dark:text-neutral-400"
                  style={{
                    fontSize: "13px",
                    marginTop: "8px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {event.description}
                </p>
                <button
                  type="button"
                  onClick={() => toggleRsvp(event.title)}
                  className="bg-[#EA580C] dark:bg-orange-600 text-white hover:bg-orange-700 dark:hover:bg-orange-500 transition-colors"
                  style={{
                    marginTop: "12px",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    fontSize: "13px",
                  }}
                >
                  {rsvped[event.title] ? "Registered ✓" : "RSVP"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected === "dropin" && (
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#232428] p-4 text-sm text-slate-600 dark:text-neutral-400">
          Drop-in hours Mon-Fri 2-4pm. Room 270, Fowler Student Center. Email: careers@lclark.edu
        </div>
      )}
    </div>
  );
}
