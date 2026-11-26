import { useAuth } from '@clerk/expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import type { ActionResult, Me, Meta } from '@/lib/types';

/**
 * Talks to the website's JSON API (/api/v1). The Clerk session token goes in
 * the Authorization header; the website checks it and applies the same roles
 * and rules as on the web. Set EXPO_PUBLIC_API_URL in mobile/.env to point at
 * a different deployment (no trailing slash).
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'https://servhive.com').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** fetch() against /api/v1 with the signed-in user's token. Throws ApiError on HTTP errors. */
export function useApiFetch() {
  const { getToken } = useAuth();
  return useCallback(
    async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
      const token = await getToken();
      let res: Response;
      try {
        res = await fetch(`${API_URL}/api/v1${path}`, {
          ...init,
          headers: {
            Accept: 'application/json',
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init.headers,
          },
        });
      } catch {
        throw new ApiError(0, "Can't reach Servhive. Check your connection and try again.");
      }
      const text = await res.text();
      let body: unknown = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = null;
      }
      // Actions answer 400 with { ok: false, error } — that's a result for the form, not a crash.
      const isActionResult = !!body && typeof body === 'object' && 'ok' in body;
      if (!res.ok && !isActionResult) {
        const message = (body as { error?: string } | null)?.error ?? `Something went wrong (${res.status}).`;
        throw new ApiError(res.status, message);
      }
      return body as T;
    },
    [getToken],
  );
}

/** GET a /api/v1 path through React Query. `key` controls caching and refreshes. */
export function useApi<T>(key: readonly unknown[], path: string, opts: { enabled?: boolean; refetchInterval?: number } = {}) {
  const apiFetch = useApiFetch();
  return useQuery({ queryKey: key, queryFn: () => apiFetch<T>(path), enabled: opts.enabled ?? true, refetchInterval: opts.refetchInterval });
}

export function useMe(enabled = true) {
  return useApi<Me>(['me'], '/me', { enabled });
}

export function useMeta() {
  const apiFetch = useApiFetch();
  return useQuery({ queryKey: ['meta'], queryFn: () => apiFetch<Meta>('/meta'), staleTime: 10 * 60_000 });
}

/**
 * Run a named website action (POST /api/v1/actions/<name>). Resolves to the
 * action's own { ok, message | error }; after a success every screen's data
 * is refreshed so lists and badges stay in step.
 */
export function useAction<T = unknown>(name: string) {
  const apiFetch = useApiFetch();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch<ActionResult<T>>(`/actions/${name}`, { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: (res) => {
      if (res.ok) qc.invalidateQueries({ predicate: (q) => q.queryKey[0] !== 'meta' });
    },
  });
}

/** A readable message for any thrown error. */
export function errorMessage(e: unknown) {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error) return e.message;
  return 'Something went wrong. Please try again.';
}
