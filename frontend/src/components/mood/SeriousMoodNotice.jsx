import { HeartHandshake } from "lucide-react";
import { Button } from "../ui/Button";

export function SeriousMoodNotice({ onRestart }) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
      <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-brand-600 text-white">
        <HeartHandshake className="size-7" />
      </span>
      <h2 className="font-display text-xl font-semibold text-slate-900">
        It sounds like you're carrying a lot right now
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        That's heavier than a movie or a snack can fix, and that's okay. Please consider
        talking to someone you trust, or a mental health professional, about how
        you're feeling. If you're in crisis, reach out to a local helpline - you don't
        have to go through this alone.
      </p>
      <Button variant="outline" className="mt-6" onClick={onRestart}>
        Start over
      </Button>
    </div>
  );
}
