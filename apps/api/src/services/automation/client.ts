import { getEnv } from "../../core/env";
import { log } from "../../core/logger";
import type { AutomationDeliveryResult } from "./types";

async function delay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function postAutomationWebhook(payload: Record<string, unknown>): Promise<AutomationDeliveryResult> {
  const env = getEnv();
  const webhookUrl = env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return { status: "failed", errorMessage: "N8N_WEBHOOK_URL is not configured" };
  }

  const maxRetries = env.N8N_MAX_RETRIES;
  const timeoutMs = env.N8N_TIMEOUT_MS;
  let lastError = "";

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(env.N8N_WEBHOOK_SECRET ? { "X-CampusFlow-Webhook-Secret": env.N8N_WEBHOOK_SECRET } : {})
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const responseBody = await response.text();
      globalThis.clearTimeout(timeout);

      if (response.ok) {
        return { status: "sent", responseStatus: response.status, responseBody };
      }

      lastError = `Webhook responded with ${response.status}`;
      log("warn", "automation webhook returned a non-2xx response", { attempt, responseStatus: response.status, responseBody });
    } catch (error) {
      globalThis.clearTimeout(timeout);
      lastError = error instanceof Error ? error.message : "Unknown automation delivery error";
      log("warn", "automation webhook attempt failed", { attempt, errorMessage: lastError });
    }

    if (attempt < maxRetries) {
      await delay(150 * attempt);
    }
  }

  log("error", "automation webhook delivery exhausted retries", { errorMessage: lastError });
  return { status: "failed", errorMessage: lastError };
}