"use client";

import type { GroupWithMembers, CreateSessionInput } from "./api";
import type { AddMemberFormValues } from "./schemas";
import { Badge, Card, CardDescription, CardTitle } from "@campusflow/ui";
import { MemberList } from "./member-list";
import { SessionScheduler } from "./session-scheduler";

type GroupCardProps = {
  item: GroupWithMembers;
  onAddMember: (groupId: string, values: AddMemberFormValues) => Promise<void>;
  onScheduleSession: (payload: CreateSessionInput) => Promise<void>;
};

export function GroupCard({ item, onAddMember, onScheduleSession }: GroupCardProps) {
  return (
    <Card className="border-white/10 bg-slate-950/85">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle>{item.group.name}</CardTitle>
          <CardDescription className="mt-1">{item.group.subject} • {item.group.branch} • Year {item.group.year}</CardDescription>
        </div>
        <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200">{item.members.length} members</Badge>
      </div>
      {item.group.description ? <p className="mt-3 text-sm text-slate-300">{item.group.description}</p> : null}
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <MemberList groupId={item.group.id} members={item.members} onAddMember={onAddMember} />
        <SessionScheduler groupId={item.group.id} onSchedule={onScheduleSession} />
      </div>
    </Card>
  );
}