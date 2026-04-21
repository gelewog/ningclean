-- Migration: Update NotificationSettings to use config JSON field
-- Drop old columns
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "whatsappNumber";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "whatsappMessage";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "whatsappEnabled";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "emailEnabled";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "emailHost";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "emailPort";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "emailUser";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "emailPassword";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "emailFrom";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "adminEmail";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "twilioaccountsid";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "twilioauthtoken";
ALTER TABLE "notification_settings" DROP COLUMN IF EXISTS "twiliofromnumber";

-- Add config JSON column
ALTER TABLE "notification_settings" ADD COLUMN "config" JSONB NOT NULL DEFAULT '{}';
