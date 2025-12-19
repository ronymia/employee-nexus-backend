/*
  Warnings:

  - You are about to drop the column `created_by` on the `leave_types` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "leave_types" DROP CONSTRAINT "leave_types_created_by_fkey";

-- AlterTable
ALTER TABLE "leave_types" DROP COLUMN "created_by";
