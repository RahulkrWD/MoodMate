import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UtensilsCrossed, Tv, Activity, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import {
  MOODS,
  SERIOUS_MOODS,
  ENERGY_LEVELS,
  DIETARY_PREFS,
  TIME_AVAILABLE,
} from "../lib/moodOptions";
import toast from "react-hot-toast";
import { analyzeMood } from "../api/mood";
import { useAuthStore } from "../store/authStore";
import { OptionTile } from "../components/mood/OptionTile";
import { WizardProgress } from "../components/mood/WizardProgress";
import { ResultCard } from "../components/mood/ResultCard";
import { ResultCardSkeleton } from "../components/mood/ResultCardSkeleton";
import { SeriousMoodNotice } from "../components/mood/SeriousMoodNotice";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";

const STEPS = ["Mood", "Energy", "Preferences"];

const INITIAL_FORM = {
  mood: null,
  energyLevel: null,
  dietaryPref: "none",
  timeAvailable: "under_30_min",
};

function StepShell({ children, stepKey }) {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function MoodWizardPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [phase, setPhase] = useState("wizard"); // wizard | loading | serious | results
  const [result, setResult] = useState(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  function reset() {
    setStep(0);
    setForm(INITIAL_FORM);
    setPhase("wizard");
    setResult(null);
  }

  async function handleSubmit() {
    if (SERIOUS_MOODS.has(form.mood)) {
      setPhase("serious");
      return;
    }
    setPhase("loading");
    try {
      const { recommendation, isFallback } = await analyzeMood(form);
      if (isFallback) {
        toast("Using a general suggestion - our AI helper is briefly unavailable.");
      }
      setResult(recommendation);
      setPhase("results");
    } catch (err) {
      toast.error(err.message);
      setPhase("wizard");
    }
  }

  const canProceed =
    (step === 0 && form.mood) || (step === 1 && form.energyLevel) || step === 2;

  if (phase === "serious") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <SeriousMoodNotice onRestart={reset} />
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <Skeleton className="mx-auto mb-4 size-12 rounded-full" />
          <p className="text-sm font-medium text-slate-500">
            Thinking about what might help...
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCardSkeleton />
          <ResultCardSkeleton />
          <ResultCardSkeleton />
        </div>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-brand-600 text-white">
            <Sparkles className="size-6" />
          </span>
          <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Here's what might help
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isAuthenticated
              ? "Saved to your history."
              : "Log in to save your recommendations to a history you can look back on."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard
            icon={UtensilsCrossed}
            label="Eat"
            suggestion={result.food}
            variant="mood-card-food"
          />
          <ResultCard
            icon={Tv}
            label="Watch"
            suggestion={result.watch}
            variant="mood-card-watch"
          />
          <ResultCard
            icon={Activity}
            label="Do"
            suggestion={result.activity}
            variant="mood-card-activity"
          />
        </div>
        <div className="mt-10 flex justify-center">
          <Button variant="outline" onClick={reset}>
            Check in again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <WizardProgress steps={STEPS} currentIndex={step} />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <StepShell stepKey="mood">
            <h1 className="mb-1 text-center font-display text-2xl font-semibold text-slate-900">
              How are you feeling right now?
            </h1>
            <p className="mb-8 text-center text-sm text-slate-500">
              Pick whatever's closest.
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {MOODS.map((m) => (
                <OptionTile
                  key={m.value}
                  icon={m.icon}
                  label={m.label}
                  selected={form.mood === m.value}
                  onClick={() => setForm((f) => ({ ...f, mood: m.value }))}
                />
              ))}
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell stepKey="energy">
            <h1 className="mb-1 text-center font-display text-2xl font-semibold text-slate-900">
              What's your energy like?
            </h1>
            <p className="mb-8 text-center text-sm text-slate-500">
              This helps shape the kind of activity we suggest.
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {ENERGY_LEVELS.map((e) => (
                <OptionTile
                  key={e.value}
                  label={e.label}
                  selected={form.energyLevel === e.value}
                  onClick={() => setForm((f) => ({ ...f, energyLevel: e.value }))}
                />
              ))}
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell stepKey="preferences">
            <h1 className="mb-1 text-center font-display text-2xl font-semibold text-slate-900">
              A couple of quick preferences
            </h1>
            <p className="mb-8 text-center text-sm text-slate-500">
              So the suggestions actually fit your day.
            </p>
            <div className="mx-auto grid max-w-sm gap-4">
              <Select
                label="Dietary preference"
                value={form.dietaryPref}
                onChange={(e) => setForm((f) => ({ ...f, dietaryPref: e.target.value }))}
              >
                {DIETARY_PREFS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Time available"
                value={form.timeAvailable}
                onChange={(e) =>
                  setForm((f) => ({ ...f, timeAvailable: e.target.value }))
                }
              >
                {TIME_AVAILABLE.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
          </StepShell>
        )}
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={step === 0 ? "invisible" : ""}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>
            Next <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            Get my recommendations <Sparkles className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
