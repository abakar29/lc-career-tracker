import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

const BOOKING_STEPS = ["Duration", "Advisor", "Date"];

export default function CareerCenter() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [duration, setDuration] = useState("30");

  return (
    <div>
      <div
        className="relative overflow-hidden"
        style={{ height: "360px", borderRadius: "16px" }}
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

      {selected === "book" && (
        <div className="mt-6">
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
                <button
                  type="button"
                  onClick={() => setBookingStep(2)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: "#E87722" }}
                >
                  Next →
                </button>
              </div>
            </div>
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
