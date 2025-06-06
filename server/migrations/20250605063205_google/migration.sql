-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'local',
ADD COLUMN     "provider_id" VARCHAR(255);
