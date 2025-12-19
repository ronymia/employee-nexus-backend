/*
  Warnings:

  - You are about to drop the column `created_by` on the `departments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_created_by_fkey";

-- AlterTable
ALTER TABLE "departments" DROP COLUMN "created_by",
ALTER COLUMN "manager_id" DROP NOT NULL;
