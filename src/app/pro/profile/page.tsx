import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { loadPro } from "@/server/pro";
import {
  addWorkPhotoAction,
  deleteServiceAction,
  deleteWorkPhotoAction,
  saveServiceAction,
  updateProfileAction,
  updateProfilePhotoAction,
} from "@/server/pro-actions";
import { PageHeader } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button";
import { NoProvider } from "@/components/pro/no-provider";
import { ProfileForm, ProfilePhotoForm } from "@/components/pro/profile-form";
import { ServicesEditor } from "@/components/pro/services-editor";
import { WorkPhotos } from "@/components/pro/work-photos";
import { ProSection } from "@/components/pro/section";

export default async function ProProfilePage() {
  const { provider } = await loadPro("/pro/profile");
  if (!provider) return <NoProvider />;

  const [services, photos] = await Promise.all([
    db.service.findMany({ where: { providerId: provider.id }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    db.workPhoto.findMany({ where: { providerId: provider.id }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Your public profile"
        description={
          provider.status === "APPROVED"
            ? "Changes go live straight away. Your verified status stays."
            : "This is what clients will see once you're verified."
        }
        actions={
          provider.status === "APPROVED" ? (
            <Link href={`/artisans/${provider.slug}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              View public profile <ArrowUpRight />
            </Link>
          ) : null
        }
      />

      <ProSection n="01" title="Photo">
        <ProfilePhotoForm imageUrl={provider.imageUrl} name={provider.businessName} action={updateProfilePhotoAction} />
      </ProSection>

      <ProSection n="02" title="Details">
        <ProfileForm
          action={updateProfileAction}
          values={{
            businessName: provider.businessName,
            subSpecialty: provider.subSpecialty,
            bio: provider.bio,
            areasCovered: provider.areasCovered,
            area: provider.area,
            startingPrice: provider.startingPrice,
            responseTime: provider.responseTime,
            yearsExperience: provider.yearsExperience,
            phone: provider.phone,
            imageUrl: provider.imageUrl,
            categoryName: provider.category.name,
          }}
        />
      </ProSection>

      <ProSection n="03" title="Services" id="services">
        <ServicesEditor
          services={services.map((s) => ({ id: s.id, name: s.name, price: s.price, priceType: s.priceType, unitLabel: s.unitLabel }))}
          saveAction={saveServiceAction}
          deleteAction={deleteServiceAction}
        />
      </ProSection>

      <ProSection n="04" title="Work photos" id="photos">
        <WorkPhotos
          photos={photos.map((p) => ({ id: p.id, url: p.url, caption: p.caption, area: p.area }))}
          addAction={addWorkPhotoAction}
          deleteAction={deleteWorkPhotoAction}
        />
      </ProSection>
    </>
  );
}
