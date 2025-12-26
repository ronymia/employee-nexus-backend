/*
  Warnings:

  - The `end_date` column on the `education_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `start_date` on the `education_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "education_history" DROP COLUMN "start_date",
ADD COLUMN     "start_date" DATE NOT NULL,
DROP COLUMN "end_date",
ADD COLUMN     "end_date" DATE;
