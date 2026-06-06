-- AlterTable: add premium fields to users table
ALTER TABLE "users" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "premiumSince" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "premiumPlan" TEXT;
ALTER TABLE "users" ADD COLUMN "isVerifiedPremium" BOOLEAN NOT NULL DEFAULT false;
