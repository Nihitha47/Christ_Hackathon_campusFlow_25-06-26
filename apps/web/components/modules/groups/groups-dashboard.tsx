"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StudySessionRecord } from "@campusflow/shared";
import { Card, CardDescription, CardTitle } from "@campusflow/ui";
import { addGroupMember, createGroup, createSession, listGroups, listSessions, type CreateGroupInput, type CreateSessionInput } from "./api";
import type { AddMemberFormValues } from "./schemas";
import { CreateGroupForm } from "./create-group-form";
import { GroupCard } from "./group-card";
import { UpcomingSessions } from "./upcoming-sessions";

const profileIdStorageKey = "campusflow-active-profile-id";

function getActiveProfileId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(profileIdStorageKey) ?? "";
}

function setActiveProfileId(profileId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileIdStorageKey, profileId);
}

export function GroupsDashboard() {
  const queryClient = useQueryClient();
  const activeProfileId = getActiveProfileId();

  const groupsQuery = useQuery({
    queryKey: ["groups", activeProfileId],
    queryFn: () => listGroups(activeProfileId),
    enabled: activeProfileId.length > 0
  });

  const sessionsQuery = useQuery({
    queryKey: ["study-sessions", activeProfileId],
    queryFn: () => listSessions(),
    enabled: activeProfileId.length > 0
  });

  const createGroupMutation = useMutation({
    mutationFn: async (payload: CreateGroupInput) => {
      setActiveProfileId(payload.ownerProfileId);
      return createGroup(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    }
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ groupId, values }: { groupId: string; values: AddMemberFormValues }) => addGroupMember(groupId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    }
  });

  const createSessionMutation = useMutation({
    mutationFn: (payload: CreateSessionInput) => createSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
    }
  });

  const sessions: StudySessionRecord[] = useMemo(() => sessionsQuery.data?.sessions ?? [], [sessionsQuery.data]);

  return (
    <div className="space-y-6 pb-8">
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <CreateGroupForm onSubmitGroup={async (payload) => createGroupMutation.mutateAsync(payload)} />
        <UpcomingSessions sessions={sessions} />
      </section>

      {activeProfileId.length === 0 ? (
        <Card className="border-amber-400/25 bg-amber-900/10">
          <CardTitle>No active profile selected</CardTitle>
          <CardDescription className="mt-1">Create a group using your owner profile UUID to load your workspace.</CardDescription>
        </Card>
      ) : null}

      {groupsQuery.isLoading ? <p className="text-sm text-slate-400">Loading groups...</p> : null}
      {groupsQuery.isError ? <p className="text-sm text-rose-400">Unable to load groups. Check API connection.</p> : null}

      <section className="grid gap-4">
        {(groupsQuery.data?.groups ?? []).map((item) => (
          <GroupCard
            key={item.group.id}
            item={item}
            onAddMember={async (groupId, values) => addMemberMutation.mutateAsync({ groupId, values })}
            onScheduleSession={async (payload) => createSessionMutation.mutateAsync(payload)}
          />
        ))}
      </section>
    </div>
  );
}