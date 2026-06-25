import type { ReactNode } from "react";
import Link from "next/link";
import { routePaths } from "@campusflow/shared";
import { Badge, Button, Card } from "@campusflow/ui";

const navItems = [
  { label: "Dashboard", href: routePaths.dashboard },
  { label: "Deadlines", href: routePaths.deadlines },
  { label: "Placement", href: routePaths.placement },
  { label: "Groups", href: routePaths.groups },
  { label: "Automations", href: routePaths.automation }
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/65 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-400/20" />
              <div>
                <p className="text-sm font-semibold tracking-wide text-emerald-300">CampusFlow</p>
                <p className="text-xs text-slate-400">Student productivity cockpit</p>
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Button key={item.href} asChild variant="ghost" className="rounded-full px-3 py-2 text-xs">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}