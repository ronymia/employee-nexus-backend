/*
  Warnings:

  - You are about to drop the column `created_by` on the `asset_types` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "asset_types" DROP CONSTRAINT "asset_types_created_by_fkey";

-- AlterTable
ALTER TABLE "asset_types" DROP COLUMN "created_by";
