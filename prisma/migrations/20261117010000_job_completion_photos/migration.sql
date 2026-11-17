-- AlterTable: proof-of-work photos attached when a provider marks a job complete (A.6)
ALTER TABLE "EscrowJob" ADD COLUMN "completionPhotos" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
