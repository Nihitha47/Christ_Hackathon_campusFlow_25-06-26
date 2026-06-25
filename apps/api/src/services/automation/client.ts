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

  // Build GET URL: flatten top-level fields + pass full payload as JSON in "data" param
  function buildGetUrl(base: string, data: Record<string, unknown>): string {
    const params = new URLSearchParams();
    // Add flat top-level fields as individual params for easy n8n access
    for (const [key, val] of Object.entries(data)) {
      if (val !== null && val !== undefined && typeof val !== "object") {
        params.set(key, String(val));
      }
    }
    // Also pass nested payload fields flat
    const nested = data.payload as Record<string, unknown> | undefined;
    if (nested && typeof nested === "object") {
      for (const [key, val] of Object.entries(nested)) {
        if (val !== null && val !== undefined && typeof val !== "object") {
          params.set(key, String(val));
        }
      }
    }
    // Pass full payload as JSON for any complex access
    params.set("data", JSON.stringify(data));
    return `${base}?${params.toString()}`;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = buildGetUrl(webhookUrl, payload);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...(env.N8N_WEBHOOK_SECRET ? { "X-CampusFlow-Webhook-Secret": env.N8N_WEBHOOK_SECRET } : {})
        },
        signal: controller.signal
      });

      const responseBody = await response.text();
      globalThis.clearTimeout(timeout);

      if (response.ok) {
        return { status: "sent", responseStatus: response.status, responseBody, attempts: attempt };
      }

      lastError = `Webhook responded with ${response.status}: ${responseBody.substring(0, 200)}`;
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
  return { status: "failed", errorMessage: lastError, attempts: maxRetries };
}