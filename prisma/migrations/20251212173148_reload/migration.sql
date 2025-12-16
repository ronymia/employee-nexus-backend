/*
  Warnings:

  - You are about to drop the column `break_end` on the `attendance_punches` table. All the data in the column will be lost.
  - You are about to drop the column `break_start` on the `attendance_punches` table. All the data in the column will be lost.
  - The primary key for the `attendance_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `attendance_settings` table. All the data in the column will be lost.
  - The primary key for the `business_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `business_settings` table. All the data in the column will be lost.
  - The `trial_end_date` column on the `business_subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `start_date` column on the `business_subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `end_date` column on the `business_subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `user_id` on the `businesses` table. All the data in the column will be lost.
  - The primary key for the `employees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `employees` table. All the data in the column will be lost.
  - The primary key for the `leave_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `leave_settings` table. All the data in the column will be lost.
  - The `channels` column on the `notification_templates` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `channels` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sent_via` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `payment_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `payment_settings` table. All the data in the column will be lost.
  - You are about to drop the column `payment_type` on the `payment_settings` table. All the data in the column will be lost.
  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `break_type` on the `work_schedules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_id]` on the table `businesses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner_id,email]` on the table `businesses` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `asset_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `business_id` on table `asset_types` required. This step will fail if there are existing NULL values in that column.
  - Made the column `business_id` on table `assets` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `business_schedules` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `business_subscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `owner_id` to the `businesses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `registration_date` on the `businesses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `businesses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `departments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `business_id` on table `departments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `manager_id` on table `departments` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `status` on the `designations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `employment_statuses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `business_id` on table `employment_statuses` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `holiday_type` on the `holidays` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `business_id` on table `holidays` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `status` on the `job_platforms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `job_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `leave_rollover_type` on the `leave_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `leave_types` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `business_id` on table `leave_types` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `leave_duration` on the `leaves` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `notification_templates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `priority` on the `notification_templates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `priority` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `onboarding_processes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `default_payment_method` to the `payment_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_frequency` to the `payment_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `payment_settings` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `component_type` on the `payroll_components` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `calculation_type` on the `payroll_components` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `business_id` on table `payroll_components` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `frequency` on the `payroll_cycles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `payroll_cycles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `payroll_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `payment_method` on table `payroll_items` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `date_of_birth` on the `profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `gender` on the `profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `marital_status` on the `profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `recruitment_processes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `subscription_plans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `breakType` to the `work_schedules` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `work_schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `scheduleType` on the `work_schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `business_id` on table `work_schedules` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `status` on the `work_sites` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('WEEKLY', 'BI_WEEKLY', 'SEMI_MONTHLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CHECK', 'CASH', 'MOBILE_MONEY');

-- DropForeignKey
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "emergency_contacts" DROP CONSTRAINT "emergency_contacts_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "social_links" DROP CONSTRAINT "social_links_profile_id_fkey";

-- DropIndex
DROP INDEX "attendance_settings_business_id_key";

-- DropIndex
DROP INDEX "business_settings_business_id_key";

-- DropIndex
DROP INDEX "businesses_name_user_id_email_key";

-- DropIndex
DROP INDEX "businesses_user_id_key";

-- DropIndex
DROP INDEX "employees_user_id_key";

-- DropIndex
DROP INDEX "leave_settings_business_id_key";

-- DropIndex
DROP INDEX "payment_settings_business_id_key";

-- DropIndex
DROP INDEX "profiles_user_id_key";

-- AlterTable
ALTER TABLE "asset_types" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "assets" ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "attendance_punches" DROP COLUMN "break_end",
DROP COLUMN "break_start";

-- AlterTable
ALTER TABLE "attendance_settings" DROP CONSTRAINT "attendance_settings_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "attendance_settings_pkey" PRIMARY KEY ("business_id");

-- AlterTable
ALTER TABLE "business_schedules" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "business_settings" DROP CONSTRAINT "business_settings_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "business_settings_pkey" PRIMARY KEY ("business_id");

-- AlterTable
ALTER TABLE "business_subscriptions" DROP COLUMN "trial_end_date",
ADD COLUMN     "trial_end_date" TIMESTAMP(3),
DROP COLUMN "start_date",
ADD COLUMN     "start_date" TIMESTAMP(3),
DROP COLUMN "end_date",
ADD COLUMN     "end_date" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "user_id",
ADD COLUMN     "owner_id" INTEGER NOT NULL,
DROP COLUMN "registration_date",
ADD COLUMN     "registration_date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "departments" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "business_id" SET NOT NULL,
ALTER COLUMN "manager_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "designations" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "employees" DROP CONSTRAINT "employees_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "employment_statuses" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "holidays" DROP COLUMN "holiday_type",
ADD COLUMN     "holiday_type" TEXT NOT NULL,
ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "job_platforms" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "job_types" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "leave_settings" DROP CONSTRAINT "leave_settings_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "leave_settings_pkey" PRIMARY KEY ("business_id");

-- AlterTable
ALTER TABLE "leave_types" DROP COLUMN "leave_rollover_type",
ADD COLUMN     "leave_rollover_type" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "leaves" DROP COLUMN "leave_duration",
ADD COLUMN     "leave_duration" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "created_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notification_templates" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "priority",
ADD COLUMN     "priority" TEXT NOT NULL,
DROP COLUMN "channels",
ADD COLUMN     "channels" TEXT[];

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "priority",
ADD COLUMN     "priority" TEXT NOT NULL,
DROP COLUMN "channels",
ADD COLUMN     "channels" TEXT[],
DROP COLUMN "sent_via",
ADD COLUMN     "sent_via" TEXT[];

-- AlterTable
ALTER TABLE "onboarding_processes" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payment_settings" DROP CONSTRAINT "payment_settings_pkey",
DROP COLUMN "id",
DROP COLUMN "payment_type",
ADD COLUMN     "allow_partial_payments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "auto_approve_payments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "default_payment_method" TEXT NOT NULL,
ADD COLUMN     "grace_period_days" INTEGER DEFAULT 3,
ADD COLUMN     "payment_frequency" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "payment_settings_pkey" PRIMARY KEY ("business_id");

-- AlterTable
ALTER TABLE "payroll_components" DROP COLUMN "component_type",
ADD COLUMN     "component_type" TEXT NOT NULL,
DROP COLUMN "calculation_type",
ADD COLUMN     "calculation_type" TEXT NOT NULL,
ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "payroll_cycles" DROP COLUMN "frequency",
ADD COLUMN     "frequency" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payroll_items" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "payment_method" SET NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey",
DROP COLUMN "id",
DROP COLUMN "date_of_birth",
ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT NOT NULL,
DROP COLUMN "marital_status",
ADD COLUMN     "marital_status" TEXT NOT NULL,
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "project_members" ADD COLUMN     "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "recruitment_processes" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subscription_plans" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "work_schedules" DROP COLUMN "break_type",
ADD COLUMN     "breakType" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
DROP COLUMN "scheduleType",
ADD COLUMN     "scheduleType" TEXT NOT NULL,
ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "work_sites" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- DropEnum
DROP TYPE "BusinessStatus";

-- DropEnum
DROP TYPE "CalculationType";

-- DropEnum
DROP TYPE "ComponentType";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "HolidayType";

-- DropEnum
DROP TYPE "LeaveDuration";

-- DropEnum
DROP TYPE "LeaveRolloverType";

-- DropEnum
DROP TYPE "MaritalStatus";

-- DropEnum
DROP TYPE "NotificationChannel";

-- DropEnum
DROP TYPE "NotificationPriority";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "PayrollCycleStatus";

-- DropEnum
DROP TYPE "PayrollFrequency";

-- DropEnum
DROP TYPE "PayrollItemStatus";

-- DropEnum
DROP TYPE "ScheduleBreakType";

-- DropEnum
DROP TYPE "ScheduleType";

-- DropEnum
DROP TYPE "Status";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "UserAccountStatus";

-- CreateIndex
CREATE UNIQUE INDEX "businesses_owner_id_key" ON "businesses"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_name_owner_id_email_key" ON "businesses"("name", "owner_id", "email");

-- CreateIndex
CREATE INDEX "notification_templates_type_idx" ON "notification_templates"("type");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "payroll_components_component_type_idx" ON "payroll_components"("component_type");

-- CreateIndex
CREATE INDEX "payroll_cycles_status_idx" ON "payroll_cycles"("status");

-- CreateIndex
CREATE INDEX "payroll_items_status_idx" ON "payroll_items"("status");

-- CreateIndex
CREATE INDEX "work_schedules_scheduleType_business_id_idx" ON "work_schedules"("scheduleType", "business_id");

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
