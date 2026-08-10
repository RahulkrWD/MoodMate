import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarCheck, TrendingUp, Sparkles, PanelLeft } from "lucide-react";
import { getHistory, getStats, deleteHistoryEntry } from "../api/mood";
import { moodLabel } from "../lib/moodOptions";
import { StatCard } from "../components/history/StatCard";
import { MoodFrequencyBars } from "../components/history/MoodFrequencyBars";
import { HistorySidebar } from "../components/history/HistorySidebar";
import { HistoryDetailPanel } from "../components/history/HistoryDetailPanel";
import { HistorySkeleton } from "../components/history/HistorySkeleton";

const PAGE_SIZE = 20;

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getHistory({ page: 1, limit: PAGE_SIZE }), getStats()])
      .then(([history, statsData]) => {
        if (cancelled) return;
        setEntries(history.items);
        setPage(1);
        setTotalPages(history.totalPages);
        setStats(statsData);
      })
      .catch(() => toast.error("Couldn't load your history"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const history = await getHistory({ page: nextPage, limit: PAGE_SIZE });
      setEntries((prev) => [...prev, ...history.items]);
      setPage(nextPage);
      setTotalPages(history.totalPages);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleDelete(id) {
    const previous = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
    try {
      await deleteHistoryEntry(id);
    } catch (err) {
      setEntries(previous);
      toast.error(err.message);
    }
  }

  const selectedEntry = entries.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Your history
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            A look back at your check-ins and what helped.
          </p>
        </div>
        {!loading && (
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-brand-200 px-3 py-2 text-xs font-medium text-brand-700 md:hidden"
          >
            <PanelLeft className="size-4" /> Check-ins
          </button>
        )}
      </div>

      {loading ? (
        <HistorySkeleton />
      ) : (
        <div className="flex gap-6">
          <HistorySidebar
            entries={entries}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={handleDelete}
            loading={loadingMore}
            hasMore={page < totalPages}
            onLoadMore={handleLoadMore}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          <div className="min-w-0 flex-1">
            {selectedEntry ? (
              <HistoryDetailPanel entry={selectedEntry} onDelete={handleDelete} />
            ) : entries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand-200 py-16 text-center">
                <p className="text-sm text-slate-500">No check-ins yet. Go check your mood!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard
                    icon={CalendarCheck}
                    label="Total check-ins"
                    value={stats.totalCheckIns}
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Most frequent mood"
                    value={stats.topMood ? moodLabel(stats.topMood.mood) : "—"}
                    sub={stats.topMood ? `${stats.topMood.count} times` : undefined}
                  />
                  <StatCard
                    icon={Sparkles}
                    label="This week"
                    value={thisWeekCount(stats.weeklyTrend)}
                  />
                </div>
                <MoodFrequencyBars frequency={stats.frequency} />
                <p className="text-center text-sm text-slate-400">
                  Pick a check-in from the list to see what it suggested.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
