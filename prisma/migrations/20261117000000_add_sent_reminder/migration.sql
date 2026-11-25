-- CreateEnum
CREATE TYPE "ReminderKind" AS ENUM ('AUTO_RELEASE_24H', 'AUTO_RELEASE_SOON', 'SUBSCRIPTION_7D', 'SUBSCRIPTION_3D');

-- CreateTable
CREATE TABLE "SentReminder" (
    "id" TEXT NOT NULL,
    "kind" "ReminderKind" NOT NULL,
    "subject" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SentReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SentReminder_kind_subject_key" ON "SentReminder"("kind", "subject");
