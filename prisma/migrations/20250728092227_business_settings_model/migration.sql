/*
  Warnings:

  - You are about to drop the column `lng` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `profiles` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DeleteReadNotifications" AS ENUM ('7_days', '15_days', '30_days');

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "lng",
ADD COLUMN     "long" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "lng",
ADD COLUMN     "long" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "BusinessSettings" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "identifier_prefix" TEXT NOT NULL,
    "business_start_day" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "is_self_registered" BOOLEAN NOT NULL DEFAULT false,
    "business_time_zone" TEXT DEFAULT 'Asia/Dhaka',
    "delete_read_notifications" "DeleteReadNotifications" NOT NULL DEFAULT '30_days',
    "theme" TEXT,

    CONSTRAINT "BusinessSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSettings_business_id_key" ON "BusinessSettings"("business_id");

-- AddForeignKey
ALTER TABLE "BusinessSettings" ADD CONSTRAINT "BusinessSettings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
