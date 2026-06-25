import type { ErrorRequestHandler } from "express";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFoundHandler = () => {
  throw new AppError(404, "Route not found");
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: error.message, details: error.details ?? null });
    return;
  }

<<<<<<< HEAD
  const isDev = process.env.NODE_ENV !== "production";
  let details: unknown = undefined;
  if (isDev) {
    if (error instanceof Error) {
      details = error.message;
    } else {
      try { details = JSON.stringify(error); } catch { details = String(error); }
    }
  }
  response.status(500).json({ error: "Internal server error", details });
=======
  response.status(500).json({ error: "Internal server error" });
>>>>>>> 3d549590b8362e89faeb9c442c35a3d2fc36de6a
};