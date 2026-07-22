import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

export function Card({ className = "", children }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const BADGE_STYLES = {
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  red: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  orange: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
  slate: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
};

export function Badge({ tone = "slate", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_STYLES[tone]}`}
    >
      {children}
    </span>
  );
}

const BUTTON_STYLES = {
  primary:
    "bg-orange-700 text-white hover:bg-orange-800 focus-visible:ring-orange-500",
  secondary:
    "bg-white text-orange-800 border border-orange-200 hover:bg-orange-50 focus-visible:ring-orange-500",
  ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};

export function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${BUTTON_STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({ icon: Icon, label, variant = "default", className = "", ...props }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-lg p-2 transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        variant === "danger"
          ? "text-red-600 hover:bg-red-50 focus-visible:ring-red-500"
          : "text-slate-500 hover:bg-slate-100 focus-visible:ring-slate-400"
      } ${className}`}
      {...props}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function fieldIds(id, autoId) {
  const fieldId = id || autoId;
  return { fieldId, errorId: `${fieldId}-error` };
}

const FIELD_BASE =
  "w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-50 disabled:text-slate-400";

export function TextField({ id, label, error, required, className = "", ...props }) {
  const { fieldId, errorId } = fieldIds(id, useId());
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${FIELD_BASE} ${error ? "border-red-400" : "border-slate-300"}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function DateField(props) {
  return <TextField type="date" {...props} />;
}

export function TextArea({ id, label, error, required, className = "", ...props }) {
  const { fieldId, errorId } = fieldIds(id, useId());
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={fieldId}
        rows={3}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${FIELD_BASE} ${error ? "border-red-400" : "border-slate-300"}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({ id, label, error, required, children, className = "", ...props }) {
  const { fieldId, errorId } = fieldIds(id, useId());
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={fieldId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${FIELD_BASE} bg-white ${error ? "border-red-400" : "border-slate-300"}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, children, className = "" }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = () => dialog?.querySelectorAll(FOCUSABLE_SELECTOR) ?? [];
    focusable()[0]?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto animate-[modal-in_0.18s_ease-out] ${className}`}
      >
        <div className="flex items-center justify-between gap-3 px-6 pt-5">
          <h2 id={titleId} className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <IconButton icon={X} label="Close dialog" onClick={onClose} />
        </div>
        <div className="px-6 pb-6 pt-3">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onCancel, onConfirm, title, description, confirmLabel = "Delete" }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-slate-600">{description}</p>
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function RadialProgress({
  value,
  size = 128,
  strokeWidth = 10,
  label,
  trackColor = "rgba(255,255,255,0.25)",
  progressColor = "#ffffff",
  textClassName = "text-white",
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(value));
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div
      role="img"
      aria-label={label || `Career readiness score: ${value}%`}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <span className={`absolute text-3xl font-extrabold ${textClassName}`} aria-hidden="true">
        {value}%
      </span>
    </div>
  );
}
