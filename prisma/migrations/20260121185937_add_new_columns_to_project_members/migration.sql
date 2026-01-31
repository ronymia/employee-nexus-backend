/*
  Warnings:

  - Added the required column `start_date` to the `project_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_user_id_fkey";

-- AlterTable
ALTER TABLE "project_members" ADD COLUMN     "end_date" DATE,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "start_date" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "project_members_user_id_is_active_idx" ON "project_members"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "project_members_start_date_end_date_idx" ON "project_members"("start_date", "end_date");

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "employees"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
