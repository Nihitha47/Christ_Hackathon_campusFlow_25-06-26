import type { ReactNode } from "react";
import Link from "next/link";
import { routePaths } from "@campusflow/shared";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center gap-8 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/8 bg-white/5 p-8 shadow-glow backdrop-blur-xl">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">CampusFlow</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Build a sharper student routine with onboarding, planning, and group study flow.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-300">
              Register once with your college profile, then move into a dashboard that keeps today’s schedule, tasks, and teamwork visible.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2">Next.js 15</span>
            <span className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2">Supabase ready</span>
            <span className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2">n8n automation</span>
          </div>
        </section>
        <section className="flex items-center justify-center rounded-[2rem] border border-white/8 bg-slate-950/75 p-4 shadow-xl shadow-black/30">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
      <div className="mx-auto mt-6 max-w-6xl text-center text-sm text-slate-500">
        <Link href={routePaths.login}>Already have an account? Sign in</Link>
      </div>
    </div>
  );
}