import type { Response } from "express";

export function ok<TData>(response: Response, data: TData, status = 200): Response {
  return response.status(status).json({ data });
}

export function created<TData>(response: Response, data: TData): Response {
  return ok(response, data, 201);
}