import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Compass className="size-12 text-slate-300" />
      <h1 className="mt-4 font-display text-2xl font-semibold text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Whatever you were looking for isn't here.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Back to MoodMate</Link>
      </Button>
    </div>
  );
}
