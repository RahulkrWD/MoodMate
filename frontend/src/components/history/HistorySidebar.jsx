import { AnimatePresence, motion } from "framer-motion";
import { format, isThisWeek, isToday } from "date-fns";
import { Trash2, X, Sparkles, Loader2 } from "lucide-react";
import { MOODS, moodLabel } from "../../lib/moodOptions";
import { cn } from "../../lib/cn";

function groupEntries(entries) {
  const groups = { Today: [], "This week": [], Earlier: [] };
  for (const entry of entries) {
    const date = new Date(entry.createdAt);
    if (isToday(date)) groups.Today.push(entry);
    else if (isThisWeek(date, { weekStartsOn: 1 })) groups["This week"].push(entry);
    else groups.Earlier.push(entry);
  }
  return Object.entries(groups).filter(([, items]) => items.length > 0);
}

function EntryRow({ entry, active, onSelect, onDelete }) {
  const moodMeta = MOODS.find((m) => m.value === entry.mood);
  const Icon = moodMeta?.icon ?? Sparkles;

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors",
        active ? "bg-brand-100 text-brand-800" : "text-slate-600 hover:bg-brand-50",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(entry.id)}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            active ? "bg-brand-600 text-white" : "bg-white text-brand-500",
          )}
        >
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{moodLabel(entry.mood)}</span>
          <span className="block truncate text-xs text-slate-400">
            {format(new Date(entry.createdAt), isToday(new Date(entry.createdAt)) ? "h:mm a" : "MMM d, yyyy")}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => onDelete(entry.id)}
        aria-label="Delete check-in"
        className="shrink-0 rounded-lg p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

function SidebarContents({ entries, selectedId, onSelect, onDelete, loading, hasMore, onLoadMore }) {
  const groups = groupEntries(entries);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-3">
        {entries.length === 0 && !loading ? (
          <p className="px-3 py-6 text-center text-sm text-slate-400">
            No check-ins yet.
          </p>
        ) : (
          groups.map(([label, items]) => (
            <div key={label}>
              <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {label}
              </p>
              <div className="flex flex-col gap-0.5">
                {items.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    active={entry.id === selectedId}
                    onSelect={onSelect}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))
        )}
        {hasMore && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="mx-3 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-brand-600 hover:bg-brand-50 disabled:opacity-50"
          >
            {loading && <Loader2 className="size-3.5 animate-spin" />}
            Load more
          </button>
        )}
      </div>
    </div>
  );
}

export function HistorySidebar({
  entries,
  selectedId,
  onSelect,
  onDelete,
  loading,
  hasMore,
  onLoadMore,
  mobileOpen,
  onCloseMobile,
}) {
  return (
    <>
      {/* Desktop: persistent sidebar */}
      <aside className="hidden w-72 shrink-0 rounded-2xl border border-brand-100 bg-white/70 md:block">
        <div className="border-b border-brand-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-700">Check-ins</h2>
        </div>
        <div className="h-[60vh]">
          <SidebarContents
            entries={entries}
            selectedId={selectedId}
            onSelect={onSelect}
            onDelete={onDelete}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
          />
        </div>
      </aside>

      {/* Mobile: off-canvas drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-900/35 backdrop-blur-sm"
              onClick={onCloseMobile}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col border-r border-brand-100 bg-white/90 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-brand-100 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-700">Check-ins</h2>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close"
                  className="rounded-full p-1.5 text-slate-400 hover:bg-brand-50 hover:text-slate-600"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <SidebarContents
                  entries={entries}
                  selectedId={selectedId}
                  onSelect={(id) => {
                    onSelect(id);
                    onCloseMobile();
                  }}
                  onDelete={onDelete}
                  loading={loading}
                  hasMore={hasMore}
                  onLoadMore={onLoadMore}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
