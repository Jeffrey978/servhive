import { useState } from 'react';

import { useToast } from '@/components/toast';
import { errorMessage, useAction } from '@/lib/api';
import type { ActionResult } from '@/lib/types';

/**
 * Run a website action from a form or button. The website's own messages are
 * shown: its success text as a toast, its validation error under the form.
 *
 *   const { submit, pending, error } = useSubmit('client.requestQuote');
 *   submit({ providerId, title, ... }, () => router.back());
 */
export function useSubmit<T = unknown>(name: string) {
  const action = useAction<T>(name);
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  async function submit(body: Record<string, unknown>, onOk?: (res: Extract<ActionResult<T>, { ok: true }>) => void) {
    setError(null);
    try {
      const res = await action.mutateAsync(body);
      if (res.ok) {
        if (res.message) toast(res.message);
        onOk?.(res);
      } else {
        setError(res.error);
      }
      return res;
    } catch (e) {
      setError(errorMessage(e));
      return { ok: false as const, error: errorMessage(e) };
    }
  }

  return { submit, pending: action.isPending, error, setError };
}
