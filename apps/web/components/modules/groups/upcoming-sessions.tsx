"use client";

import type { StudySessionRecord } from "@campusflow/shared";
import { Card, CardDescription, CardTitle } from "@campusflow/ui";

type UpcomingSessionsProps = {
  sessions: StudySessionRecord[];
};

export function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  const sorted = [...sessions].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()).slice(0, 8);

  return (
    <Card className="border-white/10 bg-slate-950/85">
      <CardTitle>Upcoming sessions</CardTitle>
      <CardDescription className="mt-1">Planned sessions across all your study groups.</CardDescription>
      <div className="mt-4 space-y-2">
        {sorted.length === 0 ? <p className="text-sm text-slate-500">No sessions scheduled yet.</p> : null}
        {sorted.map((session) => (
          <div key={session.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-sm font-semibold text-slate-100">{session.topic}</p>
            <p className="mt-1 text-xs text-slate-400">{new Date(session.scheduledAt).toLocaleString()} • {session.durationMinutes} mins</p>
            <p className="mt-1 text-xs text-slate-300">{session.agenda}</p>
            <p className="mt-1 text-xs text-emerald-300">Availability: {session.availability}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}