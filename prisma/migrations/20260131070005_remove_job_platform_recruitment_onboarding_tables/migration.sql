/*
  Warnings:

  - You are about to drop the `job_platforms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `onboarding_processes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recruitment_processes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "job_platforms" DROP CONSTRAINT "job_platforms_business_id_fkey";

-- DropForeignKey
ALTER TABLE "onboarding_processes" DROP CONSTRAINT "onboarding_processes_business_id_fkey";

-- DropForeignKey
ALTER TABLE "recruitment_processes" DROP CONSTRAINT "recruitment_processes_business_id_fkey";

-- DropTable
DROP TABLE "job_platforms";

-- DropTable
DROP TABLE "onboarding_processes";

-- DropTable
DROP TABLE "recruitment_processes";
