import { Link } from "react-router-dom";
import { Sparkles, UtensilsCrossed, Tv, Activity, ListChecks, ShieldCheck, Zap } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const STEPS = [
  {
    icon: Sparkles,
    title: "Tell us how you feel",
    description: "Pick your mood, energy level, and a couple of quick preferences.",
  },
  {
    icon: Zap,
    title: "Get instant suggestions",
    description: "AI generates one thing to eat, watch, and do - tailored to you.",
  },
  {
    icon: ListChecks,
    title: "Track it over time",
    description: "Log in to build a history of check-ins and spot your patterns.",
  },
];

export function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-slate-50 to-slate-50" />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
            <Sparkles className="size-3.5" /> AI-powered mood check-ins
          </span>
          <h1 className="text-balance font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Not sure what to eat, watch, or do?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-slate-600">
            Tell MoodMate how you're feeling and get a personalized suggestion in
            seconds - no account required to try it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/mood">Check your mood</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-slate-500">Three quick steps, no signup needed to try.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Card key={s.title} className="text-center">
              <span className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <s.icon className="size-5" />
              </span>
              <p className="mb-1 text-xs font-semibold text-brand-600">STEP {i + 1}</p>
              <h3 className="mb-1 font-medium text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-500">{s.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="mood-card-food rounded-2xl border border-[color-mix(in_srgb,var(--card-ring)_35%,transparent)] bg-gradient-to-br from-[var(--card-from)] to-[var(--card-to)] p-6">
            <UtensilsCrossed className="mb-3 size-6 text-orange-600" />
            <h3 className="font-medium text-slate-900">Eat</h3>
            <p className="mt-1 text-sm text-slate-600">
              A food suggestion that actually matches your mood and dietary preference.
            </p>
          </div>
          <div className="mood-card-watch rounded-2xl border border-[color-mix(in_srgb,var(--card-ring)_35%,transparent)] bg-gradient-to-br from-[var(--card-from)] to-[var(--card-to)] p-6">
            <Tv className="mb-3 size-6 text-violet-600" />
            <h3 className="font-medium text-slate-900">Watch</h3>
            <p className="mt-1 text-sm text-slate-600">
              Something to put on that fits the headspace you're in right now.
            </p>
          </div>
          <div className="mood-card-activity rounded-2xl border border-[color-mix(in_srgb,var(--card-ring)_35%,transparent)] bg-gradient-to-br from-[var(--card-from)] to-[var(--card-to)] p-6">
            <Activity className="mb-3 size-6 text-emerald-600" />
            <h3 className="font-medium text-slate-900">Do</h3>
            <p className="mt-1 text-sm text-slate-600">
              A small activity sized to how much time and energy you actually have.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <span className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-slate-900 text-white">
          <ShieldCheck className="size-5" />
        </span>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Built with care, not a diagnosis tool
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500">
          MoodMate offers light, everyday suggestions. For anything heavier, we'll
          gently point you toward real support instead of guessing.
        </p>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Ready to check in with yourself?
          </h2>
          <Button size="lg" asChild>
            <Link to="/mood">Check your mood now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
