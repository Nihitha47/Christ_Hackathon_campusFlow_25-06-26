import { getSupabaseAdmin } from "../../core/supabase";
import type { AutomationDeliveryResult, AutomationEventInput } from "./types";

export async function insertAutomationLog(input: AutomationEventInput<Record<string, unknown>>, delivery: AutomationDeliveryResult) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("automation_logs")
    .insert({
      event_type: input.eventType,
      module_key: input.moduleKey,
      entity_id: input.entityId,
      payload: input.payload,
      status: delivery.status,
      error_message: delivery.errorMessage ?? null
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchAutomationLogs(limit = 50) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("automation_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];
}