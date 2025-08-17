/*
  Warnings:

  - You are about to drop the column `module_id` on the `business_modules` table. All the data in the column will be lost.
  - You are about to drop the column `module_id` on the `subscription_plan_modules` table. All the data in the column will be lost.
  - You are about to drop the `modules` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[business_id,system_module_id]` on the table `business_modules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subscription_plan_id,system_module_id]` on the table `subscription_plan_modules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `system_module_id` to the `business_modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `system_module_id` to the `subscription_plan_modules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "business_modules" DROP CONSTRAINT "business_modules_module_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription_plan_modules" DROP CONSTRAINT "subscription_plan_modules_module_id_fkey";

-- DropIndex
DROP INDEX "business_modules_business_id_module_id_key";

-- DropIndex
DROP INDEX "subscription_plan_modules_subscription_plan_id_module_id_key";

-- AlterTable
ALTER TABLE "business_modules" DROP COLUMN "module_id",
ADD COLUMN     "system_module_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subscription_plan_modules" DROP COLUMN "module_id",
ADD COLUMN     "system_module_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "modules";

-- CreateTable
CREATE TABLE "system_modules" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "system_modules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_modules_name_key" ON "system_modules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "business_modules_business_id_system_module_id_key" ON "business_modules"("business_id", "system_module_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_modules_subscription_plan_id_system_modul_key" ON "subscription_plan_modules"("subscription_plan_id", "system_module_id");

-- AddForeignKey
ALTER TABLE "subscription_plan_modules" ADD CONSTRAINT "subscription_plan_modules_system_module_id_fkey" FOREIGN KEY ("system_module_id") REFERENCES "system_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_modules" ADD CONSTRAINT "business_modules_system_module_id_fkey" FOREIGN KEY ("system_module_id") REFERENCES "system_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
