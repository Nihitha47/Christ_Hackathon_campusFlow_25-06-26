import { apiJson } from "../../../lib/api-client";
import type { StudyGroupRecord, StudyGroupMemberRecord, StudySessionRecord } from "@campusflow/shared";

export type GroupWithMembers = {
  group: StudyGroupRecord;
  members: StudyGroupMemberRecord[];
};

export type ListGroupsResponse = {
  groups: GroupWithMembers[];
};

export type CreateGroupInput = {
  ownerProfileId: string;
  name: string;
  subject: string;
  branch: string;
  year: number;
  description?: string;
};

export type AddMemberInput = {
  profileId: string;
  role?: "owner" | "member";
};

export type CreateSessionInput = {
  groupId: string;
  topic: string;
  agenda: string;
  scheduledAt: string;
  durationMinutes: number;
  availability: string;
  addToCalendar: boolean;
};

export type ListSessionsResponse = {
  sessions: StudySessionRecord[];
};

export async function listGroups(ownerProfileId: string): Promise<ListGroupsResponse> {
  return apiJson<ListGroupsResponse>(`/study-groups?ownerProfileId=${encodeURIComponent(ownerProfileId)}`);
}

export async function createGroup(payload: CreateGroupInput): Promise<GroupWithMembers> {
  const response = await apiJson<{ group: GroupWithMembers }>("/study-groups", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return response.group;
}

export async function addGroupMember(groupId: string, payload: AddMemberInput): Promise<StudyGroupMemberRecord> {
  const response = await apiJson<{ member: StudyGroupMemberRecord }>(`/study-groups/${groupId}/members`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return response.member;
}

export async function listSessions(groupId?: string): Promise<ListSessionsResponse> {
  const suffix = groupId ? `?groupId=${encodeURIComponent(groupId)}` : "";
  return apiJson<ListSessionsResponse>(`/study-sessions${suffix}`);
}

export async function createSession(payload: CreateSessionInput): Promise<StudySessionRecord> {
  const response = await apiJson<{ session: StudySessionRecord }>("/study-sessions", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return response.session;
}