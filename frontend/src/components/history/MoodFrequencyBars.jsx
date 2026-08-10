import { moodLabel } from "../../lib/moodOptions";
import { Card } from "../ui/Card";

export function MoodFrequencyBars({ frequency }) {
  const entries = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, count]) => count), 1);

  if (entries.length === 0) {
    return (
      <Card>
        <p className="text-sm text-slate-500">No check-ins yet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-700">Mood frequency</h3>
      <div className="flex flex-col gap-3">
        {entries.map(([mood, count]) => (
          <div key={mood} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-medium text-slate-600">
              {moodLabel(mood)}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="w-5 shrink-0 text-right text-xs text-slate-400">{count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
