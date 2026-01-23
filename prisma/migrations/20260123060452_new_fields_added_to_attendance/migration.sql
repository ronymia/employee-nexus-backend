/*
  Warnings:

  - You are about to drop the column `rejection_reason` on the `leaves` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "reviewed_at" TIMESTAMP(3),
ADD COLUMN     "reviewed_by" INTEGER;

-- AlterTable
ALTER TABLE "leaves" DROP COLUMN "rejection_reason",
ADD COLUMN     "remarks" TEXT;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
