import { getSupabaseAdmin } from "../../core/supabase";
import { placementItemSchema, placementItemUpsertSchema } from "@campusflow/shared";
import { automationService } from "../../services/automation";
import { buildPlacementMilestoneCreatedPayload, buildMockInterviewScheduledPayload } from "../../services/automation/payload-builders";
import type { PlacementItemRecord, PlacementItemUpsertInput } from "@campusflow/shared";

export class PlacementService {
  private supabase = getSupabaseAdmin();

  async list(profileId: string, filters: { type?: string; status?: string } = {}) {
    let query = this.supabase.from("placement_items").select("*").eq("profile_id", profileId).order("updated_at", { ascending: false });

    if (filters.type) {
      query = query.eq("type", filters.type);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const result = await query;
    if (result.error) throw result.error;

    return result.data as PlacementItemRecord[];
  }

  async create(profileId: string, payload: PlacementItemUpsertInput) {
    const validated = placementItemUpsertSchema.parse(payload);
    const result = await this.supabase.from("placement_items").insert({ profile_id: profileId, ...validated }).select("*").single();
    if (result.error || !result.data) throw result.error ?? new Error("Failed to create placement item");

    const item = result.data as PlacementItemRecord;
    await automationService.queue(
      "PLACEMENT_MILESTONE_CREATED",
      "placement",
      item.id,
      buildPlacementMilestoneCreatedPayload({
        title: item.title,
        milestone: item.type,
        type: item.type,
        occurredAt: new Date().toISOString(),
        scheduleAt: item.dueAt,
        reminderAt: item.reminderAt,
        addToCalendar: item.addToCalendar
      })
    );

    return item;
  }

  async update(profileId: string, id: string, payload: Partial<PlacementItemUpsertInput>) {
    const validated = placementItemUpsertSchema.partial().parse(payload);
    const result = await this.supabase.from("placement_items").update(validated).eq("id", id).eq("profile_id", profileId).select("*").single();
    if (result.error || !result.data) throw result.error ?? new Error("Failed to update placement item");

    const item = result.data as PlacementItemRecord;
    await automationService.queue(
      "PLACEMENT_MILESTONE_CREATED",
      "placement",
      item.id,
      buildPlacementMilestoneCreatedPayload({
        title: item.title,
        milestone: item.type,
        type: item.type,
        occurredAt: new Date().toISOString(),
        scheduleAt: item.dueAt,
        reminderAt: item.reminderAt,
        addToCalendar: item.addToCalendar
      })
    );

    return item;
  }

  async scheduleMockInterview(profileId: string, id: string, scheduledAt: string) {
    const result = await this.supabase.from("placement_items").update({ status: "in-progress", scheduled_at: scheduledAt }).eq("id", id).eq("profile_id", profileId).select("*").single();
    if (result.error || !result.data) throw result.error ?? new Error("Failed to schedule mock interview");

    const item = result.data as PlacementItemRecord;
    await automationService.queue(
      "MOCK_INTERVIEW_SCHEDULED",
      "placement",
      item.id,
      buildMockInterviewScheduledPayload({
        title: item.title,
        milestone: item.type,
        type: item.type,
        occurredAt: new Date().toISOString(),
        scheduleAt: scheduledAt,
        reminderAt: item.reminderAt,
        addToCalendar: item.addToCalendar
      })
    );

    return item;
  }

  async delete(profileId: string, id: string) {
    const result = await this.supabase.from("placement_items").delete().eq("id", id).eq("profile_id", profileId);
    if (result.error) throw result.error;
    return { success: true };
  }
}

export const placementService = new PlacementService();
