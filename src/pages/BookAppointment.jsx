import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

const ADVISORS = [
  {
    id: "tasia",
    name: "Sarah Johnson",
    role: "Career Advisor",
    initials: "TS",
    bg: "#E87722",
  },
  {
    id: "nina",
    name: "Emily Carter",
    role: "Resume Specialist",
    initials: "NO",
    bg: "#1a1a1a",
  },
];

const DURATIONS = ["30", "60"];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = new Date(2026, 6, 21);
const MWF_TIME_SLOTS = ["10:00 AM", "1:00 PM", "3:30 PM"];
const TT_TIME_SLOTS = ["9:30 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

function isWeekend(dayOfWeek) {
  return dayOfWeek === 0 || dayOfWeek === 6;
}

function getTimeSlots(date) {
  const day = date.getDay();
  return day === 2 || day === 4 ? TT_TIME_SLOTS : MWF_TIME_SLOTS;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function BookAppointment() {
  const navigate = useNavigate();
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 6, 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [advisorPhotos, setAdvisorPhotos] = useState(() => {
    const tasia = localStorage.getItem('advisor_photo_tasia');
    const nina = localStorage.getItem('advisor_photo_nina');
    const restored = {};
    if (tasia) restored.tasia = tasia;
    if (nina) restored.nina = nina;
    return restored;
  });

  const handlePhotoUpload = (advisorId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      const updated = { ...advisorPhotos, [advisorId]: base64 };
      setAdvisorPhotos(updated);
      localStorage.setItem(`advisor_photo_${advisorId}`, base64);
    };
    reader.readAsDataURL(file);
  };

  function handleRemovePhoto(advisor) {
    localStorage.removeItem(`advisor_photo_${advisor.id}`);
    setAdvisorPhotos((prev) => {
      const next = { ...prev };
      delete next[advisor.id];
      return next;
    });
  }

  function selectPill(advisorId, duration) {
    setSelectedAdvisor(advisorId);
    setSelectedDuration(duration);
  }

  function prevMonth() {
    setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/career-center")}
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">Book an Appointment</h1>
      <p className="mt-1 text-slate-500">Choose an advisor and select your session length</p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {ADVISORS.map((advisor) => (
          <div key={advisor.id} className="flex flex-col items-center text-center">
            <div className="group relative" style={{ width: "120px", height: "120px" }}>
              {advisorPhotos[advisor.id] ? (
                <img
                  src={advisorPhotos[advisor.id]}
                  alt={advisor.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center rounded-full"
                  style={{ backgroundColor: advisor.bg }}
                >
                  <span className="text-white text-2xl font-bold">{advisor.initials}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => document.getElementById("input-" + advisor.id).click()}
                title={`Upload photo for ${advisor.name}`}
                aria-label={`Upload photo for ${advisor.name}`}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
              </button>
              <input
                id={"input-" + advisor.id}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(advisor.id, e)}
              />

              {advisorPhotos[advisor.id] && (
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(advisor)}
                  aria-label={`Remove photo for ${advisor.name}`}
                  title="Remove photo"
                  className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="mt-4 font-bold text-slate-900">{advisor.name}</p>
            <p className="text-sm text-slate-500">{advisor.role}</p>

            <div className="mt-4 flex gap-3">
              {DURATIONS.map((duration) => {
                const isSelected =
                  selectedAdvisor === advisor.id && selectedDuration === duration;
                return (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => selectPill(advisor.id, duration)}
                    className="rounded-full border-2 px-4 py-1.5 text-sm font-medium transition-colors"
                    style={
                      isSelected
                        ? { borderColor: "#E87722", backgroundColor: "#E87722", color: "#ffffff" }
                        : { borderColor: "#E87722", backgroundColor: "transparent", color: "#E87722" }
                    }
                  >
                    {duration} min
                  </button>
                );
              })}
            </div>

            {selectedAdvisor === advisor.id && selectedDuration && (
              <div className="mt-6 w-full text-left">
                {!selectedDate && (
                  <div
                    className="w-full bg-white p-5 shadow-sm"
                    style={{ borderRadius: "16px" }}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={prevMonth}
                        aria-label="Previous month"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <p className="font-semibold text-slate-900">
                        {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </p>
                      <button
                        type="button"
                        onClick={nextMonth}
                        aria-label="Next month"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-900">Pick a Date</p>

                    <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-xs font-medium text-slate-400">
                      {WEEKDAY_LABELS.map((label) => (
                        <div key={label}>{label}</div>
                      ))}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-y-1">
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
                              onClick={() => setSelectedDate(date)}
                              className={`relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
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
                )}

                {selectedDate && (
                  <div className="mt-6 w-full">
                    <button
                      type="button"
                      onClick={() => setSelectedDate(null)}
                      className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
                    >
                      ← Change date
                    </button>

                    <div className="mt-2">
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
                        style={{ backgroundColor: "#E87722" }}
                      >
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-900">Select a Time</p>
                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                      {getTimeSlots(selectedDate).map((time) => {
                        const isTimeSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className="rounded-full border px-2 py-1.5 text-xs font-medium transition-colors"
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
                    <p className="mt-2 text-xs text-slate-400">Showing available slots only</p>
                  </div>
                )}

                <p className="mt-4 text-sm text-slate-500">
                  Booking with {advisor.name} · {selectedDuration} min
                  {selectedDate &&
                    ` · ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                  {selectedTime && ` · ${selectedTime}`}
                </p>

                {selectedTime && (
                  <button
                    type="button"
                    className="mt-3 w-full rounded-lg py-3 text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: "#E87722" }}
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
