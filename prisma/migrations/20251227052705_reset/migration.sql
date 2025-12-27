/*
  Warnings:

  - You are about to drop the column `created_by` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `break_hours` on the `attendance_punches` table. All the data in the column will be lost.
  - You are about to drop the column `work_hours` on the `attendance_punches` table. All the data in the column will be lost.
  - You are about to drop the column `is_geo_location_enabled` on the `attendance_settings` table. All the data in the column will be lost.
  - You are about to drop the column `break_hours` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `total_hours` on the `attendances` table. All the data in the column will be lost.
  - The `delete_read_notifications` column on the `business_settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `lat` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `designation_id` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `employment_status_id` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `work_schedule_id` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `holidays` table. All the data in the column will be lost.
  - You are about to drop the column `total_hours` on the `leaves` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `onboarding_processes` table. All the data in the column will be lost.
  - You are about to drop the column `overtime_hours` on the `payroll_items` table. All the data in the column will be lost.
  - You are about to alter the column `present_days` on the `payroll_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `absent_days` on the `payroll_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `leave_days` on the `payroll_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `created_by` on the `payslip_adjustments` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `recruitment_processes` table. All the data in the column will be lost.
  - The primary key for the `social_links` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `profile_id` on the `social_links` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `subscription_plans` table. All the data in the column will be lost.
  - The primary key for the `user_work_sites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_work_sites` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `work_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `work_sites` table. All the data in the column will be lost.
  - You are about to drop the `employee_schedule_assignments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,email]` on the table `businesses` will be added. If there are existing duplicate values, this will fail.
  - Made the column `asset_type_id` on table `assets` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `break_minutes` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_minutes` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Made the column `city` on table `education_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `education_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `job_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `business_id` on table `job_types` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `total_minutes` to the `leaves` table without a default value. This is not possible if the table is not empty.
  - Made the column `business_id` on table `notification_templates` required. This step will fail if there are existing NULL values in that column.
  - Made the column `business_id` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `business_id` on table `onboarding_processes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `business_id` on table `recruitment_processes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_id` to the `social_links` table without a default value. This is not possible if the table is not empty.
  - Made the column `role_id` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `business_id` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `work_sites` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "asset_assignments" DROP CONSTRAINT "asset_assignments_assigned_by_fkey";

-- DropForeignKey
ALTER TABLE "assets" DROP CONSTRAINT "assets_created_by_fkey";

-- DropForeignKey
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "employee_schedule_assignments" DROP CONSTRAINT "employee_schedule_assignments_assigned_by_fkey";

-- DropForeignKey
ALTER TABLE "employee_schedule_assignments" DROP CONSTRAINT "employee_schedule_assignments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "employee_schedule_assignments" DROP CONSTRAINT "employee_schedule_assignments_work_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_department_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_designation_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_employment_status_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_work_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "holidays" DROP CONSTRAINT "holidays_created_by_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_notification_template_id_fkey";

-- DropForeignKey
ALTER TABLE "onboarding_processes" DROP CONSTRAINT "onboarding_processes_created_by_fkey";

-- DropForeignKey
ALTER TABLE "recruitment_processes" DROP CONSTRAINT "recruitment_processes_created_by_fkey";

-- DropForeignKey
ALTER TABLE "social_links" DROP CONSTRAINT "social_links_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription_plans" DROP CONSTRAINT "subscription_plans_created_by_fkey";

-- DropForeignKey
ALTER TABLE "work_schedules" DROP CONSTRAINT "work_schedules_created_by_fkey";

-- DropForeignKey
ALTER TABLE "work_sites" DROP CONSTRAINT "work_sites_created_by_fkey";

-- DropIndex
DROP INDEX "businesses_name_owner_id_email_key";

-- DropIndex
DROP INDEX "businesses_owner_id_key";

-- DropIndex
DROP INDEX "user_work_sites_user_id_work_site_id_key";

-- AlterTable
ALTER TABLE "assets" DROP COLUMN "created_by",
ALTER COLUMN "asset_type_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "attendance_punches" DROP COLUMN "break_hours",
DROP COLUMN "work_hours",
ADD COLUMN     "break_minutes" DOUBLE PRECISION,
ADD COLUMN     "work_minutes" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "attendance_settings" DROP COLUMN "is_geo_location_enabled";

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "break_hours",
DROP COLUMN "total_hours",
ADD COLUMN     "break_minutes" INTEGER NOT NULL,
ADD COLUMN     "total_minutes" INTEGER NOT NULL,
ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "business_settings" ADD COLUMN     "google_api_key" TEXT,
DROP COLUMN "delete_read_notifications",
ADD COLUMN     "delete_read_notifications" INTEGER NOT NULL DEFAULT 90;

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "owner_id",
DROP COLUMN "website",
ALTER COLUMN "number_of_employees_allowed" SET DEFAULT 1000;

-- AlterTable
ALTER TABLE "education_history" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "department_id",
DROP COLUMN "designation_id",
DROP COLUMN "employment_status_id",
DROP COLUMN "work_schedule_id";

-- AlterTable
ALTER TABLE "holidays" DROP COLUMN "created_by",
ALTER COLUMN "start_date" SET DATA TYPE DATE,
ALTER COLUMN "end_date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "job_history" ALTER COLUMN "city" SET NOT NULL;

-- AlterTable
ALTER TABLE "job_types" ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "leaves" DROP COLUMN "total_hours",
ADD COLUMN     "total_minutes" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "start_date" SET DATA TYPE DATE,
ALTER COLUMN "end_date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "notification_templates" ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "onboarding_processes" DROP COLUMN "created_by",
ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "payroll_cycles" ALTER COLUMN "period_start" SET DATA TYPE DATE,
ALTER COLUMN "period_end" SET DATA TYPE DATE,
ALTER COLUMN "payment_date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "payroll_items" DROP COLUMN "overtime_hours",
ADD COLUMN     "overtime_minutes" INTEGER,
ALTER COLUMN "present_days" SET DATA TYPE INTEGER,
ALTER COLUMN "absent_days" SET DATA TYPE INTEGER,
ALTER COLUMN "leave_days" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "payslip_adjustments" DROP COLUMN "created_by";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "lat",
DROP COLUMN "lng";

-- AlterTable
ALTER TABLE "recruitment_processes" DROP COLUMN "created_by",
ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "social_links" DROP CONSTRAINT "social_links_pkey",
DROP COLUMN "profile_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "social_links_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "subscription_plans" DROP COLUMN "created_by";

-- AlterTable
ALTER TABLE "user_work_sites" DROP CONSTRAINT "user_work_sites_pkey",
DROP COLUMN "id",
ADD COLUMN     "end_date" DATE,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "start_date" DATE,
ADD CONSTRAINT "user_work_sites_pkey" PRIMARY KEY ("user_id", "work_site_id");

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role_id" SET NOT NULL,
ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "work_schedules" DROP COLUMN "created_by";

-- AlterTable
ALTER TABLE "work_sites" DROP COLUMN "created_by",
ALTER COLUMN "description" SET NOT NULL;

-- DropTable
DROP TABLE "employee_schedule_assignments";

-- CreateTable
CREATE TABLE "employee_designations" (
    "user_id" INTEGER NOT NULL,
    "designation_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "salary" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_designations_pkey" PRIMARY KEY ("user_id","designation_id")
);

-- CreateTable
CREATE TABLE "employee_departments" (
    "user_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "role_in_dept" TEXT DEFAULT 'member',
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_departments_pkey" PRIMARY KEY ("user_id","department_id")
);

-- CreateTable
CREATE TABLE "employee_schedules" (
    "user_id" INTEGER NOT NULL,
    "work_schedule_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "assigned_by" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_schedules_pkey" PRIMARY KEY ("user_id","work_schedule_id")
);

-- CreateTable
CREATE TABLE "employee_employment_statuses" (
    "user_id" INTEGER NOT NULL,
    "employment_status_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "reason" TEXT,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_employment_statuses_pkey" PRIMARY KEY ("user_id","employment_status_id")
);

-- CreateIndex
CREATE INDEX "employee_designations_user_id_idx" ON "employee_designations"("user_id");

-- CreateIndex
CREATE INDEX "employee_designations_designation_id_idx" ON "employee_designations"("designation_id");

-- CreateIndex
CREATE INDEX "employee_designations_user_id_is_active_idx" ON "employee_designations"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "employee_designations_start_date_end_date_idx" ON "employee_designations"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "employee_departments_user_id_idx" ON "employee_departments"("user_id");

-- CreateIndex
CREATE INDEX "employee_departments_department_id_idx" ON "employee_departments"("department_id");

-- CreateIndex
CREATE INDEX "employee_departments_user_id_is_primary_idx" ON "employee_departments"("user_id", "is_primary");

-- CreateIndex
CREATE INDEX "employee_departments_user_id_is_active_idx" ON "employee_departments"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "employee_departments_start_date_end_date_idx" ON "employee_departments"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "employee_schedules_user_id_idx" ON "employee_schedules"("user_id");

-- CreateIndex
CREATE INDEX "employee_schedules_work_schedule_id_idx" ON "employee_schedules"("work_schedule_id");

-- CreateIndex
CREATE INDEX "employee_schedules_user_id_is_active_idx" ON "employee_schedules"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "employee_employment_statuses_user_id_idx" ON "employee_employment_statuses"("user_id");

-- CreateIndex
CREATE INDEX "employee_employment_statuses_employment_status_id_idx" ON "employee_employment_statuses"("employment_status_id");

-- CreateIndex
CREATE INDEX "employee_employment_statuses_user_id_is_active_idx" ON "employee_employment_statuses"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "employee_employment_statuses_start_date_end_date_idx" ON "employee_employment_statuses"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "asset_assignments_status_idx" ON "asset_assignments"("status");

-- CreateIndex
CREATE INDEX "asset_assignments_assigned_to_status_idx" ON "asset_assignments"("assigned_to", "status");

-- CreateIndex
CREATE INDEX "asset_types_status_idx" ON "asset_types"("status");

-- CreateIndex
CREATE INDEX "assets_status_idx" ON "assets"("status");

-- CreateIndex
CREATE INDEX "assets_asset_type_id_idx" ON "assets"("asset_type_id");

-- CreateIndex
CREATE INDEX "attendances_status_idx" ON "attendances"("status");

-- CreateIndex
CREATE INDEX "attendances_user_id_status_idx" ON "attendances"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_name_email_key" ON "businesses"("name", "email");

-- CreateIndex
CREATE INDEX "departments_business_id_idx" ON "departments"("business_id");

-- CreateIndex
CREATE INDEX "departments_status_idx" ON "departments"("status");

-- CreateIndex
CREATE INDEX "employees_joining_date_idx" ON "employees"("joining_date");

-- CreateIndex
CREATE INDEX "employees_rota_type_idx" ON "employees"("rota_type");

-- CreateIndex
CREATE INDEX "holidays_holiday_type_idx" ON "holidays"("holiday_type");

-- CreateIndex
CREATE INDEX "leave_type_employment_status_leave_type_id_idx" ON "leave_type_employment_status"("leave_type_id");

-- CreateIndex
CREATE INDEX "leave_type_employment_status_employment_status_id_idx" ON "leave_type_employment_status"("employment_status_id");

-- CreateIndex
CREATE INDEX "leave_types_status_idx" ON "leave_types"("status");

-- CreateIndex
CREATE INDEX "leaves_reviewed_by_idx" ON "leaves"("reviewed_by");

-- CreateIndex
CREATE INDEX "notification_templates_is_active_idx" ON "notification_templates"("is_active");

-- CreateIndex
CREATE INDEX "payroll_components_is_active_idx" ON "payroll_components"("is_active");

-- CreateIndex
CREATE INDEX "payroll_components_business_id_is_active_idx" ON "payroll_components"("business_id", "is_active");

-- CreateIndex
CREATE INDEX "payslip_adjustments_type_idx" ON "payslip_adjustments"("type");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_created_by_idx" ON "projects"("created_by");

-- CreateIndex
CREATE INDEX "projects_start_date_end_date_idx" ON "projects"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "user_work_sites_user_id_is_active_idx" ON "user_work_sites"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "user_work_sites_start_date_end_date_idx" ON "user_work_sites"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE INDEX "users_business_id_idx" ON "users"("business_id");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_business_id_status_idx" ON "users"("business_id", "status");

-- CreateIndex
CREATE INDEX "work_schedules_business_id_idx" ON "work_schedules"("business_id");

-- CreateIndex
CREATE INDEX "work_schedules_status_idx" ON "work_schedules"("status");

-- AddForeignKey
ALTER TABLE "employee_designations" ADD CONSTRAINT "employee_designations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "employees"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_designations" ADD CONSTRAINT "employee_designations_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_departments" ADD CONSTRAINT "employee_departments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "employees"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_departments" ADD CONSTRAINT "employee_departments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_schedules" ADD CONSTRAINT "employee_schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "employees"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_schedules" ADD CONSTRAINT "employee_schedules_work_schedule_id_fkey" FOREIGN KEY ("work_schedule_id") REFERENCES "work_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_schedules" ADD CONSTRAINT "employee_schedules_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_employment_statuses" ADD CONSTRAINT "employee_employment_statuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "employees"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_employment_statuses" ADD CONSTRAINT "employee_employment_statuses_employment_status_id_fkey" FOREIGN KEY ("employment_status_id") REFERENCES "employment_statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notification_template_id_fkey" FOREIGN KEY ("notification_template_id") REFERENCES "notification_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
