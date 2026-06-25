import { apiFetch } from "@campusflow/shared";

export { apiFetch };

export async function apiJson<T>(path: string, init?: RequestInit) {
  return apiFetch<T>(path, init);
}