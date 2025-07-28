-- CreateTable
CREATE TABLE "payment_settings" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "payment_type" TEXT NOT NULL,
    "day_of_week" INTEGER DEFAULT 0,
    "day_of_month" INTEGER DEFAULT 5,

    CONSTRAINT "payment_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_settings_business_id_key" ON "payment_settings"("business_id");

-- AddForeignKey
ALTER TABLE "payment_settings" ADD CONSTRAINT "payment_settings_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
