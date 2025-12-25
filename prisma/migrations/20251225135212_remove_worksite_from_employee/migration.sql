/*
  Warnings:

  - You are about to drop the column `work_site_id` on the `employees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_work_site_id_fkey";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "work_site_id";

-- CreateTable
CREATE TABLE "user_work_sites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "work_site_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_work_sites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_work_sites_user_id_idx" ON "user_work_sites"("user_id");

-- CreateIndex
CREATE INDEX "user_work_sites_work_site_id_idx" ON "user_work_sites"("work_site_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_work_sites_user_id_work_site_id_key" ON "user_work_sites"("user_id", "work_site_id");

-- AddForeignKey
ALTER TABLE "user_work_sites" ADD CONSTRAINT "user_work_sites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "employees"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_work_sites" ADD CONSTRAINT "user_work_sites_work_site_id_fkey" FOREIGN KEY ("work_site_id") REFERENCES "work_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
