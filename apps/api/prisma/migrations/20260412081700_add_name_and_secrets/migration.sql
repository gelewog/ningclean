-- Migration: Add name and secrets fields to notification_settings

-- Add name column
ALTER TABLE "notification_settings" ADD COLUMN "name" TEXT;

-- Update existing records dengan default name
UPDATE "notification_settings" SET "name" = 'default' WHERE "name" IS NULL;

-- Set NOT NULL constraint
ALTER TABLE "notification_settings" ALTER COLUMN "name" SET NOT NULL;

-- Add unique constraint pada name
CREATE UNIQUE INDEX "notification_settings_name_key" ON "notification_settings"("name");

-- Add secrets column
ALTER TABLE "notification_settings" ADD COLUMN "secrets" JSONB;

