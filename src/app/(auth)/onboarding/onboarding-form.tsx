"use client";

import { useActionState, useRef, useState } from "react";
import { ArrowRight, Hammer, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { RULES } from "@/lib/constants";
import { completeOnboarding } from "./actions";

type Role = "CLIENT" | "ARTISAN";

export function OnboardingForm({
  defaultRole,
  defaultName,
  categories,
  areas,
}: {
  defaultRole: Role | null;
  defaultName: string;
  categories: { id: string; name: string; requiresLicence: boolean }[];
  areas: string[];
}) {
  const [role, setRole] = useState<Role | null>(defaultRole);
  const [state, action, pending] = useActionState(completeOnboarding, null);
  const [categoryId, setCategoryId] = useState("");
  const scope = useRef<HTMLDivElement>(null);
  const regulated = categories.find((c) => c.id === categoryId)?.requiresLicence;

  useGSAP(
    () => {
      gsap.from("[data-step]", { y: 24, opacity: 0, stagger: 0.05, duration: 0.8 });
    },
    { scope, dependencies: [role] },
  );

  return (
    <div ref={scope}>
      <p data-step className="eyebrow mb-3">
        Step {role ? 2 : 1} of 2
      </p>
      <h1 data-step className="text-h2 font-medium">
        {role === null ? (
          <>
            How will you use <em className="font-serif font-normal">Servhive?</em>
          </>
        ) : role === "CLIENT" ? (
          "A little about you"
        ) : (
          "Set up your pro profile"
        )}
      </h1>

      {role === null ? (
        <div className="mt-8 grid gap-3">
          {(
            [
              ["CLIENT", Search, "I want to hire", "Find verified artisans and pay safely through escrow."],
              ["ARTISAN", Hammer, "I'm an artisan", `List your services. ${RULES.freeTrialMonths} ${RULES.freeTrialMonths === 1 ? "month" : "months"} free, then ₦${RULES.monthlySubscription.toLocaleString()}/month.`],
            ] as const
          ).map(([r, Icon, title, body]) => (
            <button
              data-step
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className="group flex items-start gap-4 rounded-card border border-border bg-surface p-5 text-left transition-colors duration-300 hover:border-fg"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-2 transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-fg">
                <Icon className="size-5" strokeWidth={1.7} />
              </span>
              <span className="flex-1">
                <span className="block font-medium">{title}</span>
                <span className="mt-1 block text-sm text-muted">{body}</span>
              </span>
              <ArrowRight className="mt-3 size-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg" />
            </button>
          ))}
        </div>
      ) : (
        <form action={action} className="mt-8 space-y-5">
          <input type="hidden" name="role" value={role} />
          <Field label="Full name" htmlFor="name">
            <Input id="name" name="name" defaultValue={defaultName} required autoComplete="name" />
          </Field>

          {role === "ARTISAN" ? (
            <>
              <Field label="Business name" htmlFor="businessName" hint="This is what clients see on your profile.">
                <Input id="businessName" name="businessName" required placeholder="e.g. Bright Spark Electricals" />
              </Field>
              <Field
                label="Trade"
                htmlFor="categoryId"
                hint={regulated ? "Regulated trade — you'll upload your licence before approval." : undefined}
              >
                <Select id="categoryId" name="categoryId" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="" disabled>
                    Choose your trade
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.requiresLicence ? " (licence required)" : ""}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Speciality (optional)" htmlFor="subSpecialty">
                <Input id="subSpecialty" name="subSpecialty" placeholder="e.g. Inverter & solar installs" />
              </Field>
            </>
          ) : null}

          <Field label={role === "ARTISAN" ? "Base area" : "Your area"} htmlFor="area">
            <Select id="area" name="area" required defaultValue="">
              <option value="" disabled>
                Choose an area in Port Harcourt
              </option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </Field>

          {role === "ARTISAN" ? (
            <>
              <Field label="Phone number" htmlFor="phone" hint="Kept private — clients message you through Servhive.">
                <Input id="phone" name="phone" type="tel" required placeholder="0803 123 4567" autoComplete="tel" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Starting price (₦)" htmlFor="startingPrice">
                  <Input id="startingPrice" name="startingPrice" type="number" inputMode="numeric" min={RULES.minStartingPrice} step={500} required placeholder="8000" />
                </Field>
                <Field label="Years of experience" htmlFor="yearsExperience">
                  <Input id="yearsExperience" name="yearsExperience" type="number" inputMode="numeric" min={0} max={60} required placeholder="5" />
                </Field>
              </div>
            </>
          ) : null}

          {state && !state.ok ? (
            <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
              {state.error}
            </p>
          ) : null}

          <div className="flex items-center gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setRole(null)} disabled={pending}>
              Back
            </Button>
            <Button type="submit" variant="primary" size="lg" className={cn("flex-1")} disabled={pending}>
              {pending ? "Saving…" : role === "ARTISAN" ? "Create pro profile" : "Start hiring"}
              <ArrowRight />
            </Button>
          </div>
          {role === "ARTISAN" ? (
            <p className="text-xs text-muted">
              Next you&apos;ll upload your ID and at least {RULES.minWorkPhotosForReview} work photos so our team can verify you.
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
