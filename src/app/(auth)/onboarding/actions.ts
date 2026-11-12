"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AREAS, BLOCKED_CATEGORIES, RULES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { formToObject, run, type ActionResult } from "@/lib/action";
import { DomainError } from "@/server/escrow";

const area = z.enum(AREAS as unknown as [string, ...string[]], { message: "Choose your area." });

const ClientSchema = z.object({
  role: z.literal("CLIENT"),
  name: z.string().trim().min(2, "Enter your name.").max(80),
  area,
});

const ArtisanSchema = z.object({
  role: z.literal("ARTISAN"),
  name: z.string().trim().min(2, "Enter your full name.").max(80),
  businessName: z.string().trim().min(3, "Enter your business name.").max(80),
  categoryId: z.string().min(1, "Choose your trade."),
  subSpecialty: z.string().trim().max(80).optional().default(""),
  area,
  phone: z
    .string()
    .transform((s) => s.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^(\+?234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number.")),
  startingPrice: z.coerce
    .number({ message: "Enter a starting price." })
    .int()
    .min(RULES.minStartingPrice, `Minimum starting price is ₦${RULES.minStartingPrice.toLocaleString()}.`),
  yearsExperience: z.coerce.number().int().min(0).max(60),
});

const Schema = z.discriminatedUnion("role", [ClientSchema, ArtisanSchema]);

async function uniqueSlug(base: string) {
  const root = slugify(base) || "artisan";
  for (let i = 0; i < 50; i++) {
    const s = i === 0 ? root : `${root}-${i + 1}`;
    if (!(await db.provider.findUnique({ where: { slug: s }, select: { id: true } }))) return s;
  }
  return `${root}-${Date.now().toString(36)}`;
}

export async function completeOnboarding(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");
  if (user.onboarded) redirect("/continue");

  const res = await run(async () => {
    const input = Schema.parse(formToObject(fd));

    if (input.role === "CLIENT") {
      await db.user.update({ where: { id: user.id }, data: { name: input.name, area: input.area, role: "CLIENT", onboarded: true } });
      return;
    }

    if (BLOCKED_CATEGORIES.some((b) => b.id === input.categoryId)) throw new DomainError("This trade can't be listed on Servhive.");
    const category = await db.category.findUnique({ where: { id: input.categoryId } });
    if (!category) throw new DomainError("Choose a valid trade.");

    const trialEndsAt = new Date();
    trialEndsAt.setMonth(trialEndsAt.getMonth() + RULES.freeTrialMonths);

    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { name: input.name, area: input.area, phone: input.phone, role: "ARTISAN", onboarded: true },
      }),
      db.provider.create({
        data: {
          slug: await uniqueSlug(input.businessName),
          userId: user.id,
          businessName: input.businessName,
          ownerName: input.name,
          categoryId: category.id,
          subSpecialty: input.subSpecialty || null,
          area: input.area,
          areasCovered: [input.area],
          phone: input.phone,
          startingPrice: input.startingPrice,
          yearsExperience: input.yearsExperience,
          // DRAFT until they upload ID + work photos and submit from /pro/verification.
          status: "DRAFT",
          trialEndsAt,
          lat: null,
          lng: null,
        },
      }),
    ]);
  });

  if (!res.ok) return res;
  redirect("/continue");
}
