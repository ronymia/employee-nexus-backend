/*
  Warnings:

  - You are about to drop the `job_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "job_types" DROP CONSTRAINT "job_types_business_id_fkey";

-- DropTable
DROP TABLE "job_types";
