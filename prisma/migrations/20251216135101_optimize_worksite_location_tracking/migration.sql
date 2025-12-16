/*
  Warnings:

  - You are about to drop the column `created_by` on the `designations` table. All the data in the column will be lost.
  - You are about to drop the column `is_geo_location_enabled` on the `work_sites` table. All the data in the column will be lost.
  - You are about to drop the column `is_ip_enabled` on the `work_sites` table. All the data in the column will be lost.
  - You are about to drop the column `is_location_enabled` on the `work_sites` table. All the data in the column will be lost.
  - You are about to drop the column `maxRadius` on the `work_sites` table. All the data in the column will be lost.
  - Made the column `business_id` on table `designations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `business_id` on table `work_sites` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "LocationTrackingType" AS ENUM ('NONE', 'MANUAL', 'GEO_FENCING', 'IP_WHITELIST');

-- DropForeignKey
ALTER TABLE "designations" DROP CONSTRAINT "designations_created_by_fkey";

-- AlterTable
ALTER TABLE "designations" DROP COLUMN "created_by",
ALTER COLUMN "business_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "work_sites" DROP COLUMN "is_geo_location_enabled",
DROP COLUMN "is_ip_enabled",
DROP COLUMN "is_location_enabled",
DROP COLUMN "maxRadius",
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ADD COLUMN     "location_tracking_type" "LocationTrackingType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "max_radius" INTEGER,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "business_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "work_sites_status_idx" ON "work_sites"("status");
