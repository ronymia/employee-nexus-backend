/*
  Warnings:

  - You are about to drop the column `minimum_working_days_per_week` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `nid` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `salary_per_annum` on the `employees` table. All the data in the column will be lost.
  - Added the required column `nid_number` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary_per_month` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_role_id_fkey";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "minimum_working_days_per_week",
DROP COLUMN "nid",
DROP COLUMN "role_id",
DROP COLUMN "salary_per_annum",
ADD COLUMN     "nid_number" TEXT NOT NULL,
ADD COLUMN     "salary_per_month" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "working_days_per_week" INTEGER,
ADD COLUMN     "working_hours_per_week" INTEGER;
