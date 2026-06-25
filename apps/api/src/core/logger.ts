export type LogLevel = "info" | "warn" | "error" | "debug";

export function log(level: LogLevel, message: string, meta: Record<string, unknown> = {}): void {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}