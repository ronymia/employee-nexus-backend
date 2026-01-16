/*
  Warnings:

  - Changed the type of `status` on the `business_subscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BusinessSubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED', 'PENDING');

-- AlterTable
ALTER TABLE "business_subscriptions" DROP COLUMN "status",
ADD COLUMN     "status" "BusinessSubscriptionStatus" NOT NULL;

-- DropEnum
DROP TYPE "SubscriptionStatus";
