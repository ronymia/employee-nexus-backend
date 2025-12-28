/*
  Warnings:

  - You are about to drop the column `deleted_by` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "deleted_by",
ALTER COLUMN "business_id" DROP NOT NULL;
