/*
  Warnings:

  - You are about to alter the column `break_minutes` on the `attendance_punches` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `work_minutes` on the `attendance_punches` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `punch_in_by` to the `attendance_punches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attendance_punches" ADD COLUMN     "break_end" TIMESTAMP(3),
ADD COLUMN     "break_start" TIMESTAMP(3),
ADD COLUMN     "punch_in_by" INTEGER NOT NULL,
ADD COLUMN     "punch_out_by" INTEGER,
ALTER COLUMN "break_minutes" SET DATA TYPE INTEGER,
ALTER COLUMN "work_minutes" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "attendances" ALTER COLUMN "break_minutes" SET DEFAULT 0,
ALTER COLUMN "total_minutes" SET DEFAULT 0;
