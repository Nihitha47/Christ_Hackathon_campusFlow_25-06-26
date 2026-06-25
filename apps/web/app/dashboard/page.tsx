import Link from "next/link";
import { routePaths, moduleDisplayNames } from "@campusflow/shared";
import { Badge, Button, Card, CardDescription, CardTitle } from "@campusflow/ui";
import { Activity, CalendarDays, CheckCircle2, Users } from "lucide-react";

const quickLinks = [
  { href: routePaths.deadlines, title: moduleDisplayNames.deadlines, description: "Keep deadlines, reminders, and calendar sync ready for demos.", icon: CheckCircle2 },
  { href: routePaths.placement, title: moduleDisplayNames.placement, description: "Track interview prep, milestone progress, and follow-ups.", icon: Activity },
  { href: routePaths.groups, title: moduleDisplayNames.groups, description: "Create study groups, add members, and plan sessions.", icon: Users },
  { href: routePaths.automation, title: "Automation logs", description: "See n8n webhook activity, retries, and delivery state.", icon: CalendarDays }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-8">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="relative overflow-hidden border-emerald-400/15 bg-slate-950/90">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_24%)]" />
          <div className="relative space-y-4">
            <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200">Today’s focus</Badge>
            <CardTitle className="text-3xl">Good morning. Your dashboard is ready for live planning.</CardTitle>
            <CardDescription className="max-w-2xl text-base">
              Keep today’s schedule, pending tasks, and group activity in one view so the demo story stays clear even before feature modules are merged.
            </CardDescription>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={routePaths.register}>Finish onboarding</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={routePaths.groups}>Open study groups</Link>
              </Button>
            </div>
          </div>
        </Card>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { label: "Today’s schedule", value: "3 items" },
            { label: "Pending tasks", value: "5 tasks" },
            { label: "Upcoming sessions", value: "2 sessions" }
          ].map((item) => (
            <Card key={item.label} className="border-white/8 bg-slate-950/80">
              <CardDescription>{item.label}</CardDescription>
              <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.href} className="group border-white/8 bg-slate-950/75 transition-transform duration-200 hover:-translate-y-1 hover:border-emerald-400/25">
              <Icon className="h-5 w-5 text-emerald-300" />
              <CardTitle className="mt-4">{item.title}</CardTitle>
              <CardDescription className="mt-2">{item.description}</CardDescription>
              <Button asChild variant="ghost" className="mt-4 px-0 text-emerald-300 hover:bg-transparent hover:text-emerald-200">
                <Link href={item.href}>Open section</Link>
              </Button>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/8 bg-slate-950/80">
          <CardTitle>Useful summary</CardTitle>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/6 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Task completion</p>
              <p className="mt-2 text-2xl font-semibold text-white">62%</p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Automation health</p>
              <p className="mt-2 text-2xl font-semibold text-white">Stable</p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Study groups</p>
              <p className="mt-2 text-2xl font-semibold text-white">4 active</p>
            </div>
          </div>
        </Card>
        <Card className="border-white/8 bg-slate-950/80">
          <CardTitle>Dashboard contract</CardTitle>
          <CardDescription className="mt-2">
            This shell is intentionally stable: other module owners can plug their pages and APIs into these route cards without changing the layout.
          </CardDescription>
        </Card>
      </section>
    </div>
  );
}