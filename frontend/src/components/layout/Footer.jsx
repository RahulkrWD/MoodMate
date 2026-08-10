import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-slate-500">
          <Sparkles className="size-4" />
          <span className="text-sm">MoodMate &copy; {new Date().getFullYear()}</span>
        </div>
        <p className="text-center text-xs text-slate-400 sm:text-right">
          Suggestions are AI-generated and not a substitute for professional support.
        </p>
      </div>
    </footer>
  );
}
