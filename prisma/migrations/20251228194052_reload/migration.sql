/*
  Warnings:

  - You are about to drop the column `break_hours` on the `work_schedules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "work_schedules" DROP COLUMN "break_hours",
ADD COLUMN     "break_minutes" INTEGER NOT NULL DEFAULT 0;
