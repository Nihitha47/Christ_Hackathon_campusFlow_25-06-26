import { automationWebhookEnvelopeSchema, type AutomationEventType, type ModuleKey } from "@campusflow/shared";
import { log } from "../../core/logger";
import { insertAutomationLog, fetchAutomationLogs } from "./log-repository";
import { postAutomationWebhook } from "./client";
import type { AutomationEventInput } from "./types";

export class AutomationService {
  async emit(event: AutomationEventInput<Record<string, unknown>>) {
    const envelope = automationWebhookEnvelopeSchema.parse({
      eventType: event.eventType,
      moduleKey: event.moduleKey,
      entityId: event.entityId,
      source: "campusflow-backend",
      occurredAt: new Date().toISOString(),
      payload: event.payload
    });

    const delivery = await postAutomationWebhook(envelope);
    const logRecord = await insertAutomationLog({ ...event, payload: envelope.payload }, delivery);

    log("info", "automation event processed", {
      eventType: event.eventType,
      moduleKey: event.moduleKey,
      entityId: event.entityId,
      deliveryStatus: delivery.status
    });

    return { envelope, delivery, logRecord };
  }

  async list(limit = 50) {
    return fetchAutomationLogs(limit);
  }

  async queue(eventType: AutomationEventType, moduleKey: ModuleKey, entityId: string, payload: Record<string, unknown>) {
    return this.emit({ eventType, moduleKey, entityId, payload });
  }
}

export const automationService = new AutomationService();