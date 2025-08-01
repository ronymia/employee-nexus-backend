/*
  Warnings:

  - You are about to drop the column `is_enabled` on the `business_modules` table. All the data in the column will be lost.
  - You are about to drop the column `service_plan_id` on the `business_modules` table. All the data in the column will be lost.
  - You are about to drop the column `system_module_id` on the `business_modules` table. All the data in the column will be lost.
  - You are about to drop the column `service_plan_id` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the `service_plan_modules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_modules` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[business_id,module_id]` on the table `business_modules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `business_id` to the `business_modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `module_id` to the `business_modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscription_plan_id` to the `businesses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "business_modules" DROP CONSTRAINT "business_modules_service_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "business_modules" DROP CONSTRAINT "business_modules_system_module_id_fkey";

-- DropForeignKey
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_service_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "service_plan_modules" DROP CONSTRAINT "service_plan_modules_service_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "service_plan_modules" DROP CONSTRAINT "service_plan_modules_system_module_id_fkey";

-- DropForeignKey
ALTER TABLE "service_plans" DROP CONSTRAINT "service_plans_created_by_fkey";

-- DropIndex
DROP INDEX "business_modules_service_plan_id_system_module_id_key";

-- AlterTable
ALTER TABLE "business_modules" DROP COLUMN "is_enabled",
DROP COLUMN "service_plan_id",
DROP COLUMN "system_module_id",
ADD COLUMN     "business_id" INTEGER NOT NULL,
ADD COLUMN     "module_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "service_plan_id",
ADD COLUMN     "subscription_plan_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "service_plan_modules";

-- DropTable
DROP TABLE "service_plans";

-- DropTable
DROP TABLE "system_modules";

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "setup_fee" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Active',
    "price" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plan_modules" (
    "subscription_plan_id" INTEGER NOT NULL,
    "module_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_key" ON "subscription_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "modules_name_key" ON "modules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_modules_subscription_plan_id_module_id_key" ON "subscription_plan_modules"("subscription_plan_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_modules_business_id_module_id_key" ON "business_modules"("business_id", "module_id");

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_plans" ADD CONSTRAINT "subscription_plans_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_plan_modules" ADD CONSTRAINT "subscription_plan_modules_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_plan_modules" ADD CONSTRAINT "subscription_plan_modules_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_modules" ADD CONSTRAINT "business_modules_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_modules" ADD CONSTRAINT "business_modules_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
