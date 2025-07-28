-- CreateTable
CREATE TABLE "AttendanceSettings" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "punch_in_time_tolerance" INTEGER NOT NULL DEFAULT 15,
    "punch_in_out_alert" BOOLEAN NOT NULL DEFAULT true,
    "punch_in_out_interval" INTEGER NOT NULL DEFAULT 1,
    "auto_approval" BOOLEAN NOT NULL DEFAULT false,
    "is_geo_location_enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AttendanceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSettings_business_id_key" ON "AttendanceSettings"("business_id");

-- AddForeignKey
ALTER TABLE "AttendanceSettings" ADD CONSTRAINT "AttendanceSettings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
