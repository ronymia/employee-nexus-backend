/*
  Warnings:

  - You are about to drop the `AttendanceSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttendanceSettings" DROP CONSTRAINT "AttendanceSettings_business_id_fkey";

-- DropForeignKey
ALTER TABLE "BusinessSettings" DROP CONSTRAINT "BusinessSettings_business_id_fkey";

-- DropTable
DROP TABLE "AttendanceSettings";

-- DropTable
DROP TABLE "BusinessSettings";

-- CreateTable
CREATE TABLE "business_settings" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "identifier_prefix" TEXT NOT NULL,
    "business_start_day" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "is_self_registered" BOOLEAN NOT NULL DEFAULT false,
    "business_time_zone" TEXT DEFAULT 'Asia/Dhaka',
    "delete_read_notifications" "DeleteReadNotifications" NOT NULL DEFAULT '30_days',
    "theme" TEXT,

    CONSTRAINT "business_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_settings" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "punch_in_time_tolerance" INTEGER NOT NULL DEFAULT 15,
    "punch_in_out_alert" BOOLEAN NOT NULL DEFAULT true,
    "punch_in_out_interval" INTEGER NOT NULL DEFAULT 1,
    "auto_approval" BOOLEAN NOT NULL DEFAULT false,
    "is_geo_location_enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "attendance_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_settings" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "start_month" INTEGER NOT NULL DEFAULT 1,
    "auto_approval" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "leave_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_settings_business_id_key" ON "business_settings"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_settings_business_id_key" ON "attendance_settings"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "leave_settings_business_id_key" ON "leave_settings"("business_id");

-- AddForeignKey
ALTER TABLE "business_settings" ADD CONSTRAINT "business_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_settings" ADD CONSTRAINT "attendance_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_settings" ADD CONSTRAINT "leave_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
