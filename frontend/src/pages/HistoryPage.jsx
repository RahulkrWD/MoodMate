import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarCheck, TrendingUp, Sparkles } from "lucide-react";
import { getHistory, getStats, deleteHistoryEntry } from "../api/mood";
import { moodLabel } from "../lib/moodOptions";
import { StatCard } from "../components/history/StatCard";
import { MoodFrequencyBars } from "../components/history/MoodFrequencyBars";
import { HistoryEntryCard } from "../components/history/HistoryEntryCard";
import { Pagination } from "../components/ui/Pagination";
import { Spinner } from "../components/ui/Spinner";

const PAGE_SIZE = 4;

function thisWeekCount(weeklyTrend) {
  if (!weeklyTrend?.length) return 0;
  const last = weeklyTrend[weeklyTrend.length - 1];
  const weekStart = new Date(last.week);
  const msSinceStart = Date.now() - weekStart.getTime();
  const withinCurrentWeek = msSinceStart >= 0 && msSinceStart < 7 * 24 * 60 * 60 * 1000;
  return withinCurrentWeek ? last.count : 0;
}

export function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ totalCheckIns: 0, topMood: null, frequency: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getHistory({ page, limit: PAGE_SIZE }), getStats()])
      .then(([history, statsData]) => {
        if (cancelled) return;
        setEntries(history.items);
        setTotalPages(history.totalPages);
        setStats(statsData);
      })
      .catch(() => toast.error("Couldn't load your history"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [page]);

  async function handleDelete(id) {
    const previous = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteHistoryEntry(id);
    } catch (err) {
      setEntries(previous);
      toast.error(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
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
        <StatCard icon={Sparkles} label="This week" value={thisWeekCount(stats.weeklyTrend)} />
      </div>

      <div className="mb-8">
        <MoodFrequencyBars frequency={stats.frequency} />
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-200 py-16 text-center">
          <p className="text-sm text-slate-500">No check-ins yet. Go check your mood!</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {entries.map((entry) => (
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
