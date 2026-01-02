/*
  Warnings:

  - Made the column `role_in_dept` on table `employee_departments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_date` on table `user_work_sites` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "attendance_settings" ADD COLUMN     "is_geo_location_enabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "employee_departments" ALTER COLUMN "role_in_dept" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_work_sites" ALTER COLUMN "start_date" SET NOT NULL;
