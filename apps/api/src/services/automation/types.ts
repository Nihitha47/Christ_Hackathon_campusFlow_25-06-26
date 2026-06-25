import type { AutomationEventType, ModuleKey } from "@campusflow/shared";

export type AutomationPayloadBuilder<TInput> = (input: TInput) => Record<string, unknown>;

export type AutomationEventInput<TInput> = {
  eventType: AutomationEventType;
  moduleKey: ModuleKey;
  entityId: string;
  payload: TInput;
};

export type AutomationDeliveryResult = {
  status: "sent" | "failed";
  responseStatus?: number;
  responseBody?: string;
  errorMessage?: string;
};