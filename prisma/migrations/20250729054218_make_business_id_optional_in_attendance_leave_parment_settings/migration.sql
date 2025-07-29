/*
  Warnings:

  - You are about to drop the column `is_enabled` on the `system_modules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attendance_settings" DROP CONSTRAINT "attendance_settings_business_id_fkey";

-- DropForeignKey
ALTER TABLE "leave_settings" DROP CONSTRAINT "leave_settings_business_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_settings" DROP CONSTRAINT "payment_settings_business_id_fkey";

-- AlterTable
ALTER TABLE "attendance_settings" ALTER COLUMN "business_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "leave_settings" ALTER COLUMN "business_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payment_settings" ALTER COLUMN "business_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "service_plans" ALTER COLUMN "status" SET DEFAULT 'Active';

-- AlterTable
ALTER TABLE "system_modules" DROP COLUMN "is_enabled";

-- AddForeignKey
ALTER TABLE "attendance_settings" ADD CONSTRAINT "attendance_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_settings" ADD CONSTRAINT "leave_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_settings" ADD CONSTRAINT "payment_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
