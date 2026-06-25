import type { AutomationEventType, ModuleKey } from "./enums";

export const apiBasePath = "/api";

export const routePaths = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  deadlines: "/dashboard/deadlines",
  placement: "/dashboard/placement",
  groups: "/dashboard/groups",
  automation: "/dashboard/automation"
} as const;

export const moduleDisplayNames: Record<ModuleKey, string> = {
  deadlines: "Smart Deadline Manager",
  placement: "Placement Prep Tracker",
  groups: "Study Group Scheduler",
  automation: "Automation Center"
};

export const automationDisplayNames: Record<AutomationEventType, string> = {
  DEADLINE_CREATED: "Deadline created",
  DEADLINE_REMINDER_SCHEDULED: "Deadline reminder scheduled",
  PLACEMENT_MILESTONE_CREATED: "Placement milestone created",
  MOCK_INTERVIEW_SCHEDULED: "Mock interview scheduled",
  STUDY_GROUP_CREATED: "Study group created",
  STUDY_SESSION_SCHEDULED: "Study session scheduled"
};

export const sharedFieldLabels = {
  name: "Full name",
  branch: "Branch",
  year: "Year",
  subjects: "Subjects",
  phoneNumber: "Phone number",
  googleEmail: "Google email/account"
} as const;