import { useMemo, useState } from "react";
import { CalendarCheck, TrendingUp, Sparkles } from "lucide-react";
import { getSampleHistory, getSampleStats } from "../lib/sampleHistory";
import { moodLabel } from "../lib/moodOptions";
import { StatCard } from "../components/history/StatCard";
import { MoodFrequencyBars } from "../components/history/MoodFrequencyBars";
import { HistoryEntryCard } from "../components/history/HistoryEntryCard";
import { Pagination } from "../components/ui/Pagination";

const PAGE_SIZE = 4;

export function HistoryPage() {
  // TODO(M5): replace with useEffect + api/mood.js's getHistory()/getStats()
  // once GET /mood/history and GET /mood/stats exist. Shapes already match.
  const [entries, setEntries] = useState(() => getSampleHistory());
  const [page, setPage] = useState(1);
  const stats = useMemo(() => getSampleStats(entries), [entries]);
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const pageEntries = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleDelete(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
          Your history
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          A look back at your check-ins and what helped.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarCheck} label="Total check-ins" value={stats.totalCheckIns} />
        <StatCard
          icon={TrendingUp}
          label="Most frequent mood"
          value={stats.topMood ? moodLabel(stats.topMood.mood) : "—"}
          sub={stats.topMood ? `${stats.topMood.count} times` : undefined}
        />
        <StatCard icon={Sparkles} label="This week" value={`${Math.min(entries.length, 7)}`} />
      </div>

      <div className="mb-8">
        <MoodFrequencyBars frequency={stats.frequency} />
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-sm text-slate-500">No check-ins yet. Go check your mood!</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {pageEntries.map((entry) => (
              <HistoryEntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
            ))}
          </div>
          <div className="mt-8">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
