import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui";

const BOOKING_STEPS = ["Duration", "Advisor", "Date"];

const ADVISORS = [
  { id: "sarah", name: "Sarah Johnson", role: "Career Advisor", initials: "SJ", bg: "#E87722" },
  { id: "emily", name: "Emily Carter", role: "Resume Specialist", initials: "EC", bg: "#1a1a1a" },
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

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_SLOTS = ["9:30 AM", "11:00 AM", "2:00 PM", "4:00 PM"];
const TODAY = new Date(2026, 6, 21);
const CALENDAR_YEAR = 2026;
const CALENDAR_MONTH = 6;

function isWeekend(dayOfWeek) {
  return dayOfWeek === 0 || dayOfWeek === 6;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function advisorLabel(advisorId) {
  return ADVISORS.find((a) => a.id === advisorId)?.name ?? "No Preference";
}

export default function CareerCenter() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [duration, setDuration] = useState("30");
  const [advisorId, setAdvisorId] = useState("none");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [rsvped, setRsvped] = useState({});

  function toggleRsvp(title) {
    setRsvped((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  const firstWeekday = new Date(CALENDAR_YEAR, CALENDAR_MONTH, 1).getDay();
  const daysInMonth = new Date(CALENDAR_YEAR, CALENDAR_MONTH + 1, 0).getDate();
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(CALENDAR_YEAR, CALENDAR_MONTH, i + 1)),
  ];

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
          onClick={() => navigate("/book-appointment")}
          className={`rounded-2xl p-6 text-left transition-colors border-2 ${
            selected === "book" ? "border-[#E87722]" : "border-transparent"
          }`}
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <Calendar className="h-7 w-7 text-white" aria-hidden="true" />
          <p className="mt-3 text-lg font-semibold text-white">Book Appointment</p>
          <p className="mt-1 text-sm text-neutral-300">Schedule a 30 or 60 min session</p>
        </button>

        <button
          type="button"
          onClick={() => setSelected("dropin")}
          className={`rounded-2xl bg-white p-6 text-left transition-colors border-2 ${
            selected === "dropin" ? "border-[#E87722]" : "border-[#E87722]/40"
          }`}
        >
          <Clock className="h-7 w-7 text-slate-900" aria-hidden="true" />
          <p className="mt-3 text-lg font-semibold text-slate-900">Drop-in Hours</p>
          <p className="mt-1 text-sm text-slate-500">Mon-Fri 2-4pm, no booking needed</p>
        </button>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Upcoming Events
        </p>
        <div className="mt-3 grid grid-cols-3 gap-4">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.title}
              className="overflow-hidden bg-white"
              style={{ borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full object-cover"
                style={{ height: "140px" }}
              />
              <div style={{ padding: "16px" }}>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827" }}>
                  {event.title}
                </p>
                <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
                  {event.date}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6B7280",
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
                  style={{
                    marginTop: "12px",
                    background: "#E87722",
                    color: "#ffffff",
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

      {selected === "book" && (
        <div className="mt-6">
          {confirmed ? (
            <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden="true" />
              <p className="mt-3 text-lg font-semibold text-emerald-800">
                Appointment confirmed!
              </p>
              <p className="mt-1 text-sm text-emerald-700">
                Confirmation sent to careers@lclark.edu
              </p>
            </div>
          ) : (
            <>
              <div
                className="grid items-start gap-y-1.5"
                style={{ gridTemplateColumns: "auto 1fr auto 1fr auto" }}
              >
                {BOOKING_STEPS.map((label, i) => {
                  const num = i + 1;
                  const isActive = num === bookingStep;
                  return [
                    <div
                      key={`circle-${label}`}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        isActive ? "text-white" : "bg-slate-200 text-slate-500"
                      }`}
                      style={isActive ? { backgroundColor: "#E87722" } : undefined}
                    >
                      {num}
                    </div>,
                    num < BOOKING_STEPS.length && (
                      <div key={`line-${label}`} className="h-px bg-slate-200" />
                    ),
                  ];
                })}

                {BOOKING_STEPS.map((label, i) => {
                  const num = i + 1;
                  return [
                    <span
                      key={`label-${label}`}
                      className={`text-center text-xs font-medium ${
                        num === bookingStep ? "text-slate-700" : "text-slate-500"
                      }`}
                    >
                      {label}
                    </span>,
                    num < BOOKING_STEPS.length && <span key={`label-gap-${label}`} />,
                  ];
                })}
              </div>

              {bookingStep === 1 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Select Duration
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setDuration("30")}
                      className="rounded-xl border-2 p-5 text-left transition-colors"
                      style={
                        duration === "30"
                          ? { borderColor: "#E87722", backgroundColor: "#FEF0E6" }
                          : { borderColor: "#e2e8f0", backgroundColor: "#fff" }
                      }
                    >
                      <Clock className="h-6 w-6 text-slate-700" aria-hidden="true" />
                      <p className="mt-3 text-sm font-semibold text-slate-900">30 Minutes</p>
                      <p className="mt-1 text-sm text-slate-500">Quick questions, resume review</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDuration("60")}
                      className="rounded-xl border-2 p-5 text-left transition-colors"
                      style={
                        duration === "60"
                          ? { borderColor: "#E87722", backgroundColor: "#FEF0E6" }
                          : { borderColor: "#e2e8f0", backgroundColor: "#fff" }
                      }
                    >
                      <Clock className="h-6 w-6 text-slate-700" aria-hidden="true" />
                      <p className="mt-3 text-sm font-semibold text-slate-900">60 Minutes</p>
                      <p className="mt-1 text-sm text-slate-500">In-depth career planning</p>
                    </button>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <Button type="button" onClick={() => setBookingStep(2)}>
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Choose Advisor
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    {ADVISORS.map((advisor) => {
                      const isSelected = advisorId === advisor.id;
                      return (
                        <button
                          key={advisor.id}
                          type="button"
                          onClick={() => setAdvisorId(advisor.id)}
                          className="rounded-xl border-2 p-5 text-left transition-colors"
                          style={
                            isSelected
                              ? { borderColor: "#E87722", backgroundColor: "#FEF0E6" }
                              : { borderColor: "#e2e8f0", backgroundColor: "#fff" }
                          }
                        >
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                            style={{ backgroundColor: advisor.bg }}
                          >
                            {advisor.initials}
                          </div>
                          <p className="mt-3 text-sm font-semibold text-slate-900">{advisor.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{advisor.role}</p>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdvisorId("none")}
                    className="mt-4 w-full rounded-xl border-2 p-4 text-left transition-colors"
                    style={
                      advisorId === "none"
                        ? { borderColor: "#E87722", backgroundColor: "#FEF0E6" }
                        : { borderColor: "#e2e8f0", backgroundColor: "#fff" }
                    }
                  >
                    <p className="text-sm font-semibold text-slate-900">No Preference</p>
                    <p className="mt-1 text-sm text-slate-500">
                      We'll match you with the first available advisor
                    </p>
                  </button>
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                    >
                      ← Back
                    </button>
                    <Button type="button" onClick={() => setBookingStep(3)}>
                      Next →
                    </Button>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pick a Date
                  </p>
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">July 2026</p>
                    <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-xs font-medium text-slate-400">
                      {WEEKDAY_LABELS.map((label) => (
                        <div key={label}>{label}</div>
                      ))}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-1">
                      {calendarCells.map((date, i) => {
                        if (!date) return <div key={`empty-${i}`} />;
                        const weekend = isWeekend(date.getDay());
                        const isToday = isSameDay(date, TODAY);
                        const isSelected = selectedDate && isSameDay(date, selectedDate);
                        return (
                          <div key={date.toISOString()} className="flex justify-center">
                            <button
                              type="button"
                              disabled={weekend}
                              onClick={() => {
                                setSelectedDate(date);
                                setSelectedTime(null);
                              }}
                              className={`relative flex h-9 w-9 touch-manipulation items-center justify-center rounded-full text-sm font-medium transition-colors sm:h-10 sm:w-10 ${
                                weekend
                                  ? "cursor-not-allowed text-slate-300"
                                  : isSelected
                                  ? "text-white"
                                  : "text-slate-700 hover:bg-orange-50"
                              }`}
                              style={isSelected ? { backgroundColor: "#E87722" } : undefined}
                            >
                              {date.getDate()}
                              {isToday && !isSelected && (
                                <span
                                  className="absolute bottom-1 h-1 w-1 rounded-full"
                                  style={{ backgroundColor: "#E87722" }}
                                />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-slate-900">Select a Time</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {TIME_SLOTS.map((time) => {
                          const isTimeSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                              style={
                                isTimeSelected
                                  ? { borderColor: "#E87722", backgroundColor: "#E87722", color: "#ffffff" }
                                  : { borderColor: "#e2e8f0", backgroundColor: "#ffffff", color: "#334155" }
                              }
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedDate && selectedTime && (
                    <p className="mt-5 text-sm text-slate-600">
                      Booking with {advisorLabel(advisorId)} for {duration} min on{" "}
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at {selectedTime}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setBookingStep(2)}
                      className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                    >
                      ← Back
                    </button>
                    {selectedDate && selectedTime && (
                      <Button type="button" onClick={() => setConfirmed(true)}>
                        Confirm Booking
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {selected === "dropin" && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Drop-in hours Mon-Fri 2-4pm. Room 270, Fowler Student Center. Email: careers@lclark.edu
        </div>
      )}
    </div>
  );
}
