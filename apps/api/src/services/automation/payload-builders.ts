import type { AutomationEventType } from "@campusflow/shared";
import type { AutomationPayloadBuilder } from "./types";

type BasePayload = {
  title: string;
  actorName?: string;
  occurredAt: string;
  scheduleAt?: string;
  reminderAt?: string;
  addToCalendar?: boolean;
};

type DeadlinePayload = BasePayload & { dueAt: string; priority: string };
type PlacementPayload = BasePayload & { milestone: string; type: string };
type StudyGroupPayload = BasePayload & { groupName: string; subject: string; branch: string; year: number };
type StudySessionPayload = BasePayload & { groupName: string; agenda: string; topic: string; availability: string; durationMinutes: number };

function createPayloadBuilder<TInput extends Record<string, unknown>>(eventType: AutomationEventType, moduleKey: string): AutomationPayloadBuilder<TInput> {
  return (input) => ({ eventType, moduleKey, ...input });
}

export const buildDeadlineCreatedPayload = createPayloadBuilder<DeadlinePayload>("DEADLINE_CREATED", "deadlines");
export const buildDeadlineReminderScheduledPayload = createPayloadBuilder<DeadlinePayload>("DEADLINE_REMINDER_SCHEDULED", "deadlines");
export const buildPlacementMilestoneCreatedPayload = createPayloadBuilder<PlacementPayload>("PLACEMENT_MILESTONE_CREATED", "placement");
export const buildMockInterviewScheduledPayload = createPayloadBuilder<PlacementPayload>("MOCK_INTERVIEW_SCHEDULED", "placement");
export const buildStudyGroupCreatedPayload = createPayloadBuilder<StudyGroupPayload>("STUDY_GROUP_CREATED", "groups");
export const buildStudySessionScheduledPayload = createPayloadBuilder<StudySessionPayload>("STUDY_SESSION_SCHEDULED", "groups");