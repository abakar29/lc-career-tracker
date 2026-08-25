import { useMemo, useState } from "react";
import { Search, Clock, GraduationCap, Sparkles } from "lucide-react";
import { useData } from "../context/DataContext";
import { Card } from "../components/ui";
import { formatShortDate } from "../lib/utils";
import { buildTimelineEntries, groupByTerm } from "../lib/timeline";

const KIND_STYLES = {
  EXPERIENCE: {
    icon: GraduationCap,
    badge: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30",
  },
  SKILLS: {
    icon: Sparkles,
    badge: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-white/10 dark:text-neutral-300 dark:ring-white/10",
  },
};

function TimelineRow({ entry }) {
  const style = KIND_STYLES[entry.kind] ?? KIND_STYLES.SKILLS;
  const Icon = style.icon;
  return (
    <Card className="p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start gap-4">
        <span
          className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${style.badge}`}
        >
          <Icon className="h-3 w-3" aria-hidden="true" />
          {entry.kind}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 dark:text-[#F8F9FA] truncate">{entry.title}</h3>
          {entry.description && (
            <p className="mt-0.5 text-sm text-slate-400 dark:text-neutral-500">{entry.description}</p>
          )}
          <span className="mt-2 inline-block rounded-full bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 text-[11px] font-medium text-orange-700 dark:text-orange-300">
            {entry.sector}
          </span>
        </div>

        <div className="flex-shrink-0 text-right text-sm font-medium text-slate-500 dark:text-neutral-400">
          {formatShortDate(entry.date)}
        </div>
      </div>
    </Card>
  );
}

export default function Timeline() {
  const { experiences, skills } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  const allEntries = useMemo(
    () => buildTimelineEntries({ experiences, skills }),
    [experiences, skills]
  );

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allEntries;
    return allEntries.filter((entry) =>
      [entry.title, entry.description, entry.sector, entry.kind]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [allEntries, searchQuery]);

  const terms = useMemo(() => groupByTerm(filteredEntries), [filteredEntries]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F8F9FA]">
            Your four-year timeline
          </h1>
          <p className="text-slate-500 dark:text-neutral-400 mt-1">
            Every experience and skill you've logged, laid out term by term.
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timeline..."
              aria-label="Search timeline"
              className="w-56 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#1A1919] py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-[#F8F9FA] placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-300 whitespace-nowrap">
            {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      </div>

      <div className="mt-8">
        {terms.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="rounded-full bg-orange-50 dark:bg-orange-500/10 p-3">
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-300" aria-hidden="true" />
            </div>
            <p className="font-medium text-slate-700 dark:text-neutral-200">
              {allEntries.length === 0 ? "No timeline entries yet" : "No entries match your search"}
            </p>
            <p className="text-sm text-slate-500 dark:text-neutral-400 max-w-sm">
              {allEntries.length === 0
                ? "Log an experience or skill and it will show up here, organized by term."
                : "Try a different search term."}
            </p>
          </Card>
        ) : (
          <div className="relative">
            <div
              className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-white/10"
              aria-hidden="true"
            />
            <div className="space-y-10">
              {terms.map((term) => (
                <section key={term.key} className="relative pl-8">
                  <span
                    className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-brand-orange ring-4 ring-brand-surface dark:ring-[#1A1919]"
                    aria-hidden="true"
                  />
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8F9FA]">
                      {term.label}
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-neutral-300">
                      {term.entries.length} {term.entries.length === 1 ? "entry" : "entries"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {term.entries.map((entry) => (
                      <TimelineRow key={entry.id} entry={entry} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
