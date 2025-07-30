/*
  Warnings:

  - You are about to drop the column `employment_status_ids` on the `leave_types` table. All the data in the column will be lost.
  - The `status` column on the `service_plans` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shift` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[business_id]` on the table `BusinessSchedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,user_id,email]` on the table `businesses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `designations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `employment_statuses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `job_platforms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `job_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `leave_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `onboarding_processes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `recruitment_processes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `work_schedules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,business_id]` on the table `work_sites` will be added. If there are existing duplicate values, this will fail.
  - Made the column `business_id` on table `attendance_settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `business_id` on table `leave_settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `business_id` on table `payment_settings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BusinessSchedule" DROP CONSTRAINT "BusinessSchedule_business_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_work_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "attendance_settings" DROP CONSTRAINT "attendance_settings_business_id_fkey";

-- DropForeignKey
ALTER TABLE "business_modules" DROP CONSTRAINT "business_modules_service_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "business_modules" DROP CONSTRAINT "business_modules_system_module_id_fkey";

-- DropForeignKey
ALTER TABLE "business_settings" DROP CONSTRAINT "business_settings_business_id_fkey";

-- DropForeignKey
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_business_id_fkey";

-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "designations" DROP CONSTRAINT "designations_business_id_fkey";

-- DropForeignKey
ALTER TABLE "employment_statuses" DROP CONSTRAINT "employment_statuses_business_id_fkey";

-- DropForeignKey
ALTER TABLE "job_platforms" DROP CONSTRAINT "job_platforms_business_id_fkey";

-- DropForeignKey
ALTER TABLE "job_types" DROP CONSTRAINT "job_types_business_id_fkey";

-- DropForeignKey
ALTER TABLE "leave_settings" DROP CONSTRAINT "leave_settings_business_id_fkey";

-- DropForeignKey
ALTER TABLE "leave_types" DROP CONSTRAINT "leave_types_business_id_fkey";

-- DropForeignKey
ALTER TABLE "onboarding_processes" DROP CONSTRAINT "onboarding_processes_business_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_settings" DROP CONSTRAINT "payment_settings_business_id_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "recruitment_processes" DROP CONSTRAINT "recruitment_processes_business_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_role_id_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_business_id_fkey";

-- DropForeignKey
ALTER TABLE "service_plan_modules" DROP CONSTRAINT "service_plan_modules_service_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "service_plan_modules" DROP CONSTRAINT "service_plan_modules_system_module_id_fkey";

-- DropForeignKey
ALTER TABLE "service_plans" DROP CONSTRAINT "service_plans_created_by_fkey";

-- DropForeignKey
ALTER TABLE "user_permissions" DROP CONSTRAINT "user_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "user_permissions" DROP CONSTRAINT "user_permissions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- DropForeignKey
ALTER TABLE "work_schedules" DROP CONSTRAINT "work_schedules_business_id_fkey";

-- DropForeignKey
ALTER TABLE "work_sites" DROP CONSTRAINT "work_sites_business_id_fkey";

-- DropIndex
DROP INDEX "businesses_email_key";

-- DropIndex
DROP INDEX "businesses_phone_key";

-- DropIndex
DROP INDEX "departments_name_key";

-- DropIndex
DROP INDEX "employment_statuses_name_key";

-- DropIndex
DROP INDEX "job_platforms_name_key";

-- DropIndex
DROP INDEX "job_types_name_key";

-- DropIndex
DROP INDEX "leave_types_name_key";

-- DropIndex
DROP INDEX "onboarding_processes_name_key";

-- DropIndex
DROP INDEX "recruitment_processes_name_key";

-- DropIndex
DROP INDEX "roles_name_key";

-- DropIndex
DROP INDEX "work_schedules_name_key";

-- DropIndex
DROP INDEX "work_sites_name_key";

-- AlterTable
ALTER TABLE "attendance_settings" ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "leave_settings" ALTER COLUMN "business_id" SET NOT NULL,
ALTER COLUMN "start_month" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "leave_types" DROP COLUMN "employment_status_ids";

-- AlterTable
ALTER TABLE "payment_settings" ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "service_plans" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Active';

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "Shift";

-- CreateTable
CREATE TABLE "work_day_schedules" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "is_weekend" BOOLEAN NOT NULL,
    "work_schedule_id" INTEGER NOT NULL,

    CONSTRAINT "work_day_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_day_schedules_shifts" (
    "id" SERIAL NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "schedule_id" INTEGER NOT NULL,

    CONSTRAINT "work_day_schedules_shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_type_employment_status" (
    "leave_type_id" INTEGER NOT NULL,
    "employment_status_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "work_day_schedules_work_schedule_id_day_key" ON "work_day_schedules"("work_schedule_id", "day");

-- CreateIndex
CREATE UNIQUE INDEX "work_day_schedules_shifts_schedule_id_start_time_end_time_key" ON "work_day_schedules_shifts"("schedule_id", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "leave_type_employment_status_leave_type_id_employment_statu_key" ON "leave_type_employment_status"("leave_type_id", "employment_status_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSchedule_business_id_key" ON "BusinessSchedule"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_name_user_id_email_key" ON "businesses"("name", "user_id", "email");

-- CreateIndex
CREATE INDEX "departments_manager_id_idx" ON "departments"("manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_business_id_key" ON "departments"("name", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "designations_name_business_id_key" ON "designations"("name", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "employment_statuses_name_business_id_key" ON "employment_statuses"("name", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_platforms_name_business_id_key" ON "job_platforms"("name", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_types_name_business_id_key" ON "job_types"("name", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "leave_types_name_business_id_key" ON "leave_types"("name", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_processes_name_business_id_key" ON "onboarding_processes"("name", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "recruitment_processes_name_business_id_key" ON "recruitment_processes"("name", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_business_id_key" ON "roles"("name", "business_id");

-- CreateIndex
CREATE INDEX "work_schedules_scheduleType_idx" ON "work_schedules"("scheduleType");

-- CreateIndex
CREATE UNIQUE INDEX "work_schedules_name_business_id_key" ON "work_schedules"("name", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_sites_name_business_id_key" ON "work_sites"("name", "business_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_settings" ADD CONSTRAINT "business_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_settings" ADD CONSTRAINT "attendance_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_settings" ADD CONSTRAINT "leave_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_settings" ADD CONSTRAINT "payment_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessSchedule" ADD CONSTRAINT "BusinessSchedule_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_plans" ADD CONSTRAINT "service_plans_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_plan_modules" ADD CONSTRAINT "service_plan_modules_service_plan_id_fkey" FOREIGN KEY ("service_plan_id") REFERENCES "service_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_plan_modules" ADD CONSTRAINT "service_plan_modules_system_module_id_fkey" FOREIGN KEY ("system_module_id") REFERENCES "system_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_modules" ADD CONSTRAINT "business_modules_service_plan_id_fkey" FOREIGN KEY ("service_plan_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_modules" ADD CONSTRAINT "business_modules_system_module_id_fkey" FOREIGN KEY ("system_module_id") REFERENCES "system_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designations" ADD CONSTRAINT "designations_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_types" ADD CONSTRAINT "job_types_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_platforms" ADD CONSTRAINT "job_platforms_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruitment_processes" ADD CONSTRAINT "recruitment_processes_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_processes" ADD CONSTRAINT "onboarding_processes_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_sites" ADD CONSTRAINT "work_sites_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_schedules" ADD CONSTRAINT "work_schedules_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_day_schedules" ADD CONSTRAINT "work_day_schedules_work_schedule_id_fkey" FOREIGN KEY ("work_schedule_id") REFERENCES "work_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_day_schedules_shifts" ADD CONSTRAINT "work_day_schedules_shifts_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "work_day_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employment_statuses" ADD CONSTRAINT "employment_statuses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_type_employment_status" ADD CONSTRAINT "leave_type_employment_status_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_type_employment_status" ADD CONSTRAINT "leave_type_employment_status_employment_status_id_fkey" FOREIGN KEY ("employment_status_id") REFERENCES "employment_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_types" ADD CONSTRAINT "leave_types_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
