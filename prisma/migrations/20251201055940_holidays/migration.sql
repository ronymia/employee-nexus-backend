-- CreateEnum
CREATE TYPE "HolidayType" AS ENUM ('PUBLIC', 'RELIGIOUS', 'COMPANY_SPECIFIC', 'REGIONAL');

-- CreateTable
CREATE TABLE "holidays" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "is_paid" BOOLEAN NOT NULL DEFAULT true,
    "holiday_type" "HolidayType" NOT NULL,
    "business_id" INTEGER,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "holidays_business_id_idx" ON "holidays"("business_id");

-- CreateIndex
CREATE INDEX "holidays_start_date_end_date_idx" ON "holidays"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "holidays_business_id_start_date_idx" ON "holidays"("business_id", "start_date");

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
