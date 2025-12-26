/*
  Warnings:

  - The `end_date` column on the `job_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `start_date` on the `job_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "employee_schedule_assignments" ALTER COLUMN "start_date" SET DATA TYPE DATE,
ALTER COLUMN "end_date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "job_history" DROP COLUMN "start_date",
ADD COLUMN     "start_date" DATE NOT NULL,
DROP COLUMN "end_date",
ADD COLUMN     "end_date" DATE;
