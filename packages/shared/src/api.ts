import { apiBasePath } from "./constants";

export type ApiFetchOptions = RequestInit & { token?: string };

<<<<<<< HEAD
function getStoredToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem("campusflow-session");
    if (!raw) return undefined;
    const session = JSON.parse(raw);
    return session?.accessToken ?? undefined;
  } catch {
    return undefined;
  }
}

=======
>>>>>>> 3d549590b8362e89faeb9c442c35a3d2fc36de6a
export async function apiFetch<TResponse>(path: string, options: ApiFetchOptions = {}): Promise<TResponse> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

<<<<<<< HEAD
  // Use explicit token if provided, otherwise fall back to stored session token
  const token = options.token ?? getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
=======
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
>>>>>>> 3d549590b8362e89faeb9c442c35a3d2fc36de6a
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}${apiBasePath}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as TResponse;
}