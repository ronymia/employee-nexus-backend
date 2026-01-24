/*
  Warnings:

  - You are about to drop the column `component_id` on the `employee_payroll_components` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `employee_payroll_components` table. All the data in the column will be lost.
  - You are about to drop the column `is_override` on the `employee_payroll_components` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `payslip_adjustments` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `payslip_adjustments` table. All the data in the column will be lost.
  - You are about to drop the column `is_recurring` on the `payslip_adjustments` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `payslip_adjustments` table. All the data in the column will be lost.
  - You are about to drop the `payroll_item_components` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,payroll_component_id]` on the table `employee_payroll_components` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payroll_component_id` to the `employee_payroll_components` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remarks` to the `payslip_adjustments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requested_by` to the `payslip_adjustments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `payslip_adjustments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `payslip_adjustments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdjustmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'APPLIED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "employee_payroll_components" DROP CONSTRAINT "employee_payroll_components_component_id_fkey";

-- DropForeignKey
ALTER TABLE "payroll_item_components" DROP CONSTRAINT "payroll_item_components_component_id_fkey";

-- DropForeignKey
ALTER TABLE "payroll_item_components" DROP CONSTRAINT "payroll_item_components_payroll_item_id_fkey";

-- DropIndex
DROP INDEX "employee_payroll_components_component_id_idx";

-- DropIndex
DROP INDEX "employee_payroll_components_user_id_component_id_effective__key";

-- DropIndex
DROP INDEX "employee_payroll_components_user_id_is_active_idx";

-- DropIndex
DROP INDEX "payslip_adjustments_type_idx";

-- AlterTable
ALTER TABLE "employee_payroll_components" DROP COLUMN "component_id",
DROP COLUMN "is_active",
DROP COLUMN "is_override",
ADD COLUMN     "payroll_component_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "payslip_adjustments" DROP COLUMN "amount",
DROP COLUMN "description",
DROP COLUMN "is_recurring",
DROP COLUMN "type",
ADD COLUMN     "applied_month" DATE,
ADD COLUMN     "payroll_component_id" INTEGER,
ADD COLUMN     "remarks" TEXT NOT NULL,
ADD COLUMN     "requested_by" INTEGER NOT NULL,
ADD COLUMN     "reviewed_at" TIMESTAMP(3),
ADD COLUMN     "reviewed_by" INTEGER,
ADD COLUMN     "status" "AdjustmentStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "payroll_item_id" DROP NOT NULL;

-- DropTable
DROP TABLE "payroll_item_components";

-- CreateIndex
CREATE INDEX "employee_payroll_components_payroll_component_id_idx" ON "employee_payroll_components"("payroll_component_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_payroll_components_user_id_payroll_component_id_key" ON "employee_payroll_components"("user_id", "payroll_component_id");

-- CreateIndex
CREATE INDEX "payslip_adjustments_user_id_idx" ON "payslip_adjustments"("user_id");

-- CreateIndex
CREATE INDEX "payslip_adjustments_status_idx" ON "payslip_adjustments"("status");

-- CreateIndex
CREATE INDEX "payslip_adjustments_applied_month_idx" ON "payslip_adjustments"("applied_month");

-- CreateIndex
CREATE INDEX "payslip_adjustments_user_id_applied_month_idx" ON "payslip_adjustments"("user_id", "applied_month");

-- AddForeignKey
ALTER TABLE "employee_payroll_components" ADD CONSTRAINT "employee_payroll_components_payroll_component_id_fkey" FOREIGN KEY ("payroll_component_id") REFERENCES "payroll_components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip_adjustments" ADD CONSTRAINT "payslip_adjustments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "employees"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip_adjustments" ADD CONSTRAINT "payslip_adjustments_payroll_component_id_fkey" FOREIGN KEY ("payroll_component_id") REFERENCES "payroll_components"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip_adjustments" ADD CONSTRAINT "payslip_adjustments_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslip_adjustments" ADD CONSTRAINT "payslip_adjustments_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
