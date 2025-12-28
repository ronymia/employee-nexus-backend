/*
  Warnings:

  - A unique constraint covering the columns `[owner_id]` on the table `businesses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_id` to the `businesses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business_subscriptions" ALTER COLUMN "trial_end_date" SET DATA TYPE DATE,
ALTER COLUMN "start_date" SET DATA TYPE DATE,
ALTER COLUMN "end_date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "owner_id" INTEGER NOT NULL,
ALTER COLUMN "registration_date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "joining_date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "date_of_birth" SET DATA TYPE DATE;

-- CreateIndex
CREATE UNIQUE INDEX "businesses_owner_id_key" ON "businesses"("owner_id");

-- CreateIndex
CREATE INDEX "businesses_owner_id_idx" ON "businesses"("owner_id");

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
