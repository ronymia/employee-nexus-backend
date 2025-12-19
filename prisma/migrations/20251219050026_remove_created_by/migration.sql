/*
  Warnings:

  - You are about to drop the column `created_by` on the `employment_statuses` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `job_platforms` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `job_types` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "employment_statuses" DROP CONSTRAINT "employment_statuses_created_by_fkey";

-- DropForeignKey
ALTER TABLE "job_platforms" DROP CONSTRAINT "job_platforms_created_by_fkey";

-- DropForeignKey
ALTER TABLE "job_types" DROP CONSTRAINT "job_types_created_by_fkey";

-- AlterTable
ALTER TABLE "employment_statuses" DROP COLUMN "created_by";

-- AlterTable
ALTER TABLE "job_platforms" DROP COLUMN "created_by";

-- AlterTable
ALTER TABLE "job_types" DROP COLUMN "created_by";
