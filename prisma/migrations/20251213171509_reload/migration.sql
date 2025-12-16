/*
  Warnings:

  - You are about to drop the column `default_payment_method` on the `payment_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment_settings" DROP COLUMN "default_payment_method",
ADD COLUMN     "payment_method" TEXT,
ALTER COLUMN "payment_frequency" DROP NOT NULL;

-- DropEnum
DROP TYPE "PaymentFrequency";

-- DropEnum
DROP TYPE "PaymentMethod";
