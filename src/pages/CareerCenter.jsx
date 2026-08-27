import { useState } from "react";
import { Calendar, Clock } from "lucide-react";

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
            selected === "dropin" ? "border-[#F36F21] dark:border-orange-400" : "border-[#F36F21]/40 dark:border-orange-400/30"
          }`}
        >
          <Clock className="h-7 w-7 text-slate-900 dark:text-[#F8F9FA]" aria-hidden="true" />
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-[#F8F9FA]">Drop-in Hours</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">Mon-Fri 2-4pm, no booking needed</p>
        </button>
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
                  className="bg-[#F36F21] dark:bg-orange-600 text-white hover:bg-orange-700 dark:hover:bg-orange-500 transition-colors"
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
