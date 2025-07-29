/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `leave_types` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `leave_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "leave_types" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "leave_types_name_key" ON "leave_types"("name");
