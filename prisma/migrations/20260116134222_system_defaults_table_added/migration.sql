/*
  Warnings:

  - You are about to drop the column `is_active` on the `business_subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `leave_hours` on the `leave_types` table. All the data in the column will be lost.
  - You are about to drop the column `channels` on the `notification_templates` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `notification_templates` table. All the data in the column will be lost.
  - You are about to drop the column `action_url` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `channels` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `is_read` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `sent_via` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `payroll_components` table. All the data in the column will be lost.
  - You are about to drop the `notification_preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationTemplateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PayrollComponentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PUBLISHED', 'ARCHIVED', 'DISABLED');

-- CreateEnum
CREATE TYPE "CommonStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PUBLISHED', 'ARCHIVED', 'DISABLED');

-- DropForeignKey
ALTER TABLE "notification_preferences" DROP CONSTRAINT "notification_preferences_user_id_fkey";

-- DropIndex
DROP INDEX "notification_templates_is_active_idx";

-- DropIndex
DROP INDEX "notifications_expires_at_idx";

-- DropIndex
DROP INDEX "notifications_user_id_is_read_idx";

-- DropIndex
DROP INDEX "payroll_components_business_id_is_active_idx";

-- DropIndex
DROP INDEX "payroll_components_is_active_idx";

-- AlterTable
ALTER TABLE "business_subscriptions" DROP COLUMN "is_active";

-- AlterTable
ALTER TABLE "leave_types" DROP COLUMN "leave_hours",
ADD COLUMN     "leave_minutes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "notification_templates" DROP COLUMN "channels",
DROP COLUMN "is_active",
ADD COLUMN     "status" "NotificationTemplateStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "action_url",
DROP COLUMN "channels",
DROP COLUMN "expires_at",
DROP COLUMN "is_read",
DROP COLUMN "sent_via";

-- AlterTable
ALTER TABLE "payroll_components" DROP COLUMN "is_active",
ADD COLUMN     "status" "PayrollComponentStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "notification_preferences";

-- CreateTable
CREATE TABLE "system_defaults" (
    "business_id" INTEGER NOT NULL,
    "default_department_id" INTEGER NOT NULL,
    "default_work_site_id" INTEGER NOT NULL,
    "default_work_schedule_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_defaults_pkey" PRIMARY KEY ("business_id")
);

-- CreateIndex
CREATE INDEX "system_defaults_default_department_id_idx" ON "system_defaults"("default_department_id");

-- CreateIndex
CREATE INDEX "system_defaults_default_work_site_id_idx" ON "system_defaults"("default_work_site_id");

-- CreateIndex
CREATE INDEX "system_defaults_default_work_schedule_id_idx" ON "system_defaults"("default_work_schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_defaults_business_id_key" ON "system_defaults"("business_id");

-- CreateIndex
CREATE INDEX "notification_templates_status_idx" ON "notification_templates"("status");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");

-- CreateIndex
CREATE INDEX "payroll_components_status_idx" ON "payroll_components"("status");

-- CreateIndex
CREATE INDEX "payroll_components_business_id_status_idx" ON "payroll_components"("business_id", "status");

-- AddForeignKey
ALTER TABLE "system_defaults" ADD CONSTRAINT "system_defaults_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_defaults" ADD CONSTRAINT "system_defaults_default_department_id_fkey" FOREIGN KEY ("default_department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_defaults" ADD CONSTRAINT "system_defaults_default_work_site_id_fkey" FOREIGN KEY ("default_work_site_id") REFERENCES "work_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_defaults" ADD CONSTRAINT "system_defaults_default_work_schedule_id_fkey" FOREIGN KEY ("default_work_schedule_id") REFERENCES "work_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
