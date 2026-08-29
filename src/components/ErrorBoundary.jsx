import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Otter Career Logbook crashed while rendering:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 rounded-2xl bg-brand-surface dark:bg-[#1A1919] px-6 py-16 text-center transition-colors">
        <div className="rounded-full bg-orange-50 dark:bg-orange-500/10 p-3">
          <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-300" aria-hidden="true" />
        </div>
        <p className="font-semibold text-slate-800 dark:text-neutral-100">
          Something went wrong loading this page
        </p>
        <p className="max-w-sm text-sm text-slate-500 dark:text-neutral-400">
          {this.props.message ??
            "Your data may be in an unexpected format. Reloading usually fixes this."}
        </p>
        <button
          type="button"
          onClick={() => {
            this.setState({ error: null });
            window.location.reload();
          }}
          className="mt-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Reload page
        </button>
        {import.meta.env.DEV && (
          <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-slate-100 dark:bg-white/5 p-3 text-left text-xs text-slate-600 dark:text-neutral-400">
            {String(this.state.error?.stack ?? this.state.error)}
          </pre>
        )}
      </div>
    );
  }
}
