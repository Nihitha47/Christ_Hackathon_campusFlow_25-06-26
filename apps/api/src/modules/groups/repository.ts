import { getSupabaseAdmin } from "../../core/supabase";

type GroupInsert = {
  owner_id: string;
  name: string;
  subject: string;
  branch: string;
  year: number;
  description: string;
};

type SessionInsert = {
  group_id: string;
  topic: string;
  agenda: string;
  scheduled_at: string;
  duration_minutes: number;
  availability: string;
  add_to_calendar: boolean;
};

export async function createGroup(insert: GroupInsert) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("study_groups").insert(insert).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateGroup(groupId: string, updates: Partial<GroupInsert>) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("study_groups").update(updates).eq("id", groupId).select("*").single();
  if (error) throw error;
  return data;
}

export async function listGroupsByOwner(ownerId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("study_groups").select("*").eq("owner_id", ownerId).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteGroup(groupId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("study_groups").delete().eq("id", groupId);
  if (error) throw error;
}

export async function addGroupMember(groupId: string, profileId: string, role: "owner" | "member") {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("study_group_members")
    .upsert({ group_id: groupId, profile_id: profileId, role }, { onConflict: "group_id,profile_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listGroupMembers(groupId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("study_group_members").select("*").eq("group_id", groupId).order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createSession(insert: SessionInsert) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("study_sessions").insert(insert).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateSession(sessionId: string, updates: Partial<SessionInsert>) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("study_sessions").update(updates).eq("id", sessionId).select("*").single();
  if (error) throw error;
  return data;
}

export async function listSessions(groupId?: string) {
  const supabase = getSupabaseAdmin();
  const query = supabase.from("study_sessions").select("*").order("scheduled_at", { ascending: true });
  const finalQuery = groupId ? query.eq("group_id", groupId) : query;
  const { data, error } = await finalQuery;
  if (error) throw error;
  return data ?? [];
}

export async function deleteSession(sessionId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("study_sessions").delete().eq("id", sessionId);
  if (error) throw error;
}