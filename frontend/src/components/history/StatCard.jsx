import { Card } from "../ui/Card";

export function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="flex items-center gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
      </div>
    </Card>
  );
}
