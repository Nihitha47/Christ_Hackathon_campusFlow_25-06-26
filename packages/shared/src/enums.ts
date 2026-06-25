export const moduleKeys = ["deadlines", "placement", "groups", "automation"] as const;

export type ModuleKey = (typeof moduleKeys)[number];

export const automationEventTypes = [
  "DEADLINE_CREATED",
  "DEADLINE_REMINDER_SCHEDULED",
  "PLACEMENT_MILESTONE_CREATED",
  "MOCK_INTERVIEW_SCHEDULED",
  "STUDY_GROUP_CREATED",
  "STUDY_SESSION_SCHEDULED"
] as const;

export type AutomationEventType = (typeof automationEventTypes)[number];

export const studyYearOptions = [1, 2, 3, 4] as const;

export type StudyYear = (typeof studyYearOptions)[number];

export const reminderLeadOptions = [5, 10, 30, 60, 1440] as const;

export type ReminderLeadMinutes = (typeof reminderLeadOptions)[number];