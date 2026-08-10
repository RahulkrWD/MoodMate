import { format } from "date-fns";
import { Trash2, UtensilsCrossed, Tv, Activity } from "lucide-react";
import { MOODS, moodLabel } from "../../lib/moodOptions";
import { Badge } from "../ui/Badge";

export function HistoryEntryCard({ entry, onDelete }) {
  const moodMeta = MOODS.find((m) => m.value === entry.mood);
  const Icon = moodMeta?.icon;

  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm shadow-brand-900/[0.03]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Icon className="size-4" />
            </span>
          )}
          <div>
            <p className="text-sm font-medium text-slate-900">{moodLabel(entry.mood)}</p>
            <p className="text-xs text-slate-400">
              {format(new Date(entry.createdAt), "MMM d, yyyy · h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="brand" className="capitalize">
            {entry.energyLevel} energy
          </Badge>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(entry.id)}
              aria-label="Delete entry"
              className="rounded-full p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>

      {entry.recommendation ? (
        <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600 sm:grid-cols-3">
          <p className="flex items-start gap-2">
            <UtensilsCrossed className="mt-0.5 size-4 shrink-0 text-orange-500" />
            {entry.recommendation.food}
          </p>
          <p className="flex items-start gap-2">
            <Tv className="mt-0.5 size-4 shrink-0 text-violet-500" />
            {entry.recommendation.watch}
          </p>
          <p className="flex items-start gap-2">
            <Activity className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            {entry.recommendation.activity}
          </p>
        </div>
      ) : (
        <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
          No suggestions for this check-in.
        </p>
      )}
    </div>
  );
}
