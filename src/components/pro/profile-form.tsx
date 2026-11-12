"use client";

import { useState } from "react";
import { AREAS, RULES } from "@/lib/constants";
import { cn, formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Avatar, Card } from "@/components/ui/misc";
import { RESPONSE_TIMES } from "./constants";
import { FormMessage, ImagePicker, useProAction, type FormAction } from "./form-bits";

export type ProfileValues = {
  businessName: string;
  subSpecialty: string | null;
  bio: string;
  areasCovered: string[];
  area: string;
  startingPrice: number;
  responseTime: string;
  yearsExperience: number | null;
  phone: string | null;
  imageUrl: string | null;
  categoryName: string;
};

export function ProfileForm({ values, action }: { values: ProfileValues; action: FormAction }) {
  const { state, pending, onSubmit } = useProAction(action);
  const [name, setName] = useState(values.businessName);
  const [sub, setSub] = useState(values.subSpecialty ?? "");
  const [price, setPrice] = useState(String(values.startingPrice || ""));
  const [response, setResponse] = useState(
    (RESPONSE_TIMES as readonly string[]).includes(values.responseTime) ? values.responseTime : "~30 mins",
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business name" htmlFor="businessName">
            <Input id="businessName" name="businessName" required minLength={3} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Speciality" htmlFor="subSpecialty" hint="e.g. Mikano & Perkins generators">
            <Input id="subSpecialty" name="subSpecialty" maxLength={80} value={sub} onChange={(e) => setSub(e.target.value)} />
          </Field>
        </div>

        <Field label="About your work" htmlFor="bio" hint="Two or three sentences. What you do best and where.">
          <Textarea id="bio" name="bio" rows={5} maxLength={1200} defaultValue={values.bio} />
        </Field>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Areas you cover</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {AREAS.map((a) => (
              <label
                key={a}
                className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-3.5 text-sm transition-colors has-[:checked]:border-fg has-[:checked]:bg-surface-2"
              >
                <input
                  type="checkbox"
                  name="areasCovered"
                  value={a}
                  defaultChecked={values.areasCovered.includes(a)}
                  className="size-4 accent-fg"
                />
                {a}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Starting price (₦)" htmlFor="startingPrice" hint={`Minimum ${formatNaira(RULES.minStartingPrice)}`}>
            <Input
              id="startingPrice"
              name="startingPrice"
              type="number"
              inputMode="numeric"
              min={RULES.minStartingPrice}
              step={500}
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Field>
          <Field label="Typical response time" htmlFor="responseTime">
            <Select id="responseTime" name="responseTime" value={response} onChange={(e) => setResponse(e.target.value)}>
              {RESPONSE_TIMES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Years of experience" htmlFor="yearsExperience">
            <Input
              id="yearsExperience"
              name="yearsExperience"
              type="number"
              inputMode="numeric"
              min={0}
              max={60}
              defaultValue={values.yearsExperience ?? ""}
            />
          </Field>
          <Field label="Business phone" htmlFor="phone" hint="Shared with clients only after they book.">
            <Input id="phone" name="phone" type="tel" inputMode="tel" defaultValue={values.phone ?? ""} placeholder="0803 000 0000" />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save profile"}
          </Button>
          <FormMessage state={state} />
        </div>
      </form>

      <div className="hidden lg:block">
        <p className="eyebrow mb-3">Preview</p>
        <Card className="sticky top-6 p-5">
          <div className="flex items-center gap-3">
            <Avatar name={name || "?"} src={values.imageUrl} size={44} />
            <div className="min-w-0">
              <p className="truncate font-medium">{name || "Your business"}</p>
              <p className="truncate text-xs text-muted">{sub || values.categoryName}</p>
            </div>
          </div>
          <p className={cn("mt-5 text-2xl font-medium tracking-tight tabular-nums")}>
            {formatNaira(Number(price) || 0)}
            <span className="ml-1 text-sm font-normal text-muted">from</span>
          </p>
          <p className="mt-1 text-xs text-muted">
            {values.area} · replies {response}
          </p>
        </Card>
      </div>
    </div>
  );
}

export function ProfilePhotoForm({ imageUrl, name, action }: { imageUrl: string | null; name: string; action: FormAction }) {
  const { state, pending, onSubmit, successKey } = useProAction(action);
  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-5">
      <div key={successKey}>
        <ImagePicker id="profile-photo" round initialUrl={imageUrl} label={name ? "Add photo" : "Add"} />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted">A clear photo of you or your shop. JPEG, PNG or WebP.</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="sm" variant="outline" disabled={pending}>
            {pending ? "Uploading…" : "Save photo"}
          </Button>
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  );
}
