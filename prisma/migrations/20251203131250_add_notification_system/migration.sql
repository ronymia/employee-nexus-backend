/*
  Warnings:

  - The values [REMINDER] on the enum `NotificationPriority` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationPriority_new" AS ENUM ('LOW', 'NORMAL', 'MEDIUM', 'HIGH', 'URGENT');
ALTER TABLE "notification_templates" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "notifications" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "notification_templates" ALTER COLUMN "priority" TYPE "NotificationPriority_new" USING ("priority"::text::"NotificationPriority_new");
ALTER TABLE "notifications" ALTER COLUMN "priority" TYPE "NotificationPriority_new" USING ("priority"::text::"NotificationPriority_new");
ALTER TYPE "NotificationPriority" RENAME TO "NotificationPriority_old";
ALTER TYPE "NotificationPriority_new" RENAME TO "NotificationPriority";
DROP TYPE "NotificationPriority_old";
ALTER TABLE "notification_templates" ALTER COLUMN "priority" SET DEFAULT 'NORMAL';
ALTER TABLE "notifications" ALTER COLUMN "priority" SET DEFAULT 'NORMAL';
COMMIT;

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'REMINDER';
