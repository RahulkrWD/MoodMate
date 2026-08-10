import { format } from "date-fns";
import { motion } from "framer-motion";
import { UtensilsCrossed, Tv, Activity, Trash2, Zap, Clock, Salad } from "lucide-react";
import { MOODS, moodLabel } from "../../lib/moodOptions";
import { ResultCard } from "../mood/ResultCard";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const DIETARY_LABELS = { veg: "Vegetarian", "non-veg": "Non-vegetarian", none: "No preference" };
const TIME_LABELS = {
  under_30_min: "Under 30 min",
  "30_to_60_min": "30–60 min",
  "1_to_2_hours": "1–2 hours",
  half_day_plus: "Half a day+",
};

export function HistoryDetailPanel({ entry, onDelete }) {
  const moodMeta = MOODS.find((m) => m.value === entry.mood);
  const Icon = moodMeta?.icon;

  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex size-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Icon className="size-6" />
            </span>
          )}
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              {moodLabel(entry.mood)}
            </h2>
            <p className="text-sm text-slate-400">
              {format(new Date(entry.createdAt), "EEEE, MMM d, yyyy · h:mm a")}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => onDelete(entry.id)}>
          <Trash2 className="size-4" /> Delete
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="brand" className="gap-1 capitalize">
          <Zap className="size-3" /> {entry.energyLevel} energy
        </Badge>
        {entry.dietaryPref && (
          <Badge variant="slate" className="gap-1">
            <Salad className="size-3" /> {DIETARY_LABELS[entry.dietaryPref] ?? entry.dietaryPref}
          </Badge>
        )}
        {entry.timeAvailable && (
          <Badge variant="slate" className="gap-1">
            <Clock className="size-3" /> {TIME_LABELS[entry.timeAvailable] ?? entry.timeAvailable}
          </Badge>
        )}
      </div>

      {entry.recommendation ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard
            icon={UtensilsCrossed}
            label="Eat"
            suggestion={entry.recommendation.food}
            variant="mood-card-food"
          />
          <ResultCard
            icon={Tv}
            label="Watch"
            suggestion={entry.recommendation.watch}
            variant="mood-card-watch"
          />
          <ResultCard
            icon={Activity}
            label="Do"
            suggestion={entry.recommendation.activity}
            variant="mood-card-activity"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-brand-200 p-6 text-center text-sm text-slate-500">
          No suggestions for this check-in.
        </div>
      )}
    </motion.div>
  );
}
