"use client";

import { BANKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { FormMessage, useProAction, type FormAction } from "./form-bits";

export function PayoutForm({
  action,
  initial,
}: {
  action: FormAction;
  initial: { bankCode: string; accountName: string } | null;
}) {
  const { state, pending, onSubmit } = useProAction(action);
  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-5">
      <Field label="Bank" htmlFor="bankCode">
        <Select id="bankCode" name="bankCode" required defaultValue={initial?.bankCode ?? ""}>
          <option value="" disabled>
            Choose your bank
          </option>
          {BANKS.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Account number" htmlFor="accountNumber" hint="10-digit NUBAN.">
        <Input
          id="accountNumber"
          name="accountNumber"
          inputMode="numeric"
          autoComplete="off"
          required
          pattern="\d{10}"
          maxLength={10}
          placeholder={initial ? "Re-enter to change" : "0123456789"}
          className="font-mono tracking-wider"
        />
      </Field>
      <Field label="Account name" htmlFor="accountName" hint="Exactly as it appears on your bank account.">
        <Input id="accountName" name="accountName" required minLength={3} maxLength={80} defaultValue={initial?.accountName ?? ""} />
      </Field>
      <p className="text-sm text-muted">Account name will be verified with your bank before first payout.</p>
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : initial ? "Update payout account" : "Save payout account"}
        </Button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
