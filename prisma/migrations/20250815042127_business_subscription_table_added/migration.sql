/*
  Warnings:

  - The values [Trail_Expired] on the enum `BusinessStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [7_days,15_days,30_days] on the enum `DeleteReadNotifications` will be removed. If these variants are still used in the database, this will fail.
  - The values [none,partial_roll_over,full_roll_over] on the enum `LeaveRolloverType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `is_subscribed` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `trail_end_date` on the `businesses` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('Active', 'Inactive', 'Trial', 'Expired', 'Cancelled');

-- AlterEnum
BEGIN;
CREATE TYPE "BusinessStatus_new" AS ENUM ('Active', 'Inactive', 'Suspended', 'Trial_Expired');
ALTER TABLE "businesses" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "businesses" ALTER COLUMN "status" TYPE "BusinessStatus_new" USING ("status"::text::"BusinessStatus_new");
ALTER TYPE "BusinessStatus" RENAME TO "BusinessStatus_old";
ALTER TYPE "BusinessStatus_new" RENAME TO "BusinessStatus";
DROP TYPE "BusinessStatus_old";
ALTER TABLE "businesses" ALTER COLUMN "status" SET DEFAULT 'Active';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DeleteReadNotifications_new" AS ENUM ('7', '15', '30');
ALTER TABLE "business_settings" ALTER COLUMN "delete_read_notifications" DROP DEFAULT;
ALTER TABLE "business_settings" ALTER COLUMN "delete_read_notifications" TYPE "DeleteReadNotifications_new" USING ("delete_read_notifications"::text::"DeleteReadNotifications_new");
ALTER TYPE "DeleteReadNotifications" RENAME TO "DeleteReadNotifications_old";
ALTER TYPE "DeleteReadNotifications_new" RENAME TO "DeleteReadNotifications";
DROP TYPE "DeleteReadNotifications_old";
ALTER TABLE "business_settings" ALTER COLUMN "delete_read_notifications" SET DEFAULT '30';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LeaveRolloverType_new" AS ENUM ('None', 'Partial_Rollover', 'Full_Rollover');
ALTER TABLE "leave_types" ALTER COLUMN "leave_rollover_type" DROP DEFAULT;
ALTER TABLE "leave_types" ALTER COLUMN "leave_rollover_type" TYPE "LeaveRolloverType_new" USING ("leave_rollover_type"::text::"LeaveRolloverType_new");
ALTER TYPE "LeaveRolloverType" RENAME TO "LeaveRolloverType_old";
ALTER TYPE "LeaveRolloverType_new" RENAME TO "LeaveRolloverType";
DROP TYPE "LeaveRolloverType_old";
ALTER TABLE "leave_types" ALTER COLUMN "leave_rollover_type" SET DEFAULT 'None';
COMMIT;

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'Deactivated';

-- AlterTable
ALTER TABLE "business_settings" ALTER COLUMN "delete_read_notifications" SET DEFAULT '30';

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "is_subscribed",
DROP COLUMN "trail_end_date",
ALTER COLUMN "registration_date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "leave_types" ALTER COLUMN "leave_rollover_type" SET DEFAULT 'None';

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "date_of_birth" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'Unverified';

-- CreateTable
CREATE TABLE "business_subscriptions" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "subscription_plan_id" INTEGER NOT NULL,
    "trial_end_date" TEXT,
    "start_date" TEXT,
    "end_date" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'Trial',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_subscriptions_business_id_subscription_plan_id_key" ON "business_subscriptions"("business_id", "subscription_plan_id");

-- AddForeignKey
ALTER TABLE "business_subscriptions" ADD CONSTRAINT "business_subscriptions_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_subscriptions" ADD CONSTRAINT "business_subscriptions_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
