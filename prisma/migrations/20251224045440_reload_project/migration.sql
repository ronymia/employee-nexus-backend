/*
  Warnings:

  - You are about to drop the column `joined_at` on the `project_members` table. All the data in the column will be lost.
  - You are about to drop the column `cover` on the `projects` table. All the data in the column will be lost.
  - The `start_date` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `end_date` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "project_members" DROP COLUMN "joined_at";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "cover",
DROP COLUMN "start_date",
ADD COLUMN     "start_date" DATE,
DROP COLUMN "end_date",
ADD COLUMN     "end_date" DATE;
